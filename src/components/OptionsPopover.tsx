import * as React from 'react'
import type { FC } from 'react'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Box,
  VStack,
  StackDivider,
  useColorMode,
} from '@chakra-ui/react'
import { MdMoreVert } from 'react-icons/md'

type PropsType = {
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
}

export const OptionsPopover: FC<PropsType> = ({
  children,
  onOpen,
  onClose,
  isOpen,
  ...otherProps
}) => {
  const { colorMode } = useColorMode()
  const flexBg = { light: 'white', dark: 'black' }

  return (
    <Popover
      placement="bottom-start"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      {...otherProps}
    >
      <PopoverTrigger>
        <Box marginRight="2" _hover={{ cursor: 'pointer' }}>
          <MdMoreVert size={20} />
        </Box>
      </PopoverTrigger>
      <PopoverContent bg={flexBg[colorMode]} outline="none" _focus={{ boxShadow: 'none' }} w="3xs">
        <PopoverBody p="0">
          <VStack spacing="0" divider={<StackDivider borderColor="gray.800" />}>
            {children}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
