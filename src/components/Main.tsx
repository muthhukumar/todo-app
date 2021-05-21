import React from 'react'
import { Box } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'

import { Hero } from './Hero'

export const Main = (props: any) => {
  const [session, loading] = useSession()

  const loggedIn = Boolean(session)

  if (loading) {
    return null
  }

  if (!loggedIn) {
    return <Hero />
  }

  return <Box>{props.children}</Box>
}
