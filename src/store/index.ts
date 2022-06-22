import { UserInfo } from '@/app-model'
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'

export enum UserType {
  AnonymousUser,
  EmailFreeUser,
  StarlightUser,
}
export interface State {
  count: number
  user: {
    token: string
    type: UserType
    defaultFS: string
    name: string
    home: string
    isAdmin: boolean | undefined
  }
  // isLogin: boolean
}


export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state() {
    return {
      count: 100,
      // isLogin: false,
      user: {
        token: '',
        type: UserType.AnonymousUser,
        defaultFS: 'GPUFS',
        home: '/GPUFS/default',
        name: 'default',
        isAdmin: undefined,
      }
    }
  },
  mutations: {
    // loginChange(state, payload) {
    //   state.isLogin = payload
    // },

    setToken(state, params) {
      let { token, username } = params
      // console.log("token, username", token, params, username)
      if (token === "") {
        // logout clear
        window.localStorage.clear()
        window.sessionStorage.clear()
        state.user.token = token
        state.user.name = ""
        return
      }
      if (!username) {
        username = window.localStorage.getItem("username")
        username = username || "unknown"
      }
      window.localStorage.setItem("token", token)
      window.localStorage.setItem("username", username);
      let parts = token.split(".")
      if (parts.length == 3) {
        state.user.type = UserType.StarlightUser
        let claims = JSON.parse(atob(parts[1]))
        if (claims && typeof (claims.user_name) === "string") {
          username = claims.user_name as string
        }
      } else {
        const coded = btoa(username).split("=")[0]
        token = "Bearer " + coded + "." + token
        state.user.type = UserType.EmailFreeUser
      }
      state.user.token = token
      state.user.name = username
      state.user.home = "/" + state.user.defaultFS + "/" + state.user.name
      // console.log("username", username)
    },
    setUserInfo(state, userInfo: UserInfo) {
      state.user.isAdmin = userInfo.isAdmin || false
    },
    increment(state) {
      state.count++
    }
  }
})
export function useStore() {
  return baseUseStore(key)
}

export default store
