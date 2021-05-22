import * as React from 'react'
import type { FC } from 'react'

import { Main } from './Main'
import { Footer } from './Footer'
import { Header } from './Header'

export const Page: FC = (props) => {
  return (
    <>
      <Header />
      <Main>{props.children}</Main>
      <Footer></Footer>
    </>
  )
}
