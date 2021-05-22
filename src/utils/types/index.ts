import { MomentInput } from 'moment'

export type TodoType = {
  id: string
  todo: string
  projectId: string
  userId: string
  done: boolean
  createdAt: number | MomentInput
}

export type ProjectType = {
  name: string
  id: string
  userId: string
  createdAt: number | MomentInput
}
