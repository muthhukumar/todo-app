import { useColorModeValue, Flex, Box, FlexProps, ContainerProps, BoxProps } from '@chakra-ui/react'
import React, { FC } from 'react'
import { Wrapper } from './Wrapper'

type BodyProps = {
  children: React.ReactNode
  header?: React.ReactNode
  showHeader?: boolean
  headerProps?: FlexProps
  containerProps?: ContainerProps
}

export const Body: FC<BodyProps & BoxProps> = (props) => {
  const { children, header, showHeader = true, headerProps, containerProps, ...otherProps } = props

  const bg = useColorModeValue('#fafafa', 'grey')
  const flexBg = useColorModeValue('white', 'black')
  const boxShadow = useColorModeValue('0 5px 10px #0000001f', '0 0 0 1px #333')

  return (
    <Box w="100%" bg={bg} {...otherProps} minH="100vh">
      {showHeader && (
        <Flex
          w="100%"
          bg={flexBg}
          minH="56"
          boxShadow={boxShadow}
          transition="box-shadow 0.2s ease 0s"
          px={[6, 7, 8, 10]}
          {...headerProps}
        >
          {header}
        </Flex>
      )}
      <Wrapper
        flexDir="column"
        maxW={['100%', '100%', 'container.lg', 'container.lg']}
        px={[6, 7, 8, 10]}
        {...containerProps}
      >
        {children}
      </Wrapper>
    </Box>
  )
}
