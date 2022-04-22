import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  count: number
  user: {
    token: string
  }
  isLogin:boolean
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state() {
    return {
      count: 0,
      isLogin: false,
      user: {
        token: ''
      }
    }
  },
  mutations: {
    loginChange(state,payload){
      state.isLogin=payload      
    }
  }
})
export function useStore () {
  return baseUseStore(key)
}
