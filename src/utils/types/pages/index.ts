import { ProjectType, TodoType } from '..'

export interface FetchProjectResponse extends ProjectType {
  todos_aggregate: {
    aggregate: {
      count: number
    }
  }
  todos: Array<TodoType>
}
