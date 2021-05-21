import React from 'react'
import { Text, Flex, Skeleton, useColorMode, VStack, Badge, HStack } from '@chakra-ui/react'

export const ProjectSkeleton = () => {
  const { colorMode } = useColorMode()
  const flexBg = { light: 'white', dark: 'black' }
  return (
    <Flex
      maxW="lg"
      minW="lg"
      flexDir="column"
      bg={flexBg[colorMode]}
      rounded="md"
      shadow="md"
      borderColor="whiteAlpha.400"
      borderWidth="1px"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        px="6"
        py="3"
        borderBottomWidth="0.5px"
      >
        <Skeleton borderRadius="md">
          <Text fontWeight="bold" fontSize="lg" wordBreak="break-word" px="2">
            some Random name for now
          </Text>
        </Skeleton>
      </Flex>
      <VStack alignItems="flex-start" p="6" borderBottomWidth="0.5px">
        <Skeleton my="2">
          <HStack spacing="4">
            <Text fontSize="md">Fix the themeing</Text>
            <Badge variant="subtle" borderRadius="md" fontSize="xs">
              Latest
            </Badge>
            <Text colorScheme="grey" fontSize="sm">
              1d
            </Text>
          </HStack>
        </Skeleton>
        <Skeleton my="2">
          <HStack spacing="4">
            <Text fontSize="md">Fix the themeing</Text>
            <Badge variant="subtle" borderRadius="md" fontSize="xs">
              Latest
            </Badge>
            <Text colorScheme="grey" fontSize="sm">
              1d
            </Text>
          </HStack>
        </Skeleton>
      </VStack>
      <Flex px="6" py="3" alignItems="center" justifyContent="space-between">
        <Skeleton>
          <Text>Completed 0/10 </Text>
        </Skeleton>
        <Skeleton>
          <Text>Updated 10 days ago</Text>
        </Skeleton>
      </Flex>
    </Flex>
  )
}
