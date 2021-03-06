import { Container, Flex, Heading } from '@chakra-ui/react'

export const Hero = () => (
  <Flex justifyContent="center" alignItems="center" minH="100%" my="auto">
    <Container>
      <Heading
        fontSize={['5xl', '6xl', '7xl',"9xl"]}
        textAlign="center"
        bgGradient="linear-gradient(to-l, #007cf0, #00dfd8)"
        bgClip="text"
      >
        Develop
      </Heading>
      <Heading
        fontSize={['5xl', '6xl', '7xl',"9xl"]}
        textAlign="center"
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        bgClip="text"
      >
        Preview
      </Heading>
      <Heading
        fontSize={['5xl', '6xl', '7xl',"9xl"]}
        textAlign="center"
        bgGradient="linear-gradient(to-l, #ff4d4d, #F9CB28)"
        bgClip="text"
      >
        Ship
      </Heading>
    </Container>
  </Flex>
)
