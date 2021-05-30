import React, { FC } from 'react'
import { Container, ContainerProps } from '@chakra-ui/react'

export const Wrapper: FC<ContainerProps> = (props) => {
  return (
    <Container
      flexDir="column"
      maxW={['100%', '100%', 'container.lg', 'container.lg']}
      px={[6, 7, 8, 10]}
      {...props}
    />
  )
}
