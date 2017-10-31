import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MobxAngularModule } from 'mobx-angular'
import { SimpleTodoComponent } from './simple-todo/simple-todo.component';
import { TodoService } from './todo.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MobxAngularModule
  ],
  declarations: [SimpleTodoComponent],
  providers: [TodoService],
  exports: [SimpleTodoComponent]
})
export class SimpleTodoModule { }
