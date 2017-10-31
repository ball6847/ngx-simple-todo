import { EventEmitter } from "@angular/core";

export interface EventEmitterMap {
  [s: string]: EventEmitter<any>
}
