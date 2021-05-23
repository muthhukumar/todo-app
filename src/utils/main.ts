import jwt from 'jsonwebtoken'
import _ from 'lodash'
import { JWT } from 'next-auth/jwt'

/**
 * @function
 * @exports generateToken
 * @param {object} payload
 * @param {(Buffer | string)} secret
 * @returns {string} token
 */
export function generateToken(payload: object = {}, secret: string | Buffer) {
  let jwtSecret = secret
  if (!secret) {
    jwtSecret = process.env.JWT_SECRET as string
  }
  return jwt.sign(payload, jwtSecret, { algorithm: 'HS256' })
}

/**
 * @function
 * @exports decodeToken
 * @param {string} token
 * @param {Buffer | string} secret
 * @returns {object} payload
 */
export function decodeToken(token: string, secret: string | Buffer): JWT {
  let jwtSecret = secret
  if (!secret) {
    jwtSecret = process.env.JWT_SECRET as string
  }
  return jwt.verify(token, jwtSecret, { algorithms: ['HS256'] }) as JWT
}

export const wait: (fn: Function) => number = (fn) => setTimeout(fn, 500)

export const PAGE_SIZE = 8

export const getStatus = ({
  data,
  error,
  size,
  isValidating,
  field,
}: {
  isValidating: boolean
  size: number
  error: string
  data: Array<any> | undefined
  field: string
}) => {
  const result = data ? [].concat(...data) : []
  const isLoadingInitialData = !data && !error
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0

  const isReachingEnd = isEmpty || (data && data[data?.length - 1]?.[field]?.length < PAGE_SIZE)

  const isRefreshing = isValidating && data && data.length === size
  return {
    result,
    isLoadingMore,
    isLoadingInitialData,
    isReachingEnd,
    isRefreshing,
  }
}

export const getQuery = ({
  token,
  query,
  index,
}: {
  token: string
  query: string
  index: number
}): null | string => {
  if (!token) return null
  return `${query}?[${index}]`
}

export const getOffset = (query: string): number => {
  const [index] = JSON.parse(query.split('?')[1]) as [number]
  return index ? index * PAGE_SIZE : index
}

export function getFlattenData<T>(data: Array<{ [key: string]: T }>, field: string) {
  return _.flatten(data?.map((entry) => entry?.[field]))
}
