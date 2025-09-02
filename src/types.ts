export interface TaskItem {
  id: number
  task: string
  isCompleted: boolean
  date: string
}

export interface TaskObject {
  tasks: TaskItem[]
}
