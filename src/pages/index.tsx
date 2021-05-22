import React from 'react'
import {
  Flex,
  useToast,
  useColorMode,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
  UseToastOptions,
} from '@chakra-ui/react'
import useSWR, { mutate } from 'swr'

import { Page } from '../components/Page'
import { Container } from '../components/Container'
import { Project } from '../components/Project'
import { FETCH_ALL_PROJECTS } from '../graphql/queries'
import { queryFetcher } from '../utils/request'
import { ProjectSkeleton } from '../components/ProjectSkeleton'
import { ADD_NEW_PROJECT } from '../graphql/mutations'
import { FetchProjectResponse } from '../utils/types/pages'
import { useUser } from '../utils/hooks'

const Index = () => {
  const toast = useToast()
  const { colorMode } = useColorMode()
  const { userId, token } = useUser()
  const [projectName, setProjectName] = React.useState<string>('')

  const bg = { light: '#fafafa', dark: 'grey' }
  const flexBg = { light: 'white', dark: 'black' }

  const { data } = useSWR(Boolean(token) ? FETCH_ALL_PROJECTS : null, (query) =>
    queryFetcher(query, null, token),
  )

  const projects: Array<FetchProjectResponse> = data?.projects ?? []

  const renderProjects = () => {
    if (!data) {
      return (
        <>
          <ProjectSkeleton maxW="96" />
          <ProjectSkeleton maxW="96" />
          <ProjectSkeleton maxW="96" />
        </>
      )
    }
    if (data?.projects.length > 0) {
      return projects.map((project) => <Project key={project.id} {...project} maxW="96" />)
    }
  }

  const context = { projectName, userId, token, setProjectName, toast }

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
            <form
              style={{ width: '100%' }}
              onSubmit={(e) => {
                e.preventDefault()
                handleFormSubmit(context)
              }}
            >
              <Flex alignItems="center">
                <InputGroup size="lg">
                  <InputLeftAddon children="Add" />
                  <Input
                    placeholder="Evil rabbit"
                    size="lg"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
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
          {renderProjects()}
        </VStack>
      </Container>
    </Page>
  )
}

const handleFormSubmit = async (context: {
  projectName: string
  userId: string | null
  token: string | null
  setProjectName: (projectName: string) => void
  toast: (config: UseToastOptions) => void
}) => {
  const { projectName, userId, token, setProjectName, toast } = context

  if (projectName === '') return

  try {
    await queryFetcher(ADD_NEW_PROJECT, { name: projectName, userId, createdAt: Date.now() }, token)
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

export default Index
