import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { isEqual } from 'lodash'
import { now, padStart } from './utils'
import { diff } from 'deep-object-diff';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/distinctUntilChanged'

declare type StoreOptions = {
  debug?: boolean
  collapsed?: boolean
  prev?: boolean
  next?: boolean
  current?: boolean
  colors?: { [s: string]: string }
} & { [s: string]: any }

export abstract class Store<T extends Object> extends Observable<T> {
  private state$: BehaviorSubject<T>
  private options: StoreOptions

  constructor(initialState: T = null, options: StoreOptions = {}) {
    const state = Object.assign({}, initialState)
    const state$ = new BehaviorSubject<T>(state)
    super(observer => {
      state$.subscribe(observer)
    })
    this.state$ = state$
    this.options = Object.assign({}, Store.defaultOptions, options)
  }

  static defaultOptions: StoreOptions = {
    debug: true,
    collapsed: true,
    prev: true,
    next: true,
    current: true,
    colors: {
      prev: '#9E9E9E',
      next: '#4CAF50',
      current: '#FF0000',
    },
    stackTraceOffset: 4
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
    this.debug(state)
    this.state$.next(state)
  }

  debug(state: T) {
    if (!this.options.debug) return
    const colors = this.options.colors
    const action = this.getCallerFunction()
    const timestamp = now()
    const changed = !isEqual(state, this.state)
    const notice = "STATES ARE EQUAL"
    const stateDiff = {
      prev: changed ? diff(state, this.state) : '-',
      next: changed ? diff(this.state, state) : '-',
    }

    // depends on options, sometimes we only want to see actions flow
    const group = this.options.collapsed ? console.groupCollapsed : console.group
    // tslint:disable-next-line:no-console
    group.call(console, `${timestamp} [${this.constructor.name}.${action}] ${changed ? '' : notice}`)
    if (this.options.prev)
      console.log(`%c ${padStart('prev state:', 15, ' ')}`, `color: ${colors.prev}; font-weight: bold`, stateDiff.prev);
    if (this.options.next)
      console.log(`%c ${padStart('next state:', 15, ' ')}`, `color: ${colors.next}; font-weight: bold`, stateDiff.next);
    if (this.options.current)
      console.log(`%c ${padStart('current state:', 15, ' ')}`, `color: ${colors.current}; font-weight: bold`, state);
    console.groupEnd();
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
    const offset = Store.defaultOptions.stackTraceOffset
    let action = '[unknown]'
    try {
      throw new Error();
    } catch (e) {
      try {
        action = e.stack.split('at ')[offset].split(' ')[0].match(/\w+$/)[0]
        // console.log(e.stack);
      } catch (e) { }
    }
    return action
  }
}
