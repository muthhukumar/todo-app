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
      body: {
        bg: mode('#f7fafc', '#121212')(props),
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
