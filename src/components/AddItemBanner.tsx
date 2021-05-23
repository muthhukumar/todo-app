import React from 'react'
import { Text, Flex, useColorModeValue } from '@chakra-ui/react'
import { AiFillFolderAdd, AiOutlineFolderAdd } from 'react-icons/ai'

export const AddItemBanner = ({ onAdd, title }: { onAdd: () => void; title: string }) => {
  const borderColor = useColorModeValue('#666', '#888')
  const AddProjectIcon = useColorModeValue(AiFillFolderAdd, AiOutlineFolderAdd)
  const bg = useColorModeValue('#fafafa', 'grey')

  return (
    <Flex
      borderRadius="md"
      borderStyle="dashed"
      borderColor={borderColor}
      bg={bg}
      w="100%"
      flexDir="column"
      py="10"
      alignItems="center"
      borderWidth="1px"
      onClick={onAdd}
      _hover={{ cursor: 'pointer' }}
    >
      <AddProjectIcon size={30} />
      <Text fontSize="md" mt="4">
        {title}
      </Text>
    </Flex>
  )
}
