import React from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { Text, VStack, Box } from '@chakra-ui/react'

import { Page } from '../components/Page'
import { Project } from '../components/Project'
import { FETCH_TOP_PROJECTS } from '../graphql/queries'
import { queryFetcher } from '../utils/request'
import { ProjectSkeleton } from '../components/ProjectSkeleton'
import { useUser } from '../utils/hooks'
import { AddItemBanner } from '../components/AddItemBanner'
import { Body } from '../components/Body'

import type { FetchProjectResponse } from '../utils/types/pages'

const Index = () => {
  const { token } = useUser()
  const router = useRouter()

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

  return (
    <Page
      title="Overview - Todos"
      description="Overview of latest 9 projects with details about the project."
    >
      <Body>
        <VStack
          w="100%"
          maxW={['100%', '100%', 'container.lg', 'container.lg']}
          mx="auto"
          h="100%"
          alignItems="flex-start"
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
      </Body>
    </Page>
  )
}

export default Index
