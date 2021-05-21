import React from 'react'
import { FlexProps } from '@chakra-ui/react'

import { Footer } from './Footer'
import { Header } from './Header'
import { Main } from './Main'

export const Page = (props: FlexProps) => {
  return (
    <>
      <Header />
      <Main>{props.children}</Main>
      <Footer></Footer>
    </>
  )
}
