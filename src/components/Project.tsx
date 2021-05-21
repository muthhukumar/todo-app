import React from 'react'
import { Text, Flex, useColorMode, Button, VStack, Badge, HStack } from '@chakra-ui/react'
import moment from 'moment'

export const Project = (props) => {
  const { colorMode } = useColorMode()
  const flexBg = { light: 'white', dark: 'black' }

  const { name = '', createdAt = Date.now(), todos = [], todos_aggregate = {} } = props

  const completedTodos = todos_aggregate?.aggregate?.count || 0

  const totalTodos = todos.length

  const latestTodos = todos.slice(0, 2)

  const renderLatestTodo = () => {
    if (latestTodos.length > 0) {
      return latestTodos.map((todo) => (
        <HStack spacing="4" key={todo?.id}>
          <Text fontSize="md">{todo.todo}</Text>
          <Badge variant="subtle" borderRadius="md" fontSize="xs">
            Latest
          </Badge>
          <Text colorScheme="grey" fontSize="sm">
            {moment(todo.createdAt).fromNow()}
          </Text>
        </HStack>
      ))
    }
    return <Text>There is nothing to show</Text>
  }

  return (
    <Flex
      maxW="lg"
      minW="lg"
      flexDir="column"
      bg={flexBg[colorMode]}
      rounded="md"
      shadow="md"
      borderColor="whiteAlpha.400"
      borderWidth="1px"
      marginBottom="4"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px="6"
        py="3"
        borderBottomWidth="0.5px"
      >
        <Text fontWeight="bold" fontSize="lg" wordBreak="break-word" px="2">
          {name}
        </Text>
        <Button size="md" variant="outline">
          View
        </Button>
      </Flex>
      <VStack alignItems="flex-start" p="6" borderBottomWidth="0.5px">
        {renderLatestTodo()}
      </VStack>
      <Flex px="6" py="3" alignItems="center" justifyContent="space-between">
        <Text>
          Completed {completedTodos}/{totalTodos}
        </Text>
        <Text>Updated {moment(createdAt).fromNow()}</Text>
      </Flex>
    </Flex>
  )
}
