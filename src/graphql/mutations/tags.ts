import { gql } from 'graphql-request'

export const ADD_TAG = gql`
  mutation MyMutation($userId: String, $projectId: uuid, $label: String) {
    insert_tags(objects: { userId: $userId, projectId: $projectId, label: $label }) {
      returning {
        id
        projectId
        userId
        label
      }
    }
  }
`

export const DELETE_TAG = gql`
  mutation MyMutation($_eq: uuid) {
    delete_tags(where: { id: { _eq: $_eq } }) {
      returning {
        id
      }
    }
  }
`

export const UPDATE_TAG = gql`
  mutation MyMutation($_eq: uuid, $selected: Boolean = false) {
    update_tags(
      where: { id: { _eq: $_eq }, selected: {}, projectId: {} }
      _set: { selected: $selected }
    ) {
      returning {
        id
      }
    }
  }
`
