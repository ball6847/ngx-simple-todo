import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SimpleTodoModule } from './simple-todo/simple-todo.module'

import { AppComponent } from './app.component';


@NgModule({
  imports:      [ BrowserModule, FormsModule, SimpleTodoModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
