import React from 'react'
import type { FC } from 'react'
import Link from 'next/link'
import { Text, Flex, Button, VStack, useDisclosure, useColorModeValue } from '@chakra-ui/react'
import moment from 'moment'

import { OptionsPopover } from './OptionsPopover'
import type { ProjectPropsType } from '../utils/types/pages/project'

export const Project: FC<ProjectPropsType> = (props) => {
  const { onClose, onOpen, isOpen } = useDisclosure()
  const flexBg = useColorModeValue('white', 'black')
  const liteFontColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')

  const {
    name = '',
    createdAt = Date.now(),
    todos = [],
    todos_aggregate = { aggregate: { count: 0 } },
    id = '',
    onDelete = () => {},
    showOption = false,
    maxW = 'none',
  } = props

  const completedTodos = todos_aggregate?.aggregate?.count

  const totalTodos = todos.length

  const latestTodos = todos.slice(0, 5)

  const renderLatestTodo = () => {
    if (latestTodos.length > 0) {
      return latestTodos.map((todo) => {
        const createAt = moment(todo.createdAt)
        const now = moment(Date.now())
        return (
          <Flex
            alignItems="flex-start"
            key={todo?.id}
            flexDir="row"
            justifyContent="space-between"
            w="100%"
            h="100%"
            flex={1}
          >
            <Text fontSize="sm">{todo.todo}</Text>
            <Text color={liteFontColor} fontSize="sm">
              {now.diff(createAt, 'days')}d
            </Text>
          </Flex>
        )
      })
    }
    return <Text mb={[4, 3, 2, 1]}>There is nothing to show</Text>
  }

  return (
    <Flex
      maxW={maxW}
      w="100%"
      flexDir="column"
      bg={flexBg}
      rounded="md"
      shadow="md"
      borderColor="whiteAlpha"
      borderWidth="1px"
    >
      <Flex alignItems="center" justifyContent="space-between" p="3" borderBottomWidth="0.5px">
        <Text fontWeight="bold" fontSize="lg" wordBreak="break-word" px="2">
          {name}
        </Text>
        <Flex alignItems="center" justifyContent="flex-end">
          <Link href={`/project/${id}?projectName=${name}`}>
            <Button size="md" variant="outline" mr={showOption ? 3 : 0}>
              <Text fontSize="sm" color={liteFontColor}>
                View
              </Text>
            </Button>
          </Link>
          {showOption && (
            <OptionsPopover onClose={onClose} onOpen={onOpen} isOpen={isOpen}>
              <Button
                rounded="none"
                variant="ghost"
                aria-label="Delete item"
                onClick={onDelete.bind(null, id)}
                w="100%"
              >
                <Text fontSize="sm" color={liteFontColor}>
                  Delete
                </Text>
              </Button>
            </OptionsPopover>
          )}
        </Flex>
      </Flex>
      <VStack alignItems="flex-start" p="6" borderBottomWidth="0.5px" flex="1" pb="8">
        {renderLatestTodo()}
      </VStack>
      <Flex px="6" py="3" alignItems="center" justifyContent="space-between" maxH="16">
        <Text fontSize="sm">
          Completed {completedTodos}/{totalTodos}
        </Text>
        <Text fontSize="sm" color={liteFontColor}>
          Updated {moment(createdAt).fromNow()}
        </Text>
      </Flex>
    </Flex>
  )
}
