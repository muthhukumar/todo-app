import React from 'react'
import Router from 'next/router'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'next-auth/client'
import { DefaultSeo } from 'next-seo'
import _ from 'lodash'
import nprogress from 'nprogress'

import theme from '../theme'
import SEO from '../../next-seo.config'

import type { AppProps } from 'next/app'

const start = _.debounce(nprogress.start, 700)
Router.events.on('routeChangeStart', start)
Router.events.on('routeChangeComplete', () => {
  start.cancel()
  nprogress.done()
  window.scrollTo(0, 0)
})

Router.events.on('routeChangeError', () => {
  start.cancel()
  nprogress.done()
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider resetCSS theme={theme}>
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
