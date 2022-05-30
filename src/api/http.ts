import store from '@/store'
import axios from 'axios'
import { ElNotification } from 'element-plus'
export const commonHeaders = {
  'Content-Type': 'application/json;charset=UTF-8'
}
export const fileHeaders = {
  'Content-Type': 'multipart/form-data'
}
// 创建一个新的axios实例
const http = axios.create({
  // baseURL: 'http://222.200.186.124:3389/protein',
  baseURL: `${import.meta.env.VITE_APP_BASE_API}`,
  timeout: 30000,
  headers: commonHeaders
})

// 拦截请求，为请求附上token
http.interceptors.request.use(
  config => {
    console.log(store)
    let usernameBase64 = btoa(store.state.user.name)
    let parts = store.state.user.token.split(".")
    if (parts.length == 3) {
      config.headers!['Bihu-Token'] = store.state.user.token
    } else {
      config.headers!['Authorization'] = "Bearer " + usernameBase64 + "." + store.state.user.token
    }
    return config
  },
  error => {
    ElNotification.error(error + '，请联系管理员进行处理。')
    return Promise.reject(error)
  }
)

// 添加响应拦截器
http.interceptors.response.use(
  response => {
    return Promise.resolve((response.data || {}) as any)
  },
  error => {
    return Promise.reject(error)
  }
)
http.interceptors.request.use(config => {
  (config.headers as any).Authorization = window.sessionStorage.getItem('token')
  return config
})
export default http