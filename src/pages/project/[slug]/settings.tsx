import React from 'react'
import {
  Text,
  Container,
  Flex,
  Heading,
  useColorModeValue,
  Input,
  Button,
  Box,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Page } from '../../../components/Page'

import { useProjectName } from '../../../utils/hooks/useProjectName'
import { queryFetcher } from '../../../utils/request'
import { removeProject, UPDATE_PROJECT_NAME } from '../../../graphql/mutations'
import { useUser } from '../../../utils/hooks'

import type { Route } from '../../../utils/types'

const Settings = () => {
  const [projectNameInput, setProjectNameInput] = React.useState<string | undefined>(undefined)
  const [error, setError] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [deleting, setDeleting] = React.useState(false)
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()

  const router = useRouter()
  const toast = useToast()

  const { slug } = router.query
  const { token } = useUser()

  const { projectName, mutate } = useProjectName(slug)

  React.useEffect(() => {
    if (projectName && !projectNameInput) {
      setProjectNameInput(projectName)
      if (projectName?.length > 55) {
        setError('The name of a Project can only contain up to 55 alphanumeric')
      }
    }
  }, [projectName])

  const bg = useColorModeValue('white', 'black')
  const modalBg = useColorModeValue('white', 'grey')
  const liteFontColor = useColorModeValue('blackAlpha.700', 'whiteAlpha.700')

  const routes: Array<Route> = [
    {
      path: '/project/[slug]',
      asPath: `/project/${router?.query?.slug}`,
      pathName: 'Overview',
    },
    {
      path: `/project/[slug]/settings`,
      asPath: `/project/${router?.query?.slug}/settings`,
      pathName: 'Settings',
    },
  ]

  const renderProjectRenamePreview = () => {
    if (projectName !== projectNameInput) {
      return (
        <Box p="2" borderWidth="1px" rounded="md" mt="6">
          {projectNameInput?.length === 0 ? (
            <Text fontSize="md">Your project Name must include at least 1 letter or number.' </Text>
          ) : (
            <Text fontSize="md">
              Your project will be renamed to <strong>"{projectNameInput}"</strong>
            </Text>
          )}
        </Box>
      )
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, 55)
    setProjectNameInput(newValue)
  }

  const handleProjectRenameForm = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    if (projectNameInput === '' || (projectNameInput && projectNameInput?.length > 55)) {
      return setError('The name of a Project can only contain up to 55 alphanumeric')
    }

    setLoading(true)

    try {
      await queryFetcher(UPDATE_PROJECT_NAME, { '_eq': slug, name: projectNameInput }, token)
      mutate()
      toast({
        title: 'Updated successfully',
        position: 'top-right',
        duration: 3000,
        status: 'success',
      })
      setError('')
    } catch (error) {
      toast({ title: 'Updating failed', position: 'top-right', duration: 3000, status: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleProjectDelete = async () => {
    setDeleting(true)

    if (!slug || typeof slug !== 'string') {
      onModalClose()
      return
    }

    setDeleting(true)

    try {
      await queryFetcher(removeProject(slug), {}, token)
      toast({ title: 'Removed successfully', status: 'success', position: 'top-right' })

      router.replace('/projects')
    } catch (error) {
      toast({
        title: 'Something went wrong. Failed to Remove.',
        status: 'error',
        position: 'top-right',
      })
    } finally {
      setDeleting(false)
      onModalClose()
    }
  }

  return (
    <Page
      title="Settings - Todos"
      description="Settings for a project. For now it is just a placeholder"
      routes={routes}
    >
      <Container height="100vh" maxW="container.lg" px={[6, 7, 8, 10]}>
        <Flex
          flexDir="column"
          w="100%"
          maxW="container.md"
          borderColor="whiteAlpha"
          borderWidth="1px"
          rounded="md"
          bg={bg}
          my="4"
        >
          <form onSubmit={handleProjectRenameForm}>
            <Flex flexDir="column" p="6">
              <Heading as="h2" fontSize="xl" mb="4">
                Project Name
              </Heading>
              <Text color={liteFontColor} mb="4">
                Used to identify your project in the dashboard
              </Text>
              <Input size="md" w="60%" value={projectNameInput} onChange={onInputChange} />
              {renderProjectRenamePreview()}
            </Flex>
            <Flex p="2" alignItems="center" justifyContent="flex-end" bg="grey">
              {error && (
                <Text px="4" fontSize="sm" color="error">
                  {
                    'The name of a Project can only contain up to 50 alphanumeric lowercase characters and hyphens.'
                  }
                </Text>
              )}
              <Button size="md" px="8" isLoading={loading} onClick={handleProjectRenameForm}>
                Save
              </Button>
            </Flex>
          </form>
        </Flex>
        <Flex
          flexDir="column"
          w="100%"
          maxW="container.md"
          borderColor="whiteAlpha"
          borderWidth="1px"
          rounded="md"
          bg={bg}
          my="4"
        >
          <Flex flexDir="column" p="6">
            <Heading as="h2" fontSize="xl" mb="4">
              Delete Project
            </Heading>
            <Text color={liteFontColor} mb="4">
              The project will be permanently deleted, including its todos. This action is
              irreversible and can not be undone.
            </Text>
            {/* <Divider my="2" />
            <Text>{projectName}</Text>
              <Text>Last Updated {moment()}</Text> */}
          </Flex>
          <Flex p="2" alignItems="center" justifyContent="flex-end" bg="grey">
            <Button size="md" px="8" onClick={onModalOpen} colorScheme="red">
              Delete
            </Button>
          </Flex>
        </Flex>
      </Container>
      <Modal onClose={onModalClose} isOpen={isModalOpen} isCentered>
        <ModalOverlay />
        <ModalContent bg={modalBg}>
          <ModalHeader>Delete Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure to delete this projects?. Once deleted it is not reversible.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              onClick={handleProjectDelete}
              mr="3"
              loadingText="Deleting"
              spinnerPlacement="start"
              isLoading={deleting}
            >
              Delete
            </Button>
            <Button onClick={onModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  )
}

export default Settings
