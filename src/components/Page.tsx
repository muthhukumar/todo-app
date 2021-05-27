import * as React from 'react'
import { NextSeo } from 'next-seo'
import Head from 'next/head'

import { Main } from './Main'
import { Footer } from './Footer'
import { Header } from './Header'
import { useColorModeValue } from '@chakra-ui/react'

import type { FC } from 'react'

type PageProps = {
  title: string
  description: string
}

export const Page: FC<PageProps> = (props) => {
  const iconPath = useColorModeValue('../public/images/dark.png', '../public/images/light.png')
  return (
    <>
      <NextSeo title={props?.title} description={props.description} />
      <Head>
        {/* <link rel="icon" href={iconPath} /> */}
        <link rel="icon" href={iconPath} />
      </Head>
      <Header />
      <Main>{props.children}</Main>
      <Footer></Footer>
    </>
  )
}
