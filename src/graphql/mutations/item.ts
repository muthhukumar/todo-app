import { gql } from 'graphql-request'

export const UPDATE_ITEM = gql`
  mutation MyMutation($_eq: uuid, $todo: String) {
    update_todo(where: { id: { _eq: $_eq } }, _set: { todo: $todo }) {
      returning {
        id
      }
    }
  }
`
