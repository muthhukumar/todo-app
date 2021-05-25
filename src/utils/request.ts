import { GraphQLClient } from 'graphql-request'

export function queryFetcher(
  query: string,
  variables: Object,
  token: string,
  headers?: { [key: string]: string },
) {
  return new GraphQLClient(String(process.env.NEXT_PUBLIC_GRAPHQL_URL), {
    headers: headers
      ? headers
      : {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
  }).request(query, variables)
}
