import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { TodoService } from '../todo.service'
import { TodoCounter, Todo, FILTER } from '../todo'
import 'rxjs/add/observable/fromEvent'

@Component({
  selector: 'app-simple-todo',
  templateUrl: './simple-todo.component.html',
  styleUrls: ['./simple-todo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleTodoComponent implements OnInit {
  FILTER = FILTER

  @ViewChild('searchInput')
  searchInput: ElementRef

  constructor(public todoService: TodoService) { }

  ngOnInit() {
    // angular not support oninput, so we need to bind it from scratch
    Observable.fromEvent(this.searchInput.nativeElement, 'input')
      .subscribe((event: Event) => {
        const search = (<HTMLInputElement>event.target).value
        this.todoService.setSearch(search)
      })
  }

  add(todo: HTMLInputElement) {
    if (todo.value)
      this.todoService.addTodo(todo.value)
    todo.value = ""
  }

  toggle(todo: Todo) {
    this.todoService.toggleTodo(todo)
  }

  remove(todo: Todo) {
    this.todoService.removeTodo(todo)
  }

  clear() {
    this.todoService.clearAllTodo()
  }

  filterAll() {
    this.todoService.setFilter(FILTER.ALL)
  }

  filterCompleted() {
    this.todoService.setFilter(FILTER.COMPLETED)
  }

  filterUncompleted() {
    this.todoService.setFilter(FILTER.UNCOMPLETED)
  }
}
