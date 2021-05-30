import { Flex, useColorMode, ContainerProps } from '@chakra-ui/react'

export const Container = (props: ContainerProps) => {
  const { colorMode } = useColorMode()

  const bgColor = { light: 'gray.50', dark: 'gray.900' }

  const color = { light: 'black', dark: 'white' }
  return (
    // <Flex
    //   direction="column"
    //   alignItems="center"
    //   justifyContent="flex-start"
    //   bg={bgColor[colorMode]}
    //   color={color[colorMode]}
    //   {...props}
    // />
    <Container
      bg={bgColor[colorMode]}
      color={color[colorMode]}
      flexDir="column"
      maxW={['100%', '100%', 'container.lg', 'container.lg']}
      {...props}
    />
  )
}
