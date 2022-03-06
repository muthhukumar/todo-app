import { Button, Text, VStack, Spacer, Flex, Box, useColorMode } from '@chakra-ui/react'
import Head from 'next/head'
import { signIn } from 'next-auth/react'
import React from 'react'

import { Container } from '../../components/Container'
import { useRouter } from 'next/router'

const SignIn = () => {
  const { colorMode } = useColorMode()

  const bgColor = { light: 'blackAlpha.800', dark: 'whiteAlpha.800' }

  const router = useRouter()

  return (
    <>
      <Head>
        <meta name="title" content="Login / Sign up" />
      </Head>
      <Container height="100vh" justifyContent="center">
        <VStack width={['95%', '95%', 'md', 'md']} px={[4, 6, null, null]}>
          <Text fontSize="3xl" fontWeight="bold" my="4">
            Sign In (or Up) with Todos
          </Text>
          <Spacer marginY="8" />
          <Flex flexDir="row" alignItems="center" width="100%">
            <Box width="90%" height="2px" bg={bgColor[colorMode]} mr="4" />
            <Text>Or</Text>
            <Box width="90%" height="2px" bg={bgColor[colorMode]} ml="4" />
          </Flex>
          <Spacer marginY="8" />
          <Button
            width="100%"
            bg="blackAlpha.800"
            color="white"
            key="Github"
            onClick={() => signIn('github', { callbackUrl: String(router.query.callbackUrl) })}
          >
            Sign In (or Up) with GitHub
          </Button>
        </VStack>
      </Container>
    </>
  )
}

export default SignIn
