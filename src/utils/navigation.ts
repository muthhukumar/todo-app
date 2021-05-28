import type { ColorMode } from '@chakra-ui/react'

type PathConfig = {
  [key: number]: {
    borderBottomWidth: string
    borderBottomColor?: string
    color?: string
  }
}

const pathConfigDark: PathConfig = {
  1: {
    borderBottomWidth: '2px',
    borderBottomColor: 'white',
  },
  0: {
    borderBottomWidth: '0px',
    color: 'whiteAlpha.700',
  },
}

const pathConfigLight: PathConfig = {
  1: {
    borderBottomWidth: '2px',
    borderBottomColor: 'black',
  },
  0: {
    borderBottomWidth: '0px',
    color: 'blackAlpha.700',
  },
}

const pathConfig: { [key: string]: typeof pathConfigLight | typeof pathConfigDark } = {
  light: pathConfigLight,
  dark: pathConfigDark,
}

export const activePath = (pathName: string, activePath: string) => {
  return pathName === activePath
}

export const pathProps = (
  activePathName: string,
  colorMode: ColorMode,
  pathName: string,
): object => {
  const isActivePath = activePath(pathName, activePathName) ? 1 : 0

  return pathConfig[colorMode][+isActivePath]
}
