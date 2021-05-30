import React from 'react'
import Link from 'next/link'
import {
  // Container,
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
  useColorModeValue,
  chakra,
  IconButton,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'
import { signIn, signOut } from 'next-auth/client'
import { useViewportScroll } from 'framer-motion'
import { DarkModeSwitch, ThemeSwitchButton } from './DarkModeSwitch'
import { pathProps } from '../utils/navigation'
import { useProjectName } from '../utils/hooks/useProjectName'

import IconDark from '../public/svg/icon-dark.svg'
import IconLight from '../public/svg/icon-light.svg'
import type { Route } from '../utils/types'
import { Container } from './Container'

export const Header = ({ routes }: { routes?: Array<Route> }) => {
  const [session, loading] = useSession()

  const bgColor = useColorModeValue('white', 'black')
  const color = useColorModeValue('black', 'white')

  const loggedIn = Boolean(session)

  if (loading) {
    return null
  }

  return (
    <Box bg={bgColor} color={color} borderBottomWidth="1px">
      {loggedIn ? <LoggedInNavigation routes={routes} /> : <SignInNavigation />}
    </Box>
  )
}

const SignInNavigation = () => {
  return (
    <Container maxW="container.lg">
      <Flex flexDir="row" justifyContent="space-between" alignItems="center" py="4">
        <Link href="/">
          <a>
            <Text fontSize="2xl" fontWeight="bold">
              Todos
            </Text>
          </a>
        </Link>
        <Flex alignItems="center">
          <ThemeSwitchButton />
          <ButtonGroup>
            <Button variant="ghost" onClick={() => signIn()}>
              Login
            </Button>
            <Button onClick={() => signIn()}>Sign Up</Button>
          </ButtonGroup>
          <Link href="/about">
            <a>
              <Text fontWeight="bold" ml="6">
                About
              </Text>
            </a>
          </Link>
        </Flex>
      </Flex>
    </Container>
  )
}

const LoggedInNavigation = ({ routes }: { routes?: Array<Route> }) => {
  const { colorMode } = useColorMode()
  const [session] = useSession()
  const router = useRouter()

  const icons = {
    light: IconDark,
    dark: IconLight,
  }

  const Icon = icons[colorMode]

  const { slug } = router.query ?? {}

  const { projectName } = useProjectName(slug)

  const userIdentification =
    session?.user?.name !== 'null' ? session?.user?.name : session?.user?.email

  return (
    <>
      <Container maxW="container.lg" px={[6, 7, 8, 10]}>
        <Flex flexDir="row" justifyContent="space-between" alignItems="center" pt="4" maxW="100%">
          <Breadcrumb spacing="6" display="flex" alignItems="center" maxW="90%" isTruncated>
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
                  <Text isTruncated>{userIdentification}</Text>
                </a>
              </Link>
            </BreadcrumbItem>
            {projectName && (
              <BreadcrumbItem isCurrentPage maxW="100%">
                <Link href="#">
                  <a>
                    <Text isTruncated>{projectName}</Text>
                  </a>
                </Link>
              </BreadcrumbItem>
            )}
          </Breadcrumb>
          <UserPopOver />
        </Flex>
      </Container>
      <StickyHeader routes={routes} />
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
        <IconButton
          aria-label="avatar"
          icon={<Avatar name={userIdentification || ''} src="" />}
          rounded="full"
          // overflow="hidden"
          display="flex"
          width="auto"
          height="auto"
        />
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

function StickyHeader({ routes }: { routes?: Array<Route> }) {
  const bg = useColorModeValue('white', 'black')
  const shadow = useColorModeValue('#0000001a', '#333')
  const { colorMode } = useColorMode()

  const ref = React.useRef<HTMLHeadingElement>(null)
  const [y, setY] = React.useState(0)
  const { height = 47 } = ref.current?.getBoundingClientRect() ?? {}

  const pathName = useRouter().pathname

  const getPathProps = pathProps.bind(null, pathName, colorMode)

  const { scrollY } = useViewportScroll()

  React.useEffect(() => {
    return scrollY.onChange(() => setY(scrollY.get()))
  }, [scrollY])

  const scrolledToTop = y >= 64

  return (
    <chakra.header h={height}>
      <Box
        position={scrolledToTop ? 'fixed' : 'static'}
        transform={scrolledToTop ? 'translateZ(100px)' : undefined}
        boxShadow={scrolledToTop ? `0 0 0 1px ${shadow}` : undefined}
        ref={ref}
        transition="box-shadow .2s ease"
        top="0"
        zIndex="3000"
        bg={bg}
        left="0"
        right="0"
        width="full"
        h={height}
      >
        <Flex
          flexDir="row"
          alignItems="center"
          justifyContent="flex-start"
          maxW="container.lg"
          px={[6, 7, 8, 10]}
          mx="auto"
        >
        {/* <Container> */}
          <Stack direction="row" spacing="8">
            {routes?.map((route) => {
              return (
                <Link href={route.asPath} key={route.pathName}>
                  <a>
                    <Text
                      fontSize="sm"
                      borderBottomWidth="2px"
                      py="3"
                      borderBottomColor="white"
                      {...getPathProps(route.path)}
                    >
                      {route.pathName}
                    </Text>
                  </a>
                </Link>
              )
            })}
          </Stack>
        {/* </Container> */}
        </Flex>
      </Box>
    </chakra.header>
  )
}
