import * as React from 'react'
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite'

import { useUser } from '.'
import { getQuery, getOffset, PAGE_SIZE, getStatus } from '../main'
import { queryFetcher } from '../request'

type options = {
  query: string
  pageSize?: number
  calculateOffset?: (value: string) => number
  useSWRInfiniteOptions?: SWRInfiniteConfiguration
  field: string
}

export const useInfiniteScrolling = ({
  query,
  pageSize = PAGE_SIZE,
  calculateOffset = getOffset,
  useSWRInfiniteOptions,
  field,
}: options) => {
  const { token } = useUser()

  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite(
    (index: number) => getQuery({ token, query, index }),
    (value: string) => {
      const offset = calculateOffset(value)
      return queryFetcher(query, { limit: pageSize, offset }, token)
    },
    { initialSize: 1, ...useSWRInfiniteOptions },
  )

  const { isLoadingMore, isLoadingInitialData, isReachingEnd, result } = React.useMemo(
    () =>
      getStatus({
        data,
        error,
        size,
        isValidating,
        field,
      }),
    [data, error, size, isValidating, field],
  )

  return {
    isLoadingMore,
    isLoadingInitialData,
    isReachingEnd,
    result,
    data,
    error,
    size,
    setSize,
    isValidating,
    mutate,
  }
}
