import * as React from 'react'
import type { FC } from 'react'
import { NextSeo } from 'next-seo'
import Head from 'next/head'

import { Main } from './Main'
import { Footer } from './Footer'
import { Header } from './Header'
import { useColorModeValue } from '@chakra-ui/react'

type PageProps = {
  title: string
  description: string
}

export const Page: FC<PageProps> = (props) => {
  const iconPath = useColorModeValue('/public/svg/icon-dark.svg', '/public/svg/icon-light.svg')
  return (
    <>
      <NextSeo title={props?.title} description={props.description} />
      <Head>
        <link rel="icon" href={iconPath} />
      </Head>
      <Header />
      <Main>{props.children}</Main>
      <Footer></Footer>
    </>
  )
}
