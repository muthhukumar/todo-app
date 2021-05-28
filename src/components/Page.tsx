import * as React from 'react'
import { NextSeo } from 'next-seo'
import Head from 'next/head'

import { Main } from './Main'
import { Footer } from './Footer'
import { Header } from './Header'
import { useColorModeValue } from '@chakra-ui/react'

import type { FC } from 'react'
import type { Route } from '../utils/types'

type PageProps = {
  title: string
  description: string
  routes?: Array<Route>
}

const defaultRoutes: Array<Route> = [
  {
    path: '/',
    asPath: '/',
    pathName: 'Overview',
  },
  {
    path: '/projects',
    asPath: '/projects',
    pathName: 'Projects',
  },
  {
    path: '/activity',
    asPath: '/activity',
    pathName: 'Activity',
  },
  {
    path: '/settings',
    asPath: '/settings',
    pathName: 'Settings',
  },
]

export const Page: FC<PageProps> = (props) => {
  const iconPath = useColorModeValue('../public/images/dark.png', '../public/images/light.png')

  const { routes = defaultRoutes } = props

  return (
    <>
      <NextSeo title={props?.title} description={props.description} />
      <Head>
        {/* <link rel="icon" href={iconPath} /> */}
        <link rel="icon" href={iconPath} />
      </Head>
      <Header routes={routes} />
      <Main>{props.children}</Main>
      <Footer></Footer>
    </>
  )
}
