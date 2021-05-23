import { gql } from 'graphql-request'

export const FETCH_PROJECT_BY_LIMIT = gql`
  query MyQuery($limit: Int, $offset: Int) {
    projects(order_by: { createdAt: desc }, limit: $limit, offset: $offset) {
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

export const FETCH_TOP_PROJECTS = gql`
  query MyQuery {
    projects(limit: 8, order_by: { createdAt: desc }) {
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
