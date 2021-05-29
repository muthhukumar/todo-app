import useSWR from 'swr'

import { useUser } from '.'
import { GET_PROJECT_NAME } from '../../graphql/queries'
import { queryFetcher } from '../request'

export function useProjectName(slug: Array<string> | undefined | string) {
  const { token } = useUser()

  const { data, ...rest } = useSWR(slug && token ? GET_PROJECT_NAME : null, (query) =>
    queryFetcher(query, { '_eq': slug }, token),
  )

  return { projectName: data?.projects?.[0]?.name ?? '', data, ...rest }
}
