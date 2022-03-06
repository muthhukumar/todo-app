import { useSession } from 'next-auth/react'

export function useUser() {
  const {data} = useSession()

  let token: string = ''
  let userId: string = ''

  if (typeof data?.token === 'string') {
    token = data?.token
  }

  if (typeof data?.userId === 'string') {
    userId = data?.userId
  }

  return { token, userId, user: data?.user }
}
