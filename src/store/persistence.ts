import { Store } from "vuex"
// 持久化 store ; refs: https://www.jianshu.com/p/b931aa34121e
export default <T>(store: Store<T>): void => {
  // data session lifecircle
  if (sessionStorage.getItem('store')) {
    // store.replaceState(
    //   Object.assign(
    //     {},
    //     store.state,
    //     JSON.parse(sessionStorage.getItem('store') as string)
    //   )
    // )
    // sessionStorage.removeItem("store")
  }
  // store data before page flash
  // window.addEventListener('beforeunload', () => {
  //   sessionStorage.setItem('store', JSON.stringify(store.state))
  // })
}