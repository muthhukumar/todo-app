import React from 'react'
import {
  Flex,
  useToast,
  Input,
  InputGroup,
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
  chakra,
  InputLeftElement,
  Textarea,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Tag,
  HStack,
  IconButton,
  FormControl,
  FormErrorMessage,
  FormLabel,
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/react'
import useSWR, { mutate } from 'swr'
import _ from 'lodash'
import { AddIcon, CloseIcon, SearchIcon } from '@chakra-ui/icons'
import { BeatLoader } from 'react-spinners'
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'

import { Page } from '../../components/Page'
import { FETCH_TODO_OF_PROJECT } from '../../graphql/queries'
import { queryFetcher } from '../../utils/request'
import { useRouter } from 'next/router'
import { Todo } from '../../components/Todo'
import {
  ADD_TODO_TO_PROJECT,
  ADD_TODO_WITH_TAG,
  REMOVE_TODO,
  toggleComplete,
} from '../../graphql/mutations'
import { useUser } from '../../utils/hooks'
import { AddItemBanner } from '../../components/AddItemBanner'
import { useProjectName } from '../../utils/hooks/useProjectName'
import { Body } from '../../components/Body'
import { Wrapper } from '../../components/Wrapper'

import type { Route, TodoType } from '../../utils/types'
import { GET_TAGS } from '../../graphql/queries/tags'
import { ADD_TAG, DELETE_TAG, UPDATE_TAG } from '../../graphql/mutations/tags'
import { getFlattenData } from '../../utils/main'

type Tag = { label: string; id: string; selected: boolean }

const getFilteredTodos = (todos: Array<TodoType>, tags: Array<Tag>) => {
  if (tags.every((tag) => !tag.selected)) return todos

  const activeTags = tags.filter((tag) => tag.selected)

  const selectedTags = getFlattenData(activeTags, 'id')

  const filteredTodos = todos.filter((todo) => {
    return getFlattenData(todo.todoTags ?? [], 'tagId').some((tag) => {
      return selectedTags.includes(tag)
    })
  })
  return filteredTodos ?? todos
}

const Index = () => {
  const [adding, setAdding] = React.useState<boolean>(false)
  const [todoName, setTodoName] = React.useState<string>('')

  const {
    handleSubmit: handleTagSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const { ref, ...rest } = register('tag', {
    required: 'This is required',
    minLength: { value: 3, message: 'Minimum length should be 3' },
    maxLength: { value: 12, message: 'Maximum length should be 12' },
  })

  const [selectedTags, setSelectedTags] = React.useState<Array<string>>([])

  const { token, userId } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isTagModalOpen,
    onOpen: onTagModalOpen,
    onClose: onTagModalClose,
  } = useDisclosure()

  const {
    isOpen: isAddModalOpen,
    onOpen: onAddModalOpen,
    onClose: onAddModalClose,
  } = useDisclosure()
  const [deleting, setDeleting] = React.useState<boolean>(false)
  const toast = useToast()

  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const todoDeleteRef = React.useRef<string>('')

  const modalBg = useColorModeValue('white', 'grey')

  const router = useRouter()

  const { slug = '' } = router.query ?? {}

  const { projectName } = useProjectName(slug)

  const QUERY = `${FETCH_TODO_OF_PROJECT}/${slug}`
  const TAG_QUERY = `${GET_TAGS}/${slug}`

  const { data } = useSWR(token ? QUERY : null, () =>
    queryFetcher(FETCH_TODO_OF_PROJECT, { projectId: slug }, token),
  )

  const { data: tagData } = useSWR(token ? TAG_QUERY : null, () =>
    queryFetcher(GET_TAGS, { '_eq': slug }, token),
  )

  const tags: Array<Tag> = tagData?.tags ?? []

  const todos = getFilteredTodos(data?.todo ?? [], tags)

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
      await queryFetcher(REMOVE_TODO, { '_eq': todoId }, token)
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

    if (!textareaRef.current) {
      onAddModalClose()
      return
    }

    if (todoName === '' || !slug) return

    setAdding(true)

    const todoId = uuidv4()

    const objects = selectedTags.map((selectedTag) => ({
      todoId,
      userId,
      tagId: selectedTag,
    }))

    const hasTags = selectedTags.length > 0

    let query = ADD_TODO_TO_PROJECT

    let variables: {
      projectId: string
      userId: string
      createdAt: number
      todo: string
      id?: string
      objects?: Array<{ todoId: string; userId: string; tagId: string }>
    } = {
      projectId: slug as string,
      userId,
      createdAt: Date.now(),
      todo: todoName,
    }

    if (hasTags) {
      query = ADD_TODO_WITH_TAG
      variables = {
        projectId: slug as string,
        userId,
        createdAt: Date.now(),
        todo: todoName,
        objects,
        id: todoId,
      }
    }

    try {
      await queryFetcher(query, variables, token)
      mutate(QUERY)
      textareaRef.current.value = ''
      toast({ title: 'Added item successfully', status: 'success', position: 'top-right' })
    } catch (error) {
      toast({
        title: 'Something went wrong. Failed to Add item.',
        status: 'error',
        position: 'top-right',
      })
    } finally {
      onAddModalClose()
      setAdding(false)
      setSelectedTags([])
      setTodoName('')
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

  const handleSelectedTagRemove = (id: string) => {
    setSelectedTags((oldSelectedTags) =>
      oldSelectedTags.filter((selectedTag) => selectedTag !== id),
    )
  }

  const handleTagDelete = async (tagId: string) => {
    try {
      await queryFetcher(
        DELETE_TAG,
        {
          '_eq': tagId,
        },
        token,
      )
      mutate(TAG_QUERY)
      toast({ title: 'Removed tag successfully', status: 'success', position: 'top-right' })
    } catch (error) {
      toast({
        title: 'Something went wrong. Failed to remove tag.',
        status: 'error',
        position: 'top-right',
      })
    }
  }

  const onTagSubmit = async ({ tag }: { [x: string]: any }) => {
    if (!tag) {
      onTagModalClose()
      return
    }

    try {
      await queryFetcher(
        ADD_TAG,
        {
          projectId: slug,
          userId,
          label: tag,
        },
        token,
      )
      mutate(TAG_QUERY)
      reset({ tag: '' })
      toast({ title: 'Added tag successfully', status: 'success', position: 'top-right' })
    } catch (error) {
      toast({
        title: 'Something went wrong. Failed to Add tag.',
        status: 'error',
        position: 'top-right',
      })
    } finally {
      onTagModalClose()
    }
  }

  const handleActiveTagSelect = async (tagId: string, selected: boolean) => {
    if (!tagId) {
      return
    }

    try {
      await queryFetcher(
        UPDATE_TAG,
        {
          '_eq': tagId,
          selected: !selected,
        },
        token,
      )
      mutate(TAG_QUERY)
    } catch (error) {}
  }

  const renderTags = () => {
    return (
      <React.Fragment>
        {tags.map((tag) => (
          <ButtonGroup isAttached rounded="full" key={tag.id}>
            <Button
              size="sm"
              variant={tag.selected ? 'solid' : 'outline'}
              onClick={handleActiveTagSelect.bind(null, tag.id, tag.selected)}
            >
              {tag.label}
            </Button>
            <IconButton
              aria-label="Add to friends"
              variant={tag.selected ? 'solid' : 'outline'}
              icon={<CloseIcon w="10px" h="10px" />}
              onClick={handleTagDelete.bind(null, tag.id)}
              size="sm"
            />
          </ButtonGroup>
        ))}
        <IconButton
          aria-label="Add to friends"
          icon={<AddIcon />}
          onClick={onTagModalOpen}
          size="sm"
        />
      </React.Fragment>
    )
  }

  return (
    <Page
      title={`${projectName} - Todos`}
      description="Todos for a project that is created by the user."
      routes={routes}
    >
      <Body
        header={
          <Wrapper px={[0, 0, 0, 10]} pt={9}>
            <chakra.form minW="100%" onSubmit={handleSubmit}>
              <Flex alignItems="center" w="100%" flexDir="row">
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<SearchIcon color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Search todos..."
                    size="md"
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <Button ml="4" onClick={onAddModalOpen}>
                  Add Todo
                </Button>
              </Flex>
            </chakra.form>
          </Wrapper>
        }
      >
        <VStack
          w="100%"
          maxW="container.lg"
          mx="auto"
          h="100%"
          alignItems="flex-start"
          mt="-16"
          spacing="4"
        >
          {todos?.length === 0 ? (
            <AddItemBanner title="Add Todo" onAdd={onAddModalOpen} />
          ) : (
            renderTodos()
          )}
        </VStack>
      </Body>
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
      <Modal
        onClose={onAddModalClose}
        isOpen={isAddModalOpen}
        isCentered
        size="xl"
        initialFocusRef={textareaRef}
      >
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Add Todo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="flex-start">
              <Textarea
                rows={5}
                ref={textareaRef}
                value={todoName}
                onChange={(e) => setTodoName(e.target.value)}
              ></Textarea>
              <HStack>
                {selectedTags.map((currentTag) => {
                  const tag = tags.find((tag) => tag.id === currentTag)
                  if (!tag) return null
                  return (
                    <Tag
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="green"
                      key={tag.id}
                    >
                      <TagLabel>{tag.label}</TagLabel>
                      <TagCloseButton onClick={handleSelectedTagRemove.bind(null, tag.id)} />
                    </Tag>
                  )
                })}
              </HStack>
              <Menu>
                <MenuButton as={Button} colorScheme="blue">
                  Add tags
                </MenuButton>
                <MenuList minWidth="240px">
                  <MenuOptionGroup
                    title="Tags"
                    type="checkbox"
                    value={selectedTags}
                    onChange={(value) => {
                      if (typeof value === 'string') {
                        return setSelectedTags([value])
                      }
                      setSelectedTags(value)
                    }}
                  >
                    {tags.map((tag) => (
                      <MenuItemOption value={tag.id} key={tag.id}>
                        {tag.label}
                      </MenuItemOption>
                    ))}
                  </MenuOptionGroup>
                </MenuList>
              </Menu>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup isAttached={false}>
              <Button onClick={onAddModalClose} colorScheme="red">
                Close
              </Button>
              <Button
                isLoading={adding}
                colorScheme="green"
                spinner={<BeatLoader size={8} color="white" />}
                onClick={handleSubmit}
              >
                Add
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal onClose={onTagModalClose} isOpen={isTagModalOpen} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Add Tag</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleTagSubmit(onTagSubmit)}>
            <ModalBody>
              <FormControl isInvalid={errors.tag}>
                <FormLabel htmlFor="tag">Tag</FormLabel>
                <Input
                  id="tag"
                  placeholder="tag"
                  {...rest}
                  ref={(e) => {
                    ref(e)
                  }}
                />
                <FormErrorMessage>{errors.tag && errors.tag.message}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onTagModalClose}>Cancel</Button>
              <Button
                colorScheme="green"
                ml="3"
                isLoading={isSubmitting}
                spinner={<BeatLoader size={8} color="white" />}
                type="submit"
              >
                Add
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Page>
  )
}

export default Index
