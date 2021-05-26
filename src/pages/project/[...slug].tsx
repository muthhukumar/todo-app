import React from 'react'
import {
  Flex,
  useToast,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react'
import useSWR, { mutate } from 'swr'

import { Page } from '../../components/Page'
import { Container } from '../../components/Container'
import { FETCH_TODO_OF_PROJECT } from '../../graphql/queries'
import { queryFetcher } from '../../utils/request'
import { useRouter } from 'next/router'
import { Todo } from '../../components/Todo'
import { ADD_TODO_TO_PROJECT, removeTodoMutation, toggleComplete } from '../../graphql/mutations'
import { useUser } from '../../utils/hooks'
import { AddItemBanner } from '../../components/AddItemBanner'
import { getProjectDetail } from '../../utils/router'

import type { TodoType } from '../../utils/types'

const Index = () => {
  const { token, userId } = useUser()
  const [todoName, setTodoName] = React.useState<string>('')
  const toast = useToast()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const flexBg = useColorModeValue('white', 'black')
  const bg = useColorModeValue('#fafafa', 'grey')

  const router = useRouter()
  const [projectName, id] = getProjectDetail(router)

  const QUERY = `${FETCH_TODO_OF_PROJECT}/${id}`

  const { data } = useSWR(token ? QUERY : null, () =>
    queryFetcher(FETCH_TODO_OF_PROJECT, { projectId: id }, token),
  )

  const todos: Array<TodoType> = data?.todo ?? []

  const handleToggleDone = async (todoId: string, isDone: boolean) => {
    try {
      await queryFetcher(toggleComplete(todoId), { done: !isDone }, token)
      mutate(QUERY)
      toast({ title: 'Updated successfully', status: 'success', position: 'top-right' })
    } catch (error) {
      toast({
        title: 'Failed to update',
        description: 'Something went wrong. Unable to update the item',
        status: 'error',
        position: 'top-right',
      })
    }
  }

  const handleRemove = async (todoId: string) => {
    try {
      await queryFetcher(removeTodoMutation(todoId), {}, token)
      mutate(QUERY)
      toast({ title: 'Removed item successfully', position: 'top-right' })
    } catch (error) {
      toast({
        title: 'Something went wrong. Failed to Remove.',
        status: 'error',
        position: 'top-right',
      })
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
      toast({ title: 'Added item successfully', status: 'success', position: 'top-right' })
    } catch (error) {
      toast({
        title: 'Something went wrong. Failed to Add item.',
        status: 'error',
        position: 'top-right',
      })
    }
  }

  const renderTodos = () => {
    if (todos.length > 0) {
      return (
        <SimpleGrid columns={[1, 1, 1, 2]} spacing={8} w="100%">
          {todos.map((todo) => (
            <Todo key={todo.id} {...todo} onToggle={handleToggleDone} onDelete={handleRemove} />
          ))}
        </SimpleGrid>
      )
    }
  }

  return (
    <Page
      title={`${projectName} - Todos`}
      description="Todos for a project that is created by the user."
    >
      <Container w="100%" bg={bg}>
        <Flex w="100%" bg={flexBg} h="56">
          <Flex
            w="100%"
            maxW="container.lg"
            flexDir="row"
            mx="auto"
            px={[6, 7, 8, 10]}
            alignItems="center"
            pb="12"
          >
            <form style={{ width: '100%' }} onSubmit={handleSubmit}>
              <Flex alignItems="center">
                <InputGroup size="lg">
                  <InputLeftAddon children="Add" />
                  <Input
                    ref={inputRef}
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
          px={[6, 7, 8, 10]}
          mt="-12"
          spacing="4"
        >
          {todos?.length === 0 ? (
            <AddItemBanner title="Add Todo" onAdd={() => inputRef.current?.focus()} />
          ) : (
            renderTodos()
          )}
        </VStack>
      </Container>
    </Page>
  )
}

export default Index
