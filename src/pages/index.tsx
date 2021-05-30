import React from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { Flex, Text, VStack, Box, useColorModeValue } from '@chakra-ui/react'

import { Page } from '../components/Page'
// import { Container } from '../components/Container'
import { Project } from '../components/Project'
import { FETCH_TOP_PROJECTS } from '../graphql/queries'
import { queryFetcher } from '../utils/request'
import { ProjectSkeleton } from '../components/ProjectSkeleton'
import { useUser } from '../utils/hooks'
import { AddItemBanner } from '../components/AddItemBanner'

import type { FetchProjectResponse } from '../utils/types/pages'
import { Body } from '../components/Body'

const Index = () => {
  const { token } = useUser()
  const router = useRouter()

  const bg = useColorModeValue('#fafafa', 'grey')
  const flexBg = useColorModeValue('white', 'black')
  const boxShadow = useColorModeValue('0 5px 10px #0000001f', '0 0 0 1px #333')

  const { data } = useSWR(Boolean(token) ? FETCH_TOP_PROJECTS : null, (query) =>
    queryFetcher(query, {}, token),
  )

  const projects: Array<FetchProjectResponse> = data?.projects ?? []

  const renderProjects = () => {
    if (!data) {
      return (
        <>
          <ProjectSkeleton maxW={['100%', '100%', '100%', '540px']} />
          <ProjectSkeleton maxW={['100%', '100%', '100%', '540px']} />
          <ProjectSkeleton maxW={['100%', '100%', '100%', '540px']} />
          <ProjectSkeleton maxW={['100%', '100%', '100%', '540px']} />
          <ProjectSkeleton maxW={['100%', '100%', '100%', '540px']} />
          <ProjectSkeleton maxW={['100%', '100%', '100%', '540px']} />
        </>
      )
    }
    if (data?.projects.length > 0) {
      return projects.map((project) => (
        <Project key={project.id} {...project} maxW={['100%', '100%', '540px', '540px']} />
      ))
    }
  }

  // const Body = (props: any) => {
  //   return (
  //     <Container w="100%" bg={bg} flexDir="column">
  //       {!props.showHeader && (
  //         <Flex
  //           w="100%"
  //           bg={flexBg}
  //           h="56"
  //           boxShadow={boxShadow}
  //           transition="box-shadow 0.2s ease 0s"
  //         />
  //       )}
  //       {props.children}
  //     </Container>
  //   )
  // }

  return (
    <Page
      title="Overview - Todos"
      description="Overview of latest 9 projects with details about the project."
    >
      {/* <Container w="100%" bg={bg} flexDir="column"> */}
      {/* <Flex
          w="100%"
          bg={flexBg}
          h="56"
          boxShadow={boxShadow}
          transition="box-shadow 0.2s ease 0s"
        /> */}
      <Body>
        <VStack
          w="100%"
          maxW={['100%', '100%', 'container.lg', 'container.lg']}
          mx="auto"
          h="100%"
          alignItems="flex-start"
          // px={[6, 7, 8, 10]}
          mt="-44"
          spacing="4"
        >
          {projects?.length === 0 && data ? (
            <AddItemBanner onAdd={() => router.push('/projects')} title="New Project" />
          ) : (
            renderProjects()
          )}
        </VStack>
        <Link href="/projects">
          <Box
            my="12"
            w="100%"
            maxW="container.lg"
            mx="auto"
            px={[6, 7, 8, 10]}
            textAlign={['center', 'center', 'left', 'left']}
            _hover={{ cursor: 'pointer' }}
          >
            {projects?.length > 0 && (
              <Text color="#3291ff" fontWeight="bold">
                View all projects
              </Text>
            )}
          </Box>
        </Link>
        {/* </Container> */}
      </Body>
    </Page>
  )
}

export default Index
