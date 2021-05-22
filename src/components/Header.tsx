import React from 'react'
import Link from 'next/link'
import {
  Container,
  Text,
  Flex,
  useColorMode,
  Box,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverBody,
  Stack,
  PopoverFooter,
  Avatar,
  Portal,
  ButtonGroup,
  Breadcrumb,
  BreadcrumbItem,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { signIn, signOut } from 'next-auth/client'

import { DarkModeSwitch, ThemeSwitchButton } from './DarkModeSwitch'
import { pathProps } from '../utils/navigation'
import IconDark from '../public/svg/icon-dark.svg'
import IconLight from '../public/svg/icon-light.svg'

export const Header = () => {
  const { colorMode } = useColorMode()
  const [session, loading] = useSession()

  const bgColor = { light: 'white', dark: 'black' }

  const color = { light: 'black', dark: 'white' }

  const loggedIn = Boolean(session)

  if (loading) {
    return null
  }

  return (
    <Box bg={bgColor[colorMode]} color={color[colorMode]} borderBottomWidth="1px">
      {loggedIn ? <LoggedInNavigation /> : <SignInNavigation />}
    </Box>
  )
}

const SignInNavigation = () => {
  return (
    <Container maxW="container.lg">
      <Flex flexDir="row" justifyContent="space-between" alignItems="center" py="4">
        <Text fontSize="2xl" fontWeight="bold">
          Todos
        </Text>
        <Flex alignItems="center">
          <ThemeSwitchButton />
          <ButtonGroup>
            <Button variant="ghost" onClick={() => signIn()}>
              Login
            </Button>
            <Button onClick={() => signIn()}>Sign Up</Button>
          </ButtonGroup>
          {/* <DarkModeSwitch /> */}
        </Flex>
      </Flex>
    </Container>
  )
}

const LoggedInNavigation = () => {
  const { colorMode } = useColorMode()
  const [session] = useSession()
  const router = useRouter()

  const icons = {
    light: IconDark,
    dark: IconLight,
  }

  const Icon = icons[colorMode]

  const pathName = router.pathname

  const projectName = router?.query?.projectName ?? ''

  const getPathProps = pathProps.bind(null, pathName, colorMode)

  const userIdentification =
    session?.user?.name !== 'null' ? session?.user?.name : session?.user?.email

  return (
    <>
      <Container maxW="container.lg" px="10">
        <Flex flexDir="row" justifyContent="space-between" py="2" alignItems="center" pt="4">
          <Breadcrumb spacing="6">
            <BreadcrumbItem>
              <Link href="/">
                <a>
                  <Icon height="20" />
                </a>
              </Link>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <Link href="/">
                <a>
                  <Text>{userIdentification}</Text>
                </a>
              </Link>
            </BreadcrumbItem>
            {projectName && (
              <BreadcrumbItem isCurrentPage>
                <Link href="#">
                  <a>{projectName}</a>
                </Link>
              </BreadcrumbItem>
            )}
          </Breadcrumb>
          <UserPopOver />
        </Flex>
      </Container>
      <Container maxW="container.lg" px="12">
        <Flex flexDir="row" pt="1" alignItems="center" justifyContent="flex-start">
          <Stack direction="row" spacing="8">
            <Link href="/">
              <a>
                <Text
                  borderBottomWidth="2px"
                  pb="2"
                  borderBottomColor="white"
                  {...getPathProps('/')}
                >
                  Overview
                </Text>
              </a>
            </Link>
            <Link href="/projects">
              <a>
                <Text
                  borderBottomWidth="2px"
                  pb="2"
                  borderBottomColor="white"
                  {...getPathProps('/projects')}
                >
                  projects
                </Text>
              </a>
            </Link>
            <Link href="/activity">
              <a>
                <Text
                  borderBottomWidth="2px"
                  pb="2"
                  borderBottomColor="white"
                  {...getPathProps('/activity')}
                >
                  Activity
                </Text>
              </a>
            </Link>
            <Link href="/settings">
              <a>
                <Text
                  borderBottomWidth="2px"
                  pb="2"
                  borderBottomColor="white"
                  {...getPathProps('/settings')}
                >
                  Settings
                </Text>
              </a>
            </Link>
          </Stack>
        </Flex>
      </Container>
    </>
  )
}

const UserPopOver = () => {
  const [session] = useSession()
  const { colorMode } = useColorMode()
  const color = { light: 'black', dark: 'white' }
  const bg = { dark: 'black', light: 'liteWhite' }

  const userIdentification =
    session?.user?.name !== 'null' ? session?.user?.name : session?.user?.email

  return (
    <Popover>
      <PopoverTrigger>
        <Avatar name={userIdentification || ''} src="" />
      </PopoverTrigger>
      <Portal>
        <PopoverContent maxW="56" color={color[colorMode]} bg={bg[colorMode]}>
          <PopoverArrow />
          <PopoverHeader fontWeight="bold">Dashboard</PopoverHeader>
          <PopoverBody>
            <Flex flexDir="row" alignItems="center" justifyContent="space-between">
              <Text>Theme</Text>
              <DarkModeSwitch />
            </Flex>
          </PopoverBody>
          <PopoverFooter>
            <Button width="100%" onClick={() => signOut()}>
              Logout
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
