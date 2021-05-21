import React from 'react'
import {
  Flex,
  useToast,
  useColorMode,
  Input,
  InputGroup,
  InputLeftAddon,
  VStack,
} from '@chakra-ui/react'
import useSWR, { mutate } from 'swr'

import { Page } from '../components/Page'
import { Container } from '../components/Container'
import { useSession } from 'next-auth/client'
import { Project } from '../components/Project'
import { FETCH_ALL_PROJECTS } from '../graphql/queries'
import { queryFetcher } from '../utils/request'
import { ProjectSkeleton } from '../components/ProjectSkeleton'
import { ADD_NEW_PROJECT } from '../graphql/mutations'

const Index = () => {
  const { colorMode } = useColorMode()
  const [session] = useSession()
  const [projectName, setProjectName] = React.useState('')
  const toast = useToast()

  const token = session?.token
  const userId = session?.userId

  const { data } = useSWR(token ? FETCH_ALL_PROJECTS : null, (query) =>
    queryFetcher(query, null, session?.token),
  )

  const flexBg = { light: 'white', dark: 'black' }
  const bg = { light: '#fafafa', dark: 'grey' }

  const renderProjects = () => {
    if (!data) {
      return (
        <>
          <ProjectSkeleton />
          <ProjectSkeleton />
          <ProjectSkeleton />
        </>
      )
    }
    if (data?.projects.length > 0) {
      return data.projects.map((project) => <Project key={project.id} {...project} />)
    }
  }

  const handleSubmit = async (e) => {
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
      toast({
        title: 'Added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Failed to Add',
        description: 'Something went wrong. Unable to add the item',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
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
        >
          {renderProjects()}
        </VStack>
      </Container>
    </Page>
  )
}

export default Index
