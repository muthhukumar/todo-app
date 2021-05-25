import React from 'react'
import type { FC } from 'react'
import { Text, Flex, IconButton, useColorModeValue } from '@chakra-ui/react'
import { FaCheck } from 'react-icons/fa'
import { ImRadioUnchecked } from 'react-icons/im'
import { GoX } from 'react-icons/go'

import { TodoType } from '../utils/types'

interface PropsType extends TodoType {
  onDelete: (todoId: string) => void
  onToggle: (todoId: string, done: boolean) => void
}

export const Todo: FC<PropsType> = (props) => {
  const bg = useColorModeValue('white', 'black')

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
  }

  const handleDelete = () => {
    onDelete(id)
  }

  return (
    <Flex
      minW="100%"
      flexDir="column"
      bg={bg}
      rounded="md"
      shadow="md"
      borderColor="whiteAlpha"
      borderWidth="0.5px"
      overflow="hidden"
    >
      <Flex alignItems="center" w="100%" justifyContent="flex-end" p="0" borderBottomWidth="1px">
        <Flex
          alignItems="center"
          p="1px"
          borderWidth="1px"
          borderBottomLeftRadius="5px"
          borderTopRightRadius="5px"
          borderColor={done ? '#50e3c1f5' : '#ff0102d4'}
        >
          <IconButton
            aria-label={done ? 'Mark as pending' : 'Mark as complete'}
            icon={done ? <ImRadioUnchecked /> : <FaCheck />}
            onClick={onToggleDone}
            color={done ? '#50e3c1f5' : '#ff0102d4'}
            rounded="none"
            size="xs"
            bg={bg}
          />
          <IconButton
            rounded="none"
            color={done ? '#50e3c1f5' : '#ff0102d4'}
            aria-label="Delete item"
            icon={<GoX />}
            fontSize="md"
            onClick={handleDelete}
            size="xs"
            bg={bg}
          />
        </Flex>
      </Flex>
      <Text m="2" fontSize="lg">
        {todo}
      </Text>
    </Flex>
  )
}
