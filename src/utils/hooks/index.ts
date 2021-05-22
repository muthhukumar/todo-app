import { useSession } from 'next-auth/client'

export function useUser() {
  const [session] = useSession()

  let token: string = ''
  let userId: string = ''

  if (typeof session?.token === 'string') {
    token = session?.token
  }

  if (typeof session?.userId === 'string') {
    userId = session?.userId
  }

  return { token, userId, user: session?.user }
}
