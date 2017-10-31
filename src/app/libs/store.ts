import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { isEqual } from 'lodash'
import { now, padStart } from './utils'
import { diff } from 'deep-object-diff';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/distinctUntilChanged'

declare type StoreOptions = {[s: string]: any}

export abstract class Store<T extends Object> extends Observable<T> {
  private state$: BehaviorSubject<T>
  private options: StoreOptions

  constructor(initialState: T = null, options: StoreOptions = {}) {
    const state = Object.assign({}, initialState)
    const state$ = new BehaviorSubject<T>(state)
    // any time state$ emit new value (publish will call state$.next), notify observable
    super(observer => {
      state$.subscribe(observer)
    })
    this.state$ = state$
    this.options = Object.assign({}, { debug: true }, options)
  }

  /**
   * Alias for getState()
   */
  get state(): T {
    return this.getState()
  }

  /**
   * Get current state snapshot
   */
  getState(): T {
    return this.state$.getValue()
  }

  /**
   * Set new state
   *
   * @param patch full or partial state snapshot
   */
  setState(patch: Partial<T>) {
    const state = Object.assign({}, this.state, patch)
    if (this.options.debug) {
      const colors = { prevState: '#9E9E9E', nextState: '#4CAF50' }
      const action = this.getCallerFunction()
      const stateDiff = {
        prev: diff(state, this.state),
        next: diff(this.state, state)
      }
      const timestamp = now()
      // tslint:disable-next-line:no-console
      console.group(`${timestamp} [${this.constructor.name}.${action}]`);
      console.log(`%c ${padStart('prev state:', 15, ' ')}`, `color: ${colors.prevState}; font-weight: bold`, stateDiff.prev);
      console.log(`%c ${padStart('next state:', 15, ' ')}`, `color: ${colors.nextState}; font-weight: bold`, stateDiff.next);
      console.log(`%c ${padStart('current state:', 15, ' ')}`, `color: ${colors.nextState}; font-weight: bold`, state);
      console.groupEnd();
    }
    this.state$.next(state)
  }

  /**
   * Custom operator, let you easily work with store member
   *
   * @param selector mapping function
   */
  select<R>(selector: (state: T) => R): Observable<R> {
    return this.map(selector).distinctUntilChanged(isEqual)
  }

  /**
   * Setup options for this store, basically to provide options for middlewares
   * eg. { debug: true }
   *
   * previously declared instance options will be respect and won't be replaced
   * this allow you to declare store level options
   *
   * @param options plain object contains global options for all store
   */
  configure(options: StoreOptions) {
    this.options = Object.assign({}, options, this.options)
  }

  private getCallerFunction() {
    let action = '[unknown]'
    try {
      throw new Error();
    } catch (e) {
      try {
        action = e.stack.split('at ')[3].split(' ')[0].match(/\w+$/)[0]
        // console.log(e.stack);
      } catch (e) { }
    }
    return action
  }
}
