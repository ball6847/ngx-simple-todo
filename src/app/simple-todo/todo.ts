export const FILTER = {
  ALL: 1,
  COMPLETED: 2,
  UNCOMPLETED: 3,
}

export class Todo {
  id: number
  title: string
  completed = false
  constructor(id: number, title: string) {
    this.id = id
    this.title = title
  }
}

export class TodoState {
  todos: Todo[] = []
  showCompleted = true
  filter = FILTER.ALL
  search = ''
}

export class TodoCounter {
  all = 0
  completed = 0
  uncompleted = 0
}