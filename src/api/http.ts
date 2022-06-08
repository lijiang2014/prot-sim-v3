import store, { UserType } from '@/store'
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
    if (store.state.user.type === UserType.StarlightUser) {
      config.headers!['Bihu-Token'] = store.state.user.token
    } else if (store.state.user.type === UserType.EmailFreeUser) {
      config.headers!['Authorization'] = store.state.user.token
    }
    if (config.params) {
      Object.keys(config.params).forEach(item => {
        if (config.params[item] === 0 || config.params[item] === '' || config.params[item] === undefined || config.params[item] === null || config.params[item] == []) {
          delete config.params[item]
        }
      })
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
    if (response.status !== 200) {
      return Promise.reject(response)
    }
    if (response.headers['content-type'] === "application/json") {
      if (response.data.code === 200) {
        return response.data
      }
      return Promise.reject(response)
    }
    return Promise.resolve((response.data || {}) as any)
  },
  error => {
    return Promise.reject(error)
  }
)
// http.interceptors.request.use(config => {
//   (config.headers as any).Authorization = window.sessionStorage.getItem('token')
//   return config
// })
export default http