import React from 'react'
import {
  Flex,
  useToast,
  Text,
  Input,
  InputGroup,
  VStack,
  InputLeftElement,
  useDisclosure,
  ModalOverlay,
  Modal,
  ModalContent,
  ModalBody,
  Button,
  SimpleGrid,
  Box,
  useColorModeValue,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react'
import { useSWRInfinite } from 'swr'
import _ from 'lodash'

import { Page } from '../components/Page'
import { Container } from '../components/Container'
import { Project } from '../components/Project'
import { FETCH_PROJECT_BY_LIMIT } from '../graphql/queries'
import { queryFetcher } from '../utils/request'
import { ProjectSkeleton } from '../components/ProjectSkeleton'
import { ADD_NEW_PROJECT, removeProject } from '../graphql/mutations'
import { SearchIcon } from '@chakra-ui/icons'
import { useUser } from '../utils/hooks'
import { AddItemBanner } from '../components/AddItemBanner'
import { getQuery, getOffset, getStatus, getFlattenData, PAGE_SIZE } from '../utils/main'

import type { ProjectType } from '../utils/types'
import type { ProjectPropsType } from '../utils/types/pages/project'

const getFilteredData = (data: Array<ProjectType>, queryTerm: string, field: keyof ProjectType) => {
  return queryTerm ? data.filter((entry) => String(entry[field]).toLowerCase().includes(queryTerm.toLowerCase())) : data
}

const Projects = () => {
  const { token, userId } = useUser()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()

  const toast = useToast()

  const flexBg = useColorModeValue('white', 'black')
  const bg = useColorModeValue('#fafafa', 'grey')
  const modalBg = useColorModeValue('white', 'grey')

  const [deleting, setDeleting] = React.useState<boolean>(false)
  const [searchTerm, setSearchTerm] = React.useState<string>('')

  const finalRef = React.useRef(null)
  const projectDeleteRef = React.useRef<string>('')
  const projectNameRef = React.useRef<HTMLInputElement>(null)

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    (index: number) => getQuery({ token, query: FETCH_PROJECT_BY_LIMIT, index }),
    (value: string) => {
      const offset = getOffset(value)
      return queryFetcher(FETCH_PROJECT_BY_LIMIT, { limit: PAGE_SIZE, offset }, token)
    },
    { initialSize: 1 },
  )

  const { isLoadingMore, isLoadingInitialData, isReachingEnd, result } = getStatus({
    data,
    error,
    size,
    isValidating,
    field: 'projects',
  })

  const projects = getFlattenData<ProjectPropsType & ProjectType>(result, 'projects')

  const filteredProjects = React.useMemo(
    () => getFilteredData(projects, searchTerm, 'name'),
    [searchTerm, projects],
  )

  const renderProjects = () => {
    if (!data) {
      return (
        <SimpleGrid columns={[1, 1, 2, 2]} spacing={8} w="100%">
          <ProjectSkeleton />
          <ProjectSkeleton />
          <ProjectSkeleton />
          <ProjectSkeleton />
        </SimpleGrid>
      )
    }
    if (projects.length > 0) {
      return (
        <SimpleGrid columns={[1, 1, 1, 2]} spacing={8} w="100%">
          {filteredProjects.map((project) => (
            <Project
              key={project.id}
              onDelete={() => {
                onModalOpen()
                projectDeleteRef.current = project.id
              }}
              showOption
              {...project}
            />
          ))}
        </SimpleGrid>
      )
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    const projectName = projectNameRef.current?.value ?? ''

    if (projectName === '') return

    try {
      await queryFetcher(
        ADD_NEW_PROJECT,
        {
          name: projectName,
          userId,
          createdAt: Date.now(),
        },
        token,
      )
      mutate()
      if (projectNameRef.current) {
        projectNameRef.current.value = ''
      }
      toast({ title: 'Added successfully', status: 'success', position: 'top-right' })
    } catch (error) {
      toast({
        title: 'Failed to Add',
        description: 'Something went wrong. Unable to add the item',
        status: 'error',
        position: 'top-right',
      })
    } finally {
      onClose()
    }
  }

  const handleDelete = async (projectId: string) => {
    if (!projectId) {
      onModalClose()
      return
    }

    setDeleting(true)
    try {
      await queryFetcher(removeProject(projectId), {}, token)
      mutate()
      toast({ title: 'Removed successfully', status: 'success', position: 'top-right' })
    } catch (error) {
      toast({
        title: 'Something went wrong. Failed to Remove.',
        status: 'error',
        position: 'top-right',
      })
    } finally {
      setDeleting(false)
      onModalClose()
      projectDeleteRef.current = ''
    }
  }

  return (
    <Page title="Projects - Todos" description="List of project created by the user.">
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
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<SearchIcon color="gray.300" />}
                  />
                  <Input
                    type="text"
                    placeholder="Search projects..."
                    size="md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <Button ml="4" onClick={onOpen}>
                  Add project
                </Button>
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
          mt="-28"
        >
          {projects?.length === 0 && !isLoadingInitialData ? (
            <AddItemBanner onAdd={onOpen} title="New Project" />
          ) : (
            renderProjects()
          )}
        </VStack>
        <Box w="100%" maxW="container.lg" mx="auto" px="12" my="12">
          {projects?.length >= 8 && (
            <Button
              w="100%"
              variant="outline"
              disabled={isLoadingMore || isReachingEnd}
              onClick={() => setSize((oldSize) => oldSize + 1)}
              isLoading={isLoadingMore}
            >
              {isReachingEnd ? "You've reached the end" : 'Load more'}
            </Button>
          )}
        </Box>
      </Container>
      <Modal
        initialFocusRef={projectNameRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <InputGroup>
              <form onSubmit={handleSubmit}>
                <Input
                  placeholder="Project name..."
                  variant="unstyled"
                  size="lg"
                  py="4"
                  px="2"
                  ref={projectNameRef}
                />
              </form>
            </InputGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal onClose={onModalClose} isOpen={isModalOpen} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Delete Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure to delete this projects?. Once deleted it is not reversible.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={() => handleDelete(projectDeleteRef.current)}
              mr="3"
              loadingText="Deleting"
              spinnerPlacement="start"
              isLoading={deleting}
            >
              Delete
            </Button>
            <Button onClick={onModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  )
}

export default Projects
