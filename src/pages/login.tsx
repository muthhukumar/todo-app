import {Button, Text, Input, InputGroup, InputLeftElement, VStack, Box} from '@chakra-ui/react'
import React from 'react'

import {Container} from '../components/Container'

const Index = () => {
  return (
    <Container height="100vh" justifyContent="center">
      <VStack width="sm">
        <InputGroup>
          <InputLeftElement children={<Email />} />
          <Input placeholder="you@company.com" />
        </InputGroup>
        <Button width="100%" color="white" bg="blue.500">
          Email an login link
        </Button>
        <Text>Or</Text>
        <Button width="100%" bg="blackAlpha.800">
          Sign In (or Up) with GitHub
        </Button>
      </VStack>
    </Container>
  )
}

const Email = () => (
  <Box width="4" height="4">
    <svg
      className="h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="grey"
      aria-hidden="true"
    >
      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
    </svg>
  </Box>
)

export default Index
