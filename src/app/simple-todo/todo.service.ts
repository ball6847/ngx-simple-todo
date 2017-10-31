import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Store } from '../libs/store'
import { TodoState, Todo, FILTER } from './todo'
import 'rxjs/add/operator/share'

@Injectable()
export class TodoService extends Store<TodoState> {
  increment: number

  constructor() {
    super(new TodoState);
    this.increment = 0
  }

  /**
   * Observable of list of todo displaying to the user
   * filtering will be applied before emitting
   *
   * this filter depends on state.todos and state.showCompleted
   * so, we need to watch for these values changes before applying the filter
   */
  readonly todos$ = this.select(state => ({
      todos: state.todos,
      filter: state.filter,
      search: state.search
    }))
    .map(this.applyFilter)
    // .share()

  /**
   * Observable of TodoCounter
   */
  readonly count$ = this.map(state => ({
      all: state.todos.length,
      completed: state.todos.filter(todo => todo.completed).length,
      uncompleted: state.todos.filter(todo => !todo.completed).length,
    }))
    // .share()

  readonly filter$ = this.select(state => state.filter)
    // .share()

  addTodo(title: string) {
    const todos = [...this.state.todos, new Todo(this.increment++, title)]
    this.setState({ todos })
  }

  toggleTodo(todo: Todo) {
    const mapper = (item) => (
      item.id == todo.id
        ? Object.assign({}, item, { completed: !todo.completed })
        : item
    )
    this.setState({ todos: this.state.todos.map(mapper) })
  }

  removeTodo(todo: Todo) {
    const todos = this.state.todos.filter(item => item.id != todo.id)
    this.setState({ todos })
  }

  clearAllTodo() {
    this.setState({ todos: [] })
  }

  setFilter(filter: number) {
    if ((<any>Object).values(FILTER).indexOf(filter) !== -1) {
      this.setState({ filter })
    }
  }

  setSearch(search: string) {
    this.setState({ search })
  }

  protected applyFilter(state: TodoState) {
    return state.todos.filter(todo => {
      let passed: boolean = null;
      switch (state.filter) {
        case FILTER.ALL:
          passed = true
          break;
        case FILTER.COMPLETED:
          passed = todo.completed == true
          break;
        case FILTER.UNCOMPLETED:
          passed = todo.completed == false
          break;
      }
      return passed && todo.title.indexOf(state.search) !== -1
    })
  }
}
