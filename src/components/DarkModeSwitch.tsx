import React from 'react'

import { useColorMode, Switch, IconButton } from '@chakra-ui/react'
import { FaSun } from 'react-icons/fa'
import { RiMoonFill } from 'react-icons/ri'

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return <Switch colorScheme="grey" isChecked={isDark} onChange={toggleColorMode} size="lg" />
}

export const ThemeSwitchButton = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const bg = { dark: '#fafafa', light: 'grey' }

  return isDark ? (
    <IconButton
      variant="outline"
      color={bg[colorMode]}
      aria-label="switch to light theme"
      icon={<FaSun />}
      onClick={toggleColorMode}
      border="none"
    />
  ) : (
    <IconButton
      variant="outline"
      color={bg[colorMode]}
      colorScheme="telegram"
      aria-label="switch to light theme"
      icon={<RiMoonFill />}
      onClick={toggleColorMode}
      border="none"
    />
  )
}
