import React from 'react'

import { queryFetcher } from '../utils/request'
import { GET_PROJECTS_COUNT, GET_TODOS_COUNT } from '../graphql/queries'
import { Stat, Text, Flex, Box, HStack, StackDivider, useColorModeValue } from '@chakra-ui/react'
import { Header } from '../components/Header'
import { GetStaticProps } from 'next'

type Stat = Partial<{
  projectCount: number
  todosCount: number
  completedTodosCount: number
}>

const About = ({ data }: { data: Stat }) => {
  const bg = useColorModeValue('whiteAlpha.900', 'blackAlpha.100')
  return (
    <>
      <Header />
      <Flex
        height="100vh"
        alignItems="center"
        justifyContent="center"
        flexDir="column"
        marginTop="-73px"
      >
        <Flex flexDir="row" alignItems="center" w="100%" justifyContent="center" bg={bg}>
          <HStack spacing="16" divider={<StackDivider borderColor="gray.200" />} py="4">
            <Box display="flex" flexDir="column" alignItems="center">
              <Text fontSize="7xl" fontWeight="bold">
                {data.projectCount}
              </Text>
              <Text fontSize="xx-large">Projects</Text>
            </Box>
            <Box display="flex" flexDir="column" alignItems="center">
              <Text fontSize="7xl" fontWeight="bold">
                {data.todosCount}
              </Text>
              <Text fontSize="xx-large">Todos</Text>
            </Box>
            <Box display="flex" flexDir="column" alignItems="center">
              <Text fontSize="7xl" fontWeight="bold">
                {data.completedTodosCount}
              </Text>
              <Text fontSize="xx-large">Todos done</Text>
            </Box>
          </HStack>
        </Flex>
      </Flex>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const data: Stat = {}

  try {
    const response = await queryFetcher(GET_PROJECTS_COUNT, {}, '', {
      'x-hasura-admin-secret': String(process.env.HASURA_ADMIN_SECRET),
    })
    data.projectCount = response?.projects_aggregate?.aggregate?.count ?? 0
  } catch (error) {
    data.projectCount = 0
  }

  try {
    const response = await queryFetcher(GET_TODOS_COUNT, {}, '', {
      'x-hasura-admin-secret': String(process.env.HASURA_ADMIN_SECRET),
    })
    const todos: Array<{ done: boolean }> = response?.todo_aggregate?.nodes ?? []

    data.completedTodosCount = todos.filter((todo) => todo?.done).length

    data.todosCount = response?.todo_aggregate?.aggregate?.count ?? 0
  } catch (error) {
    data.completedTodosCount = 0
    data.todosCount = 0
  }

  console.log(data)

  return {
    props: {
      data,
    },
    revalidate: Number(process.env.REVALIDATE) ?? 60 * 60,
  }
}

export default About