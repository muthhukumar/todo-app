import React from 'react'
import { Box } from '@chakra-ui/react'
import { useSession } from 'next-auth/client'

import { Hero } from './Hero'

export const Main = (props: any) => {
  const [session, loading] = useSession()

  const loggedIn = Boolean(session)

  const h = loggedIn ? '110px' : '72px'

  if (loading) {
    return null
  }

  if (!loggedIn) {
    return (
      <Box height={`calc(100vh - ${h})`}>
        <Hero />
      </Box>
    )
  }

  return <Box minHeight={`calc(100vh - ${h})`}>{props.children}</Box>
}
