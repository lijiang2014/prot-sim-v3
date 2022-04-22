import http from '@/api/http'
// import { AxiosPromise } from 'axios'
import { structurePredictRequest } from '@/app-model/structure'
import axios, { AxiosRequestConfig } from 'axios'
import $request from '@/utils/starlightRequest'
// Mock apis

export interface LoginRequest {
  username: string
  password: string
}

export const sendEmailCode = (email: string): Promise<any> => {
  if (email == '123@45.cn'){
    return new Promise((resolve, reject) => {
      resolve("ok")    
    })  
  } else {
    return http.post('sendCode', email)
  }
}

export const login = (r: LoginRequest): Promise<any> => {
  if (r.password == "123456") {
    const rmock = { username: 'teamwork', password: 'weareteam!'}
    return http.post('login', rmock)
  }
  return new Promise((resolve, reject) => {
    if (r.password == "123456") {
      resolve("ok")    
    } else {
      reject("false")
    }
  })
}

export const uploadFile = (spath: string,file: File, settings?: AxiosRequestConfig): Promise<any>  => {
  // 原 bioSim API 启用
  if (spath.startsWith('platform://')){
    const data = new FormData()
    data.append('file', file)
    // Not A real file upload API.
    return http.post('api/similarity/upload_pdb/', data)
  }
  // 原 starlight API TODO
  if (spath.startsWith('file://')){
    let settings = {} as AxiosRequestConfig
    settings
    return $request(settings)
  }
  return new Promise((resolve, reject) => {
    if (spath == "ok") {
      resolve("ok")    
    } else {
      reject("false")
    }
  })
}


export const submitAppTask = (app: string, params: any, runtime_params: any): Promise<any>  => {
  return $request({
    url: '/api/job/submit/',
    method: 'post',
    data: {
      app,
      params,
      runtime_params
    }
  })
}

/*  
  region: 选择的领域
  params: 其他扩展参数，如分页控制等
  结果：
  spec: App 列表
    name: 索引名称， title: 显示给用户的名称,
    icon: 图片，如地址为 https://starlight.nscc-gz.cn/api/mei/acorn/2e2f701b-1ee2-4d7e-988e-3d36c8343b80
    type: 类型区分，暂时不用
 */
export const getApps = (region?:string, params?: any,):Promise<any>  => {
  const mockApps = {spec: [
    {name: 'structure-prediction',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'base'},
    {name: 'structure-prediction',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'base'},
    {name: 'structure-prediction',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'base'},
    {name: 'structure-similarity',title: '相似性比对',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'base'},
    {name: 'graphppis',title: '位点预测',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'base'},
    {name: 'structure-prediction',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'base'},
    {name: 'structure-similarity',title: '相似性比对',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'base'},
    {name: 'graph-ppis',title: '位点预测',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'base'},
    {name: 'structure-prediction',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'base'},
    {name: 'structure-similarity',title: '相似性比对',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'base'},
    {name: 'graph-ppis',title: '位点预测',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'base'},
    {name: 'structure-prediction',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'base'},
    {name: 'structure-similarity',title: '相似性比对',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'base'},
    {name: 'graph-ppis',title: '位点预测',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'base'},
  ], total: 100}
  params = Object.assign({region}, params)
  if (params.mock){
    return new Promise((resolve, reject) => {
      if (region == "false") {
        reject("false")
      } else {
        resolve(mockApps)
      }
    })
  }
  return http.request({
    url: '/api/job/submit/',
    method: 'get',
    data: {
      params,
    }
  })
}

// Orginal API
export const checkPredictStructureProjectName = (projName: string): Promise<any> => {
  return http.get('/predict/structure/check/', {params: {proj_name: projName}})
}

export const submitPredictStruct = (r: structurePredictRequest): Promise<any> => {
  return http.post('/predict/structure_submit/', r)
}
