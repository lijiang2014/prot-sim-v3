import axios from 'axios'
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
// 添加响应拦截器
http.interceptors.response.use(
  response => {
    return Promise.resolve((response.data || {}) as any)
  },
  error => {
    return Promise.reject(error)
  }
)
http.interceptors.request.use(config=>{
  (config.headers as any).Authorization  = window.sessionStorage.getItem('token')
  return config
})
export default http