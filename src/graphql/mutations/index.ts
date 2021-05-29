import { gql } from 'graphql-request'

export const ADD_TODO_TO_PROJECT = gql`
  mutation MyMutation($projectId: uuid, $todo: String, $userId: String, $createdAt: bigint) {
    insert_todo(
      objects: { projectId: $projectId, todo: $todo, userId: $userId, createdAt: $createdAt }
    ) {
      returning {
        createdAt
        done
        id
        projectId
        todo
      }
    }
  }
`

export const removeTodoMutation = (id: string) => gql`
  mutation MyMutation($_eq: uuid = "${id}") {
    delete_todo(where: { id: { _eq: $_eq } }) {
      returning {
        id
      }
    }
  }
`

export const toggleComplete = (id: string) => gql`
  mutation MyMutation($_eq: uuid = "${id}", $done: Boolean) {
    update_todo(where: { id: { _eq: $_eq } }, _set: { done: $done }) {
      returning {
        id
        done
      }
    }
  }
`

export const ADD_NEW_PROJECT = gql`
  mutation MyMutation($createdAt: bigint, $name: String, $userId: String) {
    insert_projects(objects: { createdAt: $createdAt, name: $name, userId: $userId }) {
      returning {
        id
        name
        createdAt
        userId
      }
    }
  }
`

export const removeProject = (projectId: string) => gql`
  mutation MyMutation($_eq: uuid = "${projectId}") {
    delete_projects(where: { id: { _eq: $_eq } }) {
       returning {
         id
       }
     }
   delete_todo(where: {projectId: {_eq: $_eq}}) {
     returning {
       id
     }
   }
 }
`

export const UPDATE_PROJECT_NAME = gql`
  mutation MyMutation($_eq: uuid, $name: String) {
    update_projects(where: { id: { _eq: $_eq } }, _set: { name: $name }) {
      returning {
        id
      }
    }
  }
`
