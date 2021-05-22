import React from 'react'
import {
  Flex,
  useToast,
  useColorMode,
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
} from '@chakra-ui/react'
import useSWR, { mutate } from 'swr'
import _ from 'lodash'

import { Page } from '../components/Page'
import { Container } from '../components/Container'
import { Project } from '../components/Project'
import { FETCH_ALL_PROJECTS } from '../graphql/queries'
import { queryFetcher } from '../utils/request'
import { ProjectSkeleton } from '../components/ProjectSkeleton'
import { ADD_NEW_PROJECT, removeProject } from '../graphql/mutations'
import { SearchIcon } from '@chakra-ui/icons'
import { ProjectType } from '../utils/types'
import { useUser } from '../utils/hooks'

const getFilteredData = (data: Array<ProjectType>, queryTerm: string, field: keyof ProjectType) => {
  return queryTerm ? data.filter((entry) => String(entry[field]).includes(queryTerm)) : data
}

const Projects = () => {
  const { colorMode } = useColorMode()
  const { token, userId } = useUser()
  const [projectName, setProjectName] = React.useState('')
  const [searchTerm, setSearchTerm] = React.useState('')
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const { data } = useSWR(token ? FETCH_ALL_PROJECTS : null, (query) =>
    queryFetcher(query, {}, token),
  )

  const projects: Array<ProjectType> = data?.projects ?? []

  const filteredProjects = getFilteredData(projects, searchTerm, 'name')

  const flexBg = { light: 'white', dark: 'black' }
  const bg = { light: '#fafafa', dark: 'grey' }

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
        <SimpleGrid columns={[1, 1, 2, 2]} spacing={8} w="100%">
          {filteredProjects.map((project) => (
            <Project key={project.id} {...project} onDelete={handleDelete} showOption />
          ))}
        </SimpleGrid>
      )
    }
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

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
      mutate(FETCH_ALL_PROJECTS)
      setProjectName('')
      toast({ title: 'Added successfully', status: 'success' })
    } catch (error) {
      toast({
        title: 'Failed to Add',
        description: 'Something went wrong. Unable to add the item',
        status: 'error',
      })
    }
  }

  const handleDelete = async (projectId: string) => {
    try {
      await queryFetcher(removeProject(projectId), {}, token)
      mutate(FETCH_ALL_PROJECTS)
      toast({ title: 'Removed successfully', status: 'success' })
    } catch (error) {
      toast({ title: 'Something went wrong. Failed to Remove.', status: 'error' })
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
          px="12"
          mt="-12"
        >
          {renderProjects()}
        </VStack>
      </Container>
      <Modal
        initialFocusRef={initialRef}
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
                  ref={initialRef}
                  placeholder="Project name..."
                  variant="unstyled"
                  size="lg"
                  py="4"
                  px="2"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </form>
            </InputGroup>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Page>
  )
}

export default Projects
