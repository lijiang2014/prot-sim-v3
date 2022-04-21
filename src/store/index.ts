import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

export interface State {
  count: number
  user: {
    token: string
  }
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state() {
    return {
      count: 0,
      user: {
        token: ''
      }
    }
  },
  mutations: {
    increment(state) {
      state.count++
    }
  }
})
