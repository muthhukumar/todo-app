import { useSession } from 'next-auth/client'

export function useUser() {
  const [session] = useSession()

  const token: string = String(session?.token) ?? ''
  const userId: string = String(session?.userId) ?? ''

  return { token, userId }
}
