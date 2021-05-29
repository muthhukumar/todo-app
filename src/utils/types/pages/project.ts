import type { ProjectType, TodoType } from '..'

export interface ProjectPropsType extends ProjectType {
  todos?: Array<TodoType>
  todos_aggregate?: {
    aggregate: {
      count: number
    }
  }
  maxW?: string | number | Array<string | number>
}
