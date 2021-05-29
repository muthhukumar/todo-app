import React from 'react'
import {
  Flex,
  useToast,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
  SimpleGrid,
  Text,
  useColorModeValue,
  Modal,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import useSWR, { mutate } from 'swr'
import _ from 'lodash'

import { Page } from '../../components/Page'
import { Container } from '../../components/Container'
import { FETCH_TODO_OF_PROJECT } from '../../graphql/queries'
import { queryFetcher } from '../../utils/request'
import { useRouter } from 'next/router'
import { Todo } from '../../components/Todo'
import { ADD_TODO_TO_PROJECT, removeTodoMutation, toggleComplete } from '../../graphql/mutations'
import { useUser } from '../../utils/hooks'
import { AddItemBanner } from '../../components/AddItemBanner'

import type { Route, TodoType } from '../../utils/types'
import { useProjectName } from '../../utils/hooks/useProjectName'

const Index = () => {
  const { token, userId } = useUser()
  const [todoName, setTodoName] = React.useState<string>('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleting, setDeleting] = React.useState<boolean>(false)
  const toast = useToast()

  const inputRef = React.useRef<HTMLInputElement>(null)
  const todoDeleteRef = React.useRef<string>('')

  const flexBg = useColorModeValue('white', 'black')
  const bg = useColorModeValue('#fafafa', 'grey')
  const modalBg = useColorModeValue('white', 'grey')

  const router = useRouter()

  const { slug } = router.query ?? {}

  const { projectName } = useProjectName(slug)

  const QUERY = `${FETCH_TODO_OF_PROJECT}/${slug}`

  const { data } = useSWR(token ? QUERY : null, () =>
    queryFetcher(FETCH_TODO_OF_PROJECT, { projectId: slug }, token),
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
    if (!todoId) {
      onClose()
      return
    }

    setDeleting(true)
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
    } finally {
      setDeleting(false)
      onClose()
      todoDeleteRef.current = ''
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (todoName === '') return

    try {
      await queryFetcher(
        ADD_TODO_TO_PROJECT,
        {
          projectId: slug,
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
            <Todo
              query={QUERY}
              key={todo.id}
              {...todo}
              onToggle={handleToggleDone}
              onDelete={() => {
                onOpen()
                todoDeleteRef.current = todo.id
              }}
            />
          ))}
        </SimpleGrid>
      )
    }
  }

  const routes: Array<Route> = [
    {
      path: '/project/[slug]',
      asPath: `/project/${router?.query?.slug}`,
      pathName: 'Overview',
    },
    {
      path: `/project/[slug]/settings`,
      asPath: `/project/${router?.query?.slug}/settings`,
      pathName: 'Settings',
    },
  ]

  return (
    <Page
      title={`${projectName} - Todos`}
      description="Todos for a project that is created by the user."
      routes={routes}
    >
      <Container w="100%" bg={bg}>
        <Flex w="100%" bg={flexBg} h="56">
          <Flex
            w="100%"
            maxW="container.lg"
            flexDir="row"
            mx="auto"
            px={[6, 7, 8, 10]}
            alignItems="flex-start"
            pt={9}
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
          mt="-24"
          spacing="4"
        >
          {todos?.length === 0 ? (
            <AddItemBanner title="Add Todo" onAdd={() => inputRef.current?.focus()} />
          ) : (
            renderTodos()
          )}
        </VStack>
      </Container>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Delete item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure to delete this item?. Once deleted it is not reversible.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => handleRemove(todoDeleteRef.current)}
              mr="3"
              loadingText="Deleting"
              spinnerPlacement="start"
              isLoading={deleting}
            >
              Delete
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  )
}

export default Index
