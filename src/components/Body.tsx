import { useColorModeValue, Container, Flex } from '@chakra-ui/react'
import React, { FC } from 'react'

type BodyProps = {
  children: React.ReactNode
  header?: React.ReactNode
  showHeader?: boolean
}

export const Body: FC<BodyProps> = (props) => {
  const { children, header, showHeader = true } = props

  const bg = useColorModeValue('#fafafa', 'grey')
  const flexBg = useColorModeValue('white', 'black')
  const boxShadow = useColorModeValue('0 5px 10px #0000001f', '0 0 0 1px #333')

  return (
    <Container w="100%" bg={bg} flexDir="column">
      {showHeader && (
        <Flex
          w="100%"
          bg={flexBg}
          h="56"
          boxShadow={boxShadow}
          transition="box-shadow 0.2s ease 0s"
        >
          {header}
        </Flex>
      )}
      {children}
    </Container>
  )
}
