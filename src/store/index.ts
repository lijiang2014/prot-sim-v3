import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export interface State {
  isLogin:boolean
}

export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state:{
    isLogin:false,
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
