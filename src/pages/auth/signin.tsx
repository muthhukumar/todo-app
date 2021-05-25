import {
  Button,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Spacer,
  Flex,
  Box,
  useColorMode,
} from '@chakra-ui/react'
import { GetServerSideProps } from 'next'
import { getCsrfToken } from 'next-auth/client'
// import { useRouter } from 'next/router'
import React from 'react'

import { Container } from '../../components/Container'
import { Email } from '../../public/svg/email'

type SignInProps = {
  csrfToken: string
}

const SignIn = ({ csrfToken }: SignInProps) => {
  const { colorMode } = useColorMode()
  // const router = useRouter()

  const bgColor = { light: 'blackAlpha.800', dark: 'whiteAlpha.800' }

  return (
    <Container height="100vh" justifyContent="center">
      <VStack width={['95%', '95%', 'md', 'md']} px={[4, 6, null, null]}>
        <Text fontSize="3xl" fontWeight="bold" my="4">
          Sign In (or Up) with Todos
        </Text>
        <form method="post" action="/api/auth/signin/email" style={{ width: '100%' }}>
          <InputGroup>
            <InputLeftElement children={<Email />} />
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <Input placeholder="you@company.com" type="email" id="email" name="email" />
          </InputGroup>
          <Spacer marginY="4" />
          <Button width="100%" color="white" bg="blue.500" type="submit">
            Email an login link
          </Button>
        </form>
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
          disabled
          // onClick={() => signIn('github', { callbackUrl: String(router.query.callbackUrl) })}
          onClick={() => {}}
        >
          Sign In (or Up) with GitHub
        </Button>
      </VStack>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const csrfToken = await getCsrfToken(context)
  return {
    props: {
      csrfToken: csrfToken ? csrfToken : '',
    },
  }
}

export default SignIn
