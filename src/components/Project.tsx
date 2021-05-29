import React from 'react'
import Link from 'next/link'
import { Text, Flex, Button, VStack, useColorModeValue } from '@chakra-ui/react'
import moment from 'moment'

import type { FC } from 'react'
import type { ProjectPropsType } from '../utils/types/pages/project'

export const Project: FC<ProjectPropsType> = (props) => {
  const flexBg = useColorModeValue('white', 'black')
  const liteFontColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')
  const boxShadow = useColorModeValue('0 5px 10px #0000001f', '0 0 0 1px #333')

  const {
    name = '',
    createdAt = Date.now(),
    todos = [],
    todos_aggregate = { aggregate: { count: 0 } },
    id = '',
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
      boxShadow={boxShadow}
      transition="box-shadow 0.2s ease 0s"
    >
      <Flex alignItems="center" justifyContent="space-between" p="3" borderBottomWidth="0.5px">
        <Text fontWeight="bold" fontSize="lg" wordBreak="break-word" px="2">
          {name}
        </Text>
        <Flex alignItems="center" justifyContent="flex-end">
          <Link href={`/project/${id}`}>
            <Button size="md" variant="outline" mr={0}>
              <Text fontSize="sm" color={liteFontColor}>
                View
              </Text>
            </Button>
          </Link>
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
