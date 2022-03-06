import React from 'react'
import { Box } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'

import { Hero } from './Hero'

export const Main = (props: any) => {
  const { data, status } = useSession()

  const loggedIn = Boolean(data)

  const h = loggedIn ? '110px' : '72px'

  if (status === 'loading') {
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
