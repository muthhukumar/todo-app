import React from 'react'
import {
  Flex,
  useToast,
  useColorMode,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
  SimpleGrid,
} from '@chakra-ui/react'
import useSWR, { mutate } from 'swr'

import { Page } from '../../components/Page'
import { Container } from '../../components/Container'
import { FETCH_TODO_OF_PROJECT } from '../../graphql/queries'
import { queryFetcher } from '../../utils/request'
import { useRouter } from 'next/router'
import { Todo } from '../../components/Todo'
import { ADD_TODO_TO_PROJECT, removeTodoMutation, toggleComplete } from '../../graphql/mutations'

import { TodoType } from '../../utils/types'
import { useUser } from '../../utils/hooks'

const Index = () => {
  const { colorMode } = useColorMode()
  const { token, userId } = useUser()
  const [todoName, setTodoName] = React.useState<string>('')
  const toast = useToast()
  const { id } = useRouter().query

  const flexBg = { light: 'white', dark: 'black' }
  const bg = { light: '#fafafa', dark: 'grey' }

  const QUERY = `${FETCH_TODO_OF_PROJECT}/${id}`

  const { data } = useSWR(token ? QUERY : null, () =>
    queryFetcher(FETCH_TODO_OF_PROJECT, { projectId: id }, token),
  )

  const todos: Array<TodoType> = data?.todo ?? []

  const handleToggleDone = async (todoId: string, isDone: boolean) => {
    try {
      await queryFetcher(toggleComplete(todoId), { done: !isDone }, token)
      mutate(QUERY)
      toast({ title: 'Updated successfully', status: 'success' })
    } catch (error) {
      toast({
        title: 'Failed to update',
        description: 'Something went wrong. Unable to update the item',
        status: 'error',
      })
    }
  }

  const handleRemove = async (todoId: string) => {
    try {
      await queryFetcher(removeTodoMutation(todoId), null, token)
      mutate(QUERY)
      toast({ title: 'Removed item successfully' })
    } catch (error) {
      toast({ title: 'Something went wrong. Failed to Remove.', status: 'error' })
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (todoName === '') return

    try {
      await queryFetcher(
        ADD_TODO_TO_PROJECT,
        {
          projectId: id,
          userId,
          createdAt: Date.now(),
          todo: todoName,
        },
        token,
      )
      mutate(QUERY)
      setTodoName('')
      toast({ title: 'Added item successfully', status: 'success' })
    } catch (error) {
      toast({ title: 'Something went wrong. Failed to Add item.', status: 'error' })
    }
  }

  const renderTodos = () => {
    if (todos.length > 0) {
      return (
        <SimpleGrid columns={[1, 1, 2, 2]} spacing={8} w="100%">
          {todos.map((todo) => (
            <Todo key={todo.id} {...todo} onToggle={handleToggleDone} onDelete={handleRemove} />
          ))}
        </SimpleGrid>
      )
    }
  }

  return (
    <Page>
      <Container w="100%" h="100vh" bg={bg[colorMode]}>
        <Flex w="100%" bg={flexBg[colorMode]} h="56">
          <Flex
            w="100%"
            maxW="container.lg"
            flexDir="row"
            mx="auto"
            px="12"
            alignItems="center"
            pb="12"
          >
            <form style={{ width: '100%' }} onSubmit={handleSubmit}>
              <Flex alignItems="center">
                <InputGroup size="lg">
                  <InputLeftAddon children="Add" />
                  <Input
                    placeholder="Evil rabbit"
                    size="lg"
                    value={todoName}
                    onChange={(e) => setTodoName(e.target.value)}
                  />
                </InputGroup>
              </Flex>
            </form>
          </Flex>
        </Flex>
        <VStack
          w="100%"
          maxW="container.lg"
          mx="auto"
          h="100%"
          alignItems="flex-start"
          px="12"
          mt="-12"
          spacing="4"
        >
          {renderTodos()}
        </VStack>
      </Container>
    </Page>
  )
}

export default Index
