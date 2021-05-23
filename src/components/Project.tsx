import React from 'react'
import type { FC } from 'react'
import Link from 'next/link'
import { Text, Flex, useColorMode, Button, VStack, useDisclosure } from '@chakra-ui/react'
import moment from 'moment'

import { OptionsPopover } from './OptionsPopover'
import { ProjectPropsType } from '../utils/types/pages/project'

export const Project: FC<ProjectPropsType> = (props) => {
  const { colorMode } = useColorMode()
  const { onClose, onOpen, isOpen } = useDisclosure()
  const flexBg = { light: 'white', dark: 'black' }

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

  const latestTodos = todos.slice(0, 2)

  const renderLatestTodo = () => {
    if (latestTodos.length > 0) {
      return latestTodos.map((todo) => {
        var createAt = moment(todo.createdAt)
        var now = moment(Date.now())
        return (
          <Flex
            alignItems="center"
            key={todo?.id}
            flexDir="row"
            justifyContent="space-between"
            w="100%"
            h="100%"
            flex={1}
          >
            <Text fontSize="md">{todo.todo}</Text>
            <Text colorScheme="grey" fontSize="sm">
              {now.diff(createAt, 'days')}d
            </Text>
          </Flex>
        )
      })
    }
    return <Text>There is nothing to show</Text>
  }

  return (
    <Flex
      maxW={maxW}
      w="100%"
      flexDir="column"
      bg={flexBg[colorMode]}
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
              View
            </Button>
          </Link>
          {showOption && (
            <OptionsPopover onClose={onClose} onOpen={onOpen} isOpen={isOpen}>
              <Button
                rounded="none"
                variant="ghost"
                aria-label="Delete item"
                colorScheme="red"
                onClick={onDelete.bind(null, id)}
                w="100%"
              >
                Delete
              </Button>
            </OptionsPopover>
          )}
        </Flex>
      </Flex>
      <VStack alignItems="flex-start" p="6" borderBottomWidth="0.5px" flex="1">
        {renderLatestTodo()}
      </VStack>
      <Flex px="6" py="3" alignItems="center" justifyContent="space-between" maxH="16">
        <Text>
          Completed {completedTodos}/{totalTodos}
        </Text>
        <Text>Updated {moment(createdAt).fromNow()}</Text>
      </Flex>
    </Flex>
  )
}
