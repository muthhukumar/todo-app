import React from 'react'
import {
  Flex,
  chakra,
  useToast,
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
} from '@chakra-ui/react'
import _ from 'lodash'

import { Page } from '../components/Page'
import { Project } from '../components/Project'
import { FETCH_PROJECT_BY_LIMIT } from '../graphql/queries'
import { queryFetcher } from '../utils/request'
import { ProjectSkeleton } from '../components/ProjectSkeleton'
import { ADD_NEW_PROJECT } from '../graphql/mutations'
import { SearchIcon } from '@chakra-ui/icons'
import { useUser } from '../utils/hooks'
import { AddItemBanner } from '../components/AddItemBanner'
import { getFlattenData } from '../utils/main'
import { Body } from '../components/Body'
import { Wrapper } from '../components/Wrapper'
import { useInfiniteScrolling } from '../utils/hooks/useInfiniteScrolling'

import type { ProjectType } from '../utils/types'
import type { ProjectPropsType } from '../utils/types/pages/project'

const getFilteredData = (data: Array<ProjectType>, queryTerm: string, field: keyof ProjectType) => {
  return queryTerm
    ? data.filter((entry) => String(entry[field]).toLowerCase().includes(queryTerm.toLowerCase()))
    : data
}

const Projects = () => {
  const { token, userId } = useUser()

  const { isOpen, onOpen, onClose } = useDisclosure()

  const toast = useToast()

  const [searchTerm, setSearchTerm] = React.useState<string>('')

  const finalRef = React.useRef(null)
  const projectNameRef = React.useRef<HTMLInputElement>(null)

  const { data, setSize, mutate, isLoadingMore, isLoadingInitialData, isReachingEnd, result } =
    useInfiniteScrolling({
      query: FETCH_PROJECT_BY_LIMIT,
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
            <Project key={project.id} {...project} />
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

  return (
    <Page title="Projects - Todos" description="List of project created by the user.">
      <Body
        header={
          <Wrapper pt={9}>
            <Flex alignItems="center" w="100%" flexDir="row">
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.300" />} />
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
          </Wrapper>
        }
      >
        <VStack w="100%" maxW="container.lg" mx="auto" h="100%" alignItems="flex-start" mt="-28">
          {projects?.length === 0 && !isLoadingInitialData ? (
            <AddItemBanner onAdd={onOpen} title="New Project" />
          ) : (
            renderProjects()
          )}
        </VStack>
        <Box w="100%" maxW="container.lg" mx="auto" my="12">
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
                <form style={{ width: '100%' }} onSubmit={handleSubmit}>
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
      </Body>
    </Page>
  )
}

export default Projects
