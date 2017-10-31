import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Store } from '../libs/store'
import { TodoState, Todo, FILTER } from './todo'
import { tassign } from 'tassign'
import { observable, action, computed } from 'mobx'


@Injectable()
export class TodoService {
  @observable todos: Todo[] = []
  @observable showCompleted = true
  @observable filter = FILTER.ALL
  @observable search = ''

  /**
   * keep track of todo id
   */
  increment = 0

  @computed get filteredTodos() {
    const filterFn = (todo: Todo) => {
      let passed: boolean = null;
      switch (this.filter) {
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
      return passed && todo.title.indexOf(this.search) !== -1
    }

    return this.todos.filter(filterFn)
  }

  @computed get count() {
    return {
      all: this.todos.length,
      completed: this.todos.filter(todo => todo.completed).length,
      uncompleted: this.todos.filter(todo => !todo.completed).length,
    }
  }

  @action addTodo(title: string) {
    this.todos.push(new Todo(this.increment++, title))
  }

  @action toggleTodo(todo: Todo) {
    this.todos = this.todos.map((item) => (
      item.id == todo.id
        ? tassign(item, { completed: !todo.completed })
        : item
    ))
  }

  @action removeTodo(todo: Todo) {
    this.todos = this.todos.filter(item => item.id != todo.id)
  }

  @action clearAllTodo() {
    this.todos = []
  }

  @action setFilter(filter: number) {
    if ((<any>Object).values(FILTER).indexOf(filter) !== -1) {
      this.filter = filter
    }
  }

  @action setSearch(search: string) {
    this.search = search
  }
}
