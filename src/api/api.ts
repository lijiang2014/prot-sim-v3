import http from '@/api/http'
// import { AxiosPromise } from 'axios'
import { structurePredictRequest } from '@/app-model/structure'
import type { ApiResponseItems, AppMeta, AppSpec, jobMeta, OutputMap, result as JobResult, } from '@/app-model'
import  { jobMetaExample } from '@/app-model'
import axios, { AxiosRequestConfig } from 'axios'
import $request from '@/utils/starlightRequest'
import { stringFile } from '@/app-model/graph-ppis'
// Mock apis
const mockQueryTime = 1000 * 3
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
  if (app === 'graph-ppis') {
    app = 'graphppis'
    runtime_params = Object.assign(runtime_params, {
      cluster: 'k8s_venus',
      partition: 'venus-cpu',
      cpu: 1,
      memory: 5,
      userMode: "starlight",
    })
  }
  return $request({
    url: '/api/job/submit',
    method: 'post',
    data: {
      app,
      params,
      runtime_params
    }
  })
}

export const getJobResult = (jobindex: string, appname: string): Promise<JobResult>  => {
  if (jobindex === 'example') {
    return new Promise((resolve, reject) => {
      let outputs  = {
        "outputs": {
          "output1": {
            class: "file",
            file: {
              uri: "xxx",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile
          },
          "output2": {
            class: "file",
            file: {
              uri: "xxx",
              meta: {
                mime: 'text/plain',
              }
            } as stringFile
          }
        } as OutputMap
      }
      let mockData = Object.assign(outputs  , jobMetaExample)
      setTimeout(()=>{
        resolve(mockData)
      }, mockQueryTime)
    })
  }
  return new Promise((resolve, reject) => {reject("Not Ok Yet")})
}

/*  
  region: 选择的领域
  params: 其他扩展参数，如分页控制等
  结果：
  spec: App 列表
    name: 索引名称， title: 显示给用户的名称,
    icon: 图片，如地址为 https://starlight.nscc-gz.cn/api/mei/acorn/2e2f701b-1ee2-4d7e-988e-3d36c8343b80
    type: 类型区分
 */
export const getApps = (region?:string, params?: any,):Promise<ApiResponseItems<AppMeta>>  => {
  const mockApps = {spec: [
    {name: 'structure-prediction',path:'/predict/structure',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'structurePrediction'},
    {name: 'structure-prediction',path:'/predict/structure',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'structurePrediction'},
    {name: 'structure-prediction',path:'/predict/structure',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'structurePrediction'},
    {name: 'structure-similarity',path:'/predict/structure/queue',title: '相似性比对',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'structurePrediction'},
    {name: 'graphppis',path:'/predict/structure',title: '位点预测',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'structurePrediction'},
    {name: 'structure-prediction',path:'/predict/structure',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'structurePrediction'},
    {name: 'structure-similarity',path:'/predict/structure/queue',title: '相似性比对',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'structureSimilarly'},
    {name: 'graph-ppis',path:'/predict/structure',title: '位点预测',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'structureSimilarly'},
    {name: 'structure-prediction',path:'/predict/structure',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'structureSimilarly'},
    {name: 'structure-similarity',path:'/predict/structure/queue',title: '相似性比对',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'structureSimilarly'},
    {name: 'graph-ppis',path:'/predict/structure',title: '位点预测',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'sitePrediction'},
    {name: 'structure-prediction',path:'/predict/structure',title: '结构预测', icon: '2e2f701b-1ee2-4d7e-988e-3d36c8343b80', type: 'sitePrediction'},
    {name: 'structure-similarity',path:'/predict/structure/queue',title: '相似性比对',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'sitePrediction'},
    {name: 'graph-ppis',path:'/predict/structure',title: '位点预测',icon: '513e68a9-d6e0-4014-93af-2c912448e258', type: 'sitePrediction'},
  ], total: 100}
  params = Object.assign({region}, params)
  if (params.mock){
    return new Promise((resolve, reject) => {
      if (region == "false") {
        reject("false")
      } else {
        let res=mockApps.spec.filter(item=>item.type==region)
        resolve({spec: res, total: res.length})
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

export const getAppSpec = (app:string,params?: any):Promise<AppSpec> => {
  const mockAppSpec = {
    "id": 1406,
    "name": "graphppis",
    "render": {
        "id": "widgets-root",
        "type": "container",
        "name": "",
        "value": "",
        "offset": 0,
        "width": 24,
        "label": "根组件",
        "attr": {},
        "data": [
            {
                "id": "info1",
                "type": "info",
                "name": "",
                "value": "",
                "offset": 0,
                "width": 24,
                "label": "",
                "attr": {
                    "visible": true,
                    "default": "<h2 style=\"box-sizing: inherit; color: #303133; font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; text-align: center;\" data-v-67dea2ff=\"\"><span style=\"box-sizing: inherit; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; color: #000000; font-family: 'Microsoft Yahei', 微软雅黑, 宋体; font-size: 36px; font-weight: 600; text-align: justify; background-color: #ffffff; float: none; display: inline !important;\">GraphPPIS : 基于深度图卷积网络的结构感知的蛋白质相互作用位点预测</span><br style=\"box-sizing: inherit; color: #303133; font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif; font-size: 18.72px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: bold; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\" /><span style=\"color: #303133; font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif; font-size: 18.72px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: bold; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;\">ref:&nbsp;</span><span style=\"box-sizing: inherit; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: bold; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; color: #333333; font-family: arial; font-size: 16px;\">https://doi.org/10.1093/bioinformatics/btab643</span></h2>"
                },
                "data": []
            },
            {
                "id": "text1",
                "type": "text",
                "name": "pdbID",
                "value": "1r8s",
                "offset": 0,
                "width": 24,
                "label": "pdbID",
                "attr": {
                    "placeholder": "",
                    "required": false,
                    "disabled": false,
                    "visible": true,
                    "rules": "",
                    "default": "1r8s"
                },
                "data": []
            },
            {
                "id": "rfbPath1",
                "type": "rfbPath",
                "name": "pdb",
                "value": "",
                "offset": 0,
                "width": 24,
                "label": "pdb",
                "attr": {
                    "placeholder": "",
                    "default": "",
                    "visible": true,
                    "required": false,
                    "rules": ""
                },
                "data": []
            },
            {
                "id": "text2",
                "type": "text",
                "name": "chain",
                "value": "E",
                "offset": 0,
                "width": 24,
                "label": "chain",
                "attr": {
                    "placeholder": "",
                    "required": true,
                    "disabled": false,
                    "visible": true,
                    "rules": "",
                    "default": "E"
                },
                "data": []
            },
            {
                "id": "list1",
                "type": "list",
                "name": "mode",
                "value": "",
                "offset": 0,
                "width": 24,
                "label": "mode",
                "attr": {
                    "required": false,
                    "disabled": false,
                    "visible": true,
                    "options": [
                        {
                            "label": "fast",
                            "value": "fast",
                            "number": false,
                            "disabled": false,
                            "selected": false
                        },
                        {
                            "label": "slow",
                            "value": "slow",
                            "disabled": false
                        }
                    ],
                    "default": "fast"
                },
                "data": []
            }
        ]
    },
    "title": "GraphPPIS",
    "icon": "513e68a9-d6e0-4014-93af-2c912448e258",
    "type": "1",
    "description": "蛋白质结合位点预测算法"
}
  if (app === 'graph-ppis') {
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        resolve(mockAppSpec)
      }, mockQueryTime)
    })
  }
  return new Promise((resolve, reject) => {reject("Not Ok Yet")})
}

export const getJobs = (params?: any):Promise<ApiResponseItems<jobMeta>> => {
  const mockData = [
    jobMetaExample,
    jobMetaExample,
    jobMetaExample,
  ]
  if (params && params.mock === '1') {
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        resolve({spec: mockData, total: 1000})
      }, mockQueryTime)
    })
  }
  return new Promise((resolve, reject) => {reject("Not Ok Yet")})
}

// Orginal API
export const checkPredictStructureProjectName = (projName: string): Promise<any> => {
  return http.get('/predict/structure/check/', {params: {proj_name: projName}})
}

export const submitPredictStruct = (r: structurePredictRequest): Promise<any> => {
  return http.post('/predict/structure_submit/', r)
}
