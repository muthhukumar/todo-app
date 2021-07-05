import React from 'react'
import { Td, Tr, Button } from '@chakra-ui/react'
import { mutate } from 'swr'
import _ from 'lodash'

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
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const spanRef = React.useRef<HTMLSpanElement>(null)
  const [, setUpdating] = React.useState<boolean>(false)
  const { token } = useUser()

  React.useEffect(() => {
    setHeight()
  }, [])

  const {
    // createdAt = Date.now(),
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
    <Tr>
      <Td maxW={'70%'}>
        <Editable mx="4" fontSize="md" defaultValue={todo} py="3" maxW="100%">
          {/* <Tooltip label={todo} aria-label="A tooltip" rounded="md" p="4" fontSize="lg" size="lg"> */}
          <EditablePreview ref={spanRef} isTruncated maxW="450px" />
          {/* </Tooltip> */}
          <EditableTextarea
            p="1"
            rounded="sm"
            ref={textareaRef}
            type="textarea"
            onChange={handleValueChange}
            onFocus={setHeight}
            onBlur={resetHeight}
            h={getScrollHeight()}
            overflow="hidden"
          />
        </Editable>
      </Td>
      <Td color={done ? '#50e3c1f5' : '#ff0102d4'} w="10%">
        {done ? 'Done' : 'Pending'}
      </Td>
      <Td w="10%">
        <Button
          aria-label={done ? 'Mark as pending' : 'Mark as complete'}
          onClick={onToggleDone}
          w="100%"
          size="sm"
        >
          {done ? 'Pending' : 'Done'}
        </Button>
      </Td>
      <Td w="10%">
        <Button aria-label="Delete item" onClick={handleDelete} w="100%" size="sm">
          Delete
        </Button>
      </Td>
    </Tr>
  )
}
