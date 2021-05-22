import React from 'react'
import type { FC } from 'react'
import { Badge, Text, Flex, useColorMode, Button, useDisclosure, Container } from '@chakra-ui/react'
import { MdRadioButtonUnchecked } from 'react-icons/md'

import { OptionsPopover } from './OptionsPopover'
import { TodoType } from '../utils/types'

interface PropsType extends TodoType {
  onDelete: (todoId: string) => void
  onToggle: (todoId: string, done: boolean) => void
}

export const Todo: FC<PropsType> = (props) => {
  const { colorMode } = useColorMode()
  const { onClose, onOpen, isOpen } = useDisclosure()
  const flexBg = { light: 'white', dark: 'black' }

  const {
    // createdAt = Date.now(),
    done = false,
    id = '',
    todo = '',
    onToggle = () => {},
    onDelete = () => {},
  } = props

  const onToggleDone = () => {
    onToggle(id, done)
    onClose()
  }

  const handleDelete = () => {
    onDelete(id)
    onClose()
  }

  return (
    <Flex
      minW="100%"
      flexDir="column"
      bg={flexBg[colorMode]}
      rounded="md"
      shadow="md"
      borderColor="whiteAlpha"
      borderWidth="1px"
    >
      <Flex alignItems="center" justifyContent="space-between" borderBottomWidth="1px">
        <Badge
          rounded="md"
          py={1}
          px={2}
          m={2}
          color={done ? 'blue.300' : 'red'}
          colorScheme={done ? 'blue' : 'orange'}
        >
          {done ? 'Completed' : 'Pending'}
        </Badge>
        <Flex flexDir="row" alignItems="center" justifyContent="flex-end">
          <OptionsPopover onClose={onClose} onOpen={onOpen} isOpen={isOpen}>
            <Button
              rounded="none"
              variant="ghost"
              w="100%"
              aria-label="Mark as Done"
              icon={<MdRadioButtonUnchecked />}
              onClick={onToggleDone}
            >
              {done ? 'Undo' : 'Done'}
            </Button>

            <Button
              rounded="none"
              variant="ghost"
              aria-label="Delete item"
              colorScheme="red"
              onClick={handleDelete}
              w="100%"
            >
              Delete
            </Button>
          </OptionsPopover>
        </Flex>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between" py="3">
        <Container>
          <Text>{todo}</Text>
        </Container>
      </Flex>
    </Flex>
  )
}
