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

// Orginal API
export const checkPredictStructureProjectName = (projName: string): Promise<any> => {
  return http.get('/predict/structure/check/', {params: {proj_name: projName}})
}

export const submitPredictStruct = (r: structurePredictRequest): Promise<any> => {
  return http.post('/predict/structure_submit/', r)
}
