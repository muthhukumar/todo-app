import { gql } from 'graphql-request'

export const GET_TAGS = gql`
  query MyQuery($_eq: uuid) {
    tags(where: { projectId: { _eq: $_eq } }, order_by: { id: asc }) {
      id
      projectId
      userId
      label
      selected
    }
  }
`
