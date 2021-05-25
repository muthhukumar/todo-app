import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'next-auth/client'
import { DefaultSeo } from 'next-seo'

import theme from '../theme'
import SEO from '../../next-seo.config'
import React from 'react'

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
