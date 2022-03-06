import React from 'react'
import { Text, Flex, IconButton, useColorModeValue, ButtonGroup, Spinner } from '@chakra-ui/react'
import { FaCheck } from 'react-icons/fa'
import { ImRadioUnchecked } from 'react-icons/im'
import { GoX } from 'react-icons/go'
import { mutate } from 'swr'
import _ from 'lodash'
import moment from 'moment'

import { UPDATE_ITEM } from '../graphql/mutations/item'
import { queryFetcher } from '../utils/request'
import { useUser } from '../utils/hooks'
import { Editable, EditablePreview, EditableTextarea } from './Editable'

import type { TodoType } from '../utils/types'
import type { FC } from 'react'

interface PropsType extends TodoType {
  onDelete: (todoId: string) => void
  onToggle: (todoId: string, done: boolean) => void
  query: string
}

export const Todo: FC<PropsType> = (props) => {
  const bg = useColorModeValue('white', 'black')
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const spanRef = React.useRef<HTMLSpanElement>(null)
  const [updating, setUpdating] = React.useState<boolean>(false)
  const { token } = useUser()

  React.useEffect(() => {
    setHeight()
  }, [])

  const {
    createdAt = Date.now(),
    done = false,
    id = '',
    todo = '',
    onToggle = () => {},
    onDelete = () => {},
    query = '',
  } = props

  const onToggleDone = () => {
    onToggle(id, done)
  }

  const handleDelete = () => {
    onDelete(id)
  }

  const handleValueChange = () => {
    setHeight()
    if (textareaRef.current) {
      const currentTodoValue = textareaRef.current.value
      handleItemValueChange(currentTodoValue)
    }
  }

  const handleItemValueChange = _.debounce(async (value: string) => {
    if (!value) {
      return
    }

    setUpdating(true)

    try {
      await queryFetcher(
        UPDATE_ITEM,
        {
          '_eq': id,
          todo: value,
        },
        token,
      )
      mutate(query)
    } catch (error) {
    } finally {
      setUpdating(false)
    }
  }, 1000)

  function setHeight() {
    if (textareaRef.current) {
      const scrollHeight = getScrollHeight()
      textareaRef.current.style.height = `${scrollHeight}px`
      textareaRef.current.style.overflow = 'hidden'
    }
  }

  function getScrollHeight(): number {
    const textarea = textareaRef.current
    if (textarea) {
      const spanHeight = spanRef.current?.scrollHeight ?? 0
      return spanHeight > textarea.scrollHeight ? spanHeight : textarea.scrollHeight
    }
    return 0
  }

  function resetHeight() {
    if (textareaRef.current) {
      textareaRef.current.style.height = `${getScrollHeight()}px`
    }
  }

  return (
    <Flex
      minW="100%"
      flexDir="column"
      bg={bg}
      rounded="md"
      shadow="md"
      borderColor="whiteAlpha"
      borderWidth="0.5px"
      overflow="hidden"
    >
      <Flex
        alignItems="center"
        w="100%"
        justifyContent="space-between"
        p="1"
        borderBottomWidth="1px"
      >
        <Flex alignItems="center">
          <Text fontSize="sm" ml="3">
            {moment(createdAt).format('ll')}
          </Text>
        </Flex>
        <Flex alignItems="center">
          {updating && <Spinner size="xs" mr="2" color={done ? '#50e3c1f5' : '#ff0102d4'} />}
          <Flex
            alignItems="center"
            p="1px"
            borderWidth="1px"
            borderBottomLeftRadius="5px"
            borderTopRightRadius="5px"
          >
            <ButtonGroup isAttached>
              <IconButton
                aria-label={done ? 'Mark as pending' : 'Mark as complete'}
                icon={done ? <ImRadioUnchecked /> : <FaCheck />}
                onClick={onToggleDone}
                color={done ? '#50e3c1f5' : '#ff0102d4'}
                rounded="none"
                size="xs"
                bg={bg}
              />
              <IconButton
                rounded="none"
                color={done ? '#50e3c1f5' : '#ff0102d4'}
                aria-label="Delete item"
                icon={<GoX />}
                fontSize="md"
                onClick={handleDelete}
                size="xs"
                bg={bg}
              />
            </ButtonGroup>
          </Flex>
        </Flex>
      </Flex>
      <Editable mx="4" fontSize="md" defaultValue={todo} py="3">
        <EditablePreview w="100%" ref={spanRef} />
        <EditableTextarea
          w="100%"
          p="1"
          rounded="sm"
          ref={textareaRef}
          onChange={handleValueChange}
          onFocus={setHeight}
          onBlur={resetHeight}
          h={getScrollHeight()}
          overflow="hidden"
        />
      </Editable>
    </Flex>
  )
}
