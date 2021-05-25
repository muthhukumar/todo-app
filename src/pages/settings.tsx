import React from 'react'

import { Hero } from '../components/Hero'
import { Container } from '../components/Container'
import { Page } from '../components/Page'

const Settings = () => (
  <Page
    title="Settings - Todos"
    description="Settings for a project. For now it is just a placeholder"
  >
    <Container height="100vh">
      <Hero />
    </Container>
  </Page>
)

export default Settings
