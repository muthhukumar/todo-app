import { gql } from 'graphql-request'

export const FETCH_ALL_PROJECTS = gql`
  query MyQuery {
    projects {
      createdAt
      id
      name
      todos_aggregate(where: { done: { _eq: true } }) {
        aggregate {
          count
        }
      }
      todos(order_by: { createdAt: desc, id: asc }) {
        todo
        id
        createdAt
      }
    }
  }
`

export const FETCH_TODO_OF_PROJECT = gql`
  query MyQuery($projectId: uuid) {
    todo(where: { projectId: { _eq: $projectId } }, order_by: { createdAt: asc }) {
      createdAt
      done
      id
      projectId
      todo
    }
  }
`
