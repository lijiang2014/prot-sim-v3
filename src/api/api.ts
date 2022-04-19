import http from '@/api/http'
// import { AxiosPromise } from 'axios'
import { structurePredictRequest } from '@/utils/structure'

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

// Orginal API
export const checkPredictStructureProjectName = (projName: string): Promise<any> => {
  return http.get('/predict/structure/check/', {params: {proj_name: projName}})
}

export const submitPredictStruct = (r: structurePredictRequest): Promise<any> => {
  return http.post('/predict/structure_submit/', r)
}
