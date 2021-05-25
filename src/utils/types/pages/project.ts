import { ProjectType, TodoType } from '..'

export interface ProjectPropsType extends ProjectType {
  todos?: Array<TodoType>
  todos_aggregate?: {
    aggregate: {
      count: number
    }
  }
  onDelete?: (projectId: string) => void
  showOption?: boolean
  maxW?: string | number | Array<string | number>
}
