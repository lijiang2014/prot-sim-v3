import axios from 'axios'
// import { ElNotification } from 'element-plus'
// 无法在组件外使用 store
// import {useStore} from '@/store'
import store from '@/store'
import qs from 'qs'
import { ElNotification } from 'element-plus'

export const StarlightURL = `${import.meta.env.VITE_APP_BASE_STARLIGHT}`

export const RedirectLoginURL = (baseURL = StarlightURL, tokenType = 'longTerm', cookieExp = 2, href = '') => {
  if (!href) {
    href = window.location.href
  }
  // const myURL = "http://bio.nscc-gz.cn:3000/login"
  const encodeURL = encodeURIComponent(href)
  return `${baseURL}/#/login?token_type=${tokenType}&cookie_exp=${cookieExp}&redirect_url=${encodeURL}`
}

// create an axios instance
const service = axios.create({
  baseURL: StarlightURL,
  timeout: 15000, // request timeout
  paramsSerializer: function (params) {
    for (var i in params) {
      if (!params[i]) {
        delete params[i]
      }
    }
    return qs.stringify(params, { arrayFormat: 'repeat' })
  }
})

// 拦截请求，为请求附上token
service.interceptors.request.use(
  config => {
    console.log(store)
    config.headers!['Bihu-Token'] = store.state.user.token
    return config
  },
  error => {
    ElNotification.error(error + '，请联系管理员进行处理。')
    return Promise.reject(error)
  }
)

// 拦截响应
service.interceptors.response.use(
  response => {
    // return response
    const res = response
    if (res.status !== 200) {
      return Promise.reject(res)
    }
    if (res.data.code === 200) {
      return res.data
    }
    return Promise.reject(res)
    //     if (res.data.code === 1300) {
    //       if (store.state.user.informed === false) {
    //         store.commit('user/set_informed', true)
    //         MessageBox.confirm('您的登录信息已失效，请点击重新登录离开本页面或者点击取消留在当前页面', '登录提示', {
    //           confirmButtonText: '重新登录',
    //           cancelButtonText: '取消',
    //           type: 'warning'
    //         }).then(() => {
    //           store.dispatch('user/logout')
    //           router.push({ path: '/login' })
    //           this.$nextTick(() => {
    //             location.reload()
    //           })
    //         }).catch(() => {
    //           store.dispatch('user/logout')
    //         })
    //       }
    //     } else {
    //       Notification.error('请求出错：' + res.data.info + '，错误编号：' + res.data.uuid)
    //       return Promise.reject()
    //     }
    //   }
    // },
    // error => {
    //   Notification.error(error + '，请联系管理员进行处理。')
    //   return Promise.reject()
  }
)

export default service