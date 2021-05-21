import { GraphQLClient } from 'graphql-request'

export const queryFetcher = (query, variables, token) => {
  return new GraphQLClient(process.env.NEXT_PUBLIC_GRAPHQL_URL, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  }).request(query, variables)
}
