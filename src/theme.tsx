import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'
import { mode } from '@chakra-ui/theme-tools'

const fonts = { mono: `'Menlo', monospace` }

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em',
})

const theme = extendTheme({
  styles: {
    global: (props) => ({
      ':root': {
        fg: mode(' #fafbfc', '#1a202c')(props),
      },
      body: {
        bg: mode('#f7fafc', '#121212')(props),
      },
      html: {
        scrollBehavior: 'smooth',
      },
      '#nprogress': {
        pointerEvents: 'none',
      },
      '#nprogress .bar': {
        position: 'fixed',
        zIndex: 2000,
        top: 0,
        left: 0,
        width: '100%',
        height: '5px',
        background: mode('#1a202c', '#fafbfc')(props),
      },
      '#nprogress::after': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '5px',
        background: 'transparent',
      },
    }),
  },
  colors: {
    grey: '#121212',
    liteWhite: '#f7fafc',
  },
  fonts,
  breakpoints,
})

export default theme
