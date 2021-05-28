import React from 'react'
import { Container } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Hero } from '../../../components/Hero'
import { Page } from '../../../components/Page'

import type { Route } from '../../../utils/types'

const Settings = () => {
  const router = useRouter()

  const routes: Array<Route> = [
    {
      path: '/project/[slug]',
      asPath: `/project/${router?.query?.slug}?projectName=${router?.query?.projectName}`,
      pathName: 'Overview',
    },
    {
      path: `/project/[slug]/settings`,
      asPath: `/project/${router?.query?.slug}/settings?projectName=${router?.query?.projectName}`,
      pathName: 'Settings',
    },
  ]
  return (
    <Page
      title="Settings - Todos"
      description="Settings for a project. For now it is just a placeholder"
      routes={routes}
    >
      <Container height="100vh">
        <Hero />
      </Container>
    </Page>
  )
}

export default Settings
