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

export const ADD_TODO_WITH_TAG = gql`
  mutation MyMutation(
    $projectId: uuid
    $todo: String
    $userId: String
    $createdAt: bigint
    $objects: [todoTags_insert_input!] = [{ userId: "", todoId: "", tagId: "" }]
    $id: uuid
  ) {
    insert_todo(
      objects: {
        projectId: $projectId
        todo: $todo
        userId: $userId
        createdAt: $createdAt
        id: $id
      }
    ) {
      returning {
        createdAt
        done
        id
        projectId
        todo
      }
    }
    insert_todoTags(objects: $objects) {
      returning {
        id
        tagId
        todoId
        userId
      }
    }
  }
`

export const REMOVE_TODO = gql`
  mutation MyMutation($_eq: uuid) {
    delete_todo(where: { id: { _eq: $_eq } }) {
      returning {
        id
      }
    }
    delete_todoTags(where: { todoId: { _eq: $_eq } }) {
      affected_rows
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

export const REMOVE_PROJECT = gql`
  mutation MyMutation($_eq: uuid) {
    delete_projects(where: { id: { _eq: $_eq } }) {
      returning {
        id
      }
    }
    delete_todo(where: { projectId: { _eq: $_eq } }) {
      returning {
        id
      }
    }
    delete_tags(where: { projectId: { _eq: $_eq } }) {
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
