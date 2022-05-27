import http from '@/api/http'
// import { AxiosPromise } from 'axios'
import { structurePredictRequest } from '@/app-model/structure'
import type { ApiResponseItems, AppMeta, AppSpec, jobMeta, OutputMap, result as JobResult, } from '@/app-model'
import { jobMetaExample } from '@/app-model'
import axios, { AxiosRequestConfig } from 'axios'
import $request from '@/utils/starlightRequest'
import { stringFile } from '@/app-model/graph-ppis'
import { ElNotification } from 'element-plus'
// Mock apis
const mockQueryTime = 1000 * 1.5
export interface LoginRequest {
  username: string
  password: string
}

export const sendEmailCode = (email: string): Promise<any> => {
  return http.post('/message/email/code', { email })
}

export const login = (r: LoginRequest): Promise<any> => {
  return http.post('login', r)
}

export const uploadFile = (spath: string, file: File, settings?: AxiosRequestConfig): Promise<any> => {
  // 原 bioSim API 启用
  if (spath.startsWith('platform://')) {
    const data = new FormData()
    data.append('file', file)
    // Not A real file upload API.
    return http.post('api/similarity/upload_pdb/', data)
  }
  // 原 starlight API TODO
  if (spath.startsWith('file://')) {
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


export const submitAppTask = (app: string, params: any, runtime_params: any): Promise<any> => {
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

export const getJobResult = (jobindex: string, appname: string): Promise<JobResult> => {
  if (jobindex === 'example') {
    return new Promise((resolve, reject) => {
      let outputs = {
        "outputs": {
          "output1": {
            class: "file",
            file: {
              uri: "/1.txt",
              meta: {
                mime: 'text/plain',
              }
            } as stringFile
          },
          "output2": {
            class: "file",
            file: {
              uri: "/model_1.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile
          },
          "output3": {
            class: "files",
            files: [({
              uri: "../../src/assets/logo.png",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ({
              uri: "../../src/assets/1.jpg",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ({
              uri: "../../src/assets/1.jpg",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ({
              uri: "../../src/assets/logo.png",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ({
              uri: "../../src/assets/logo.png",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ({
              uri: "../../src/assets/logo.png",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ({
              uri: "../../src/assets/logo.png",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ]
          },
          "output4": {
            class: "files",
            files: [({
              uri: "/ranked_0.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),
            ({
              uri: "/ranked_1.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),
            ({
              uri: "/ranked_2.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),
            ({
              uri: "/ranked_3.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),
            ({
              uri: "/ranked_4.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),
            ]
          },
          "output5": {
            class: "files",
            files: [({
              uri: "../../src/assets/1.jpg",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ({
              uri: "/2.txt",
              meta: {
                mime: 'text/plain',
              }
            } as stringFile),
            ({
              uri: "../../src/assets/logo.png",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ({
              uri: "../../src/assets/logo.png",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ]
          },
          "output6": {
            class: "files",
            files: [({
              uri: "/model_1.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),
            ({
              uri: "/ranked_0.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),
            ({
              uri: "/ranked_1.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),
            ({
              uri: "/3.txt",
              meta: {
                mime: 'text/plain',
              }
            } as stringFile),
            ]
          },

          "output7": {
            class: "file",
            file: {
              uri: "../../src/assets/1.jpg",
              meta: {
                mime: 'image/png',
              }
            } as stringFile
          },
          "output8": {
            class: "files",
            files: [({
              uri: "/ranked_2.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),
            ({
              uri: "/ranked_3.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),
            ({
              uri: "/4.txt",
              meta: {
                mime: 'text/plain',
              }
            } as stringFile),

            ({
              uri: "../../src/assets/1.jpg",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ({
              uri: "/model_1.pdb",
              meta: {
                mime: 'chemical/pdb',
              }
            } as stringFile),

            ({
              uri: "../../src/assets/logo.png",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),

            ({
              uri: "../../src/assets/logo.png",
              meta: {
                mime: 'image/png',
              }
            } as stringFile),
            ]
          },
          "output9": {
            class: "files",
            files: [

              ({
                uri: "../../src/assets/logo.png",
                meta: {
                  mime: 'image/png',
                }
              } as stringFile),
              ({
                uri: "/model_1.pdb",
                meta: {
                  mime: 'chemical/pdb',
                }
              } as stringFile),

              ({
                uri: "../../src/assets/logo.png",
                meta: {
                  mime: 'image/png',
                }
              } as stringFile),
              ({
                uri: "/ranked_4.pdb",
                meta: {
                  mime: 'chemical/pdb',
                }
              } as stringFile),

              ({
                uri: "../../src/assets/logo.png",
                meta: {
                  mime: 'image/png',
                }
              } as stringFile),
              ({
                uri: "/5.txt",
                meta: {
                  mime: 'text/plain',
                }
              } as stringFile),

              ({
                uri: "../../src/assets/logo.png",
                meta: {
                  mime: 'image/png',
                }
              } as stringFile),
              ({
                uri: "../../src/assets/logo.png",
                meta: {
                  mime: 'image/png',
                }
              } as stringFile),
              ({
                uri: "../../src/assets/logo.png",
                meta: {
                  mime: 'image/png',
                }
              } as stringFile),
              ({
                uri: "../../src/assets/logo.png",
                meta: {
                  mime: 'image/png',
                }
              } as stringFile),
              ({
                uri: "../../src/assets/logo.png",
                meta: {
                  mime: 'image/png',
                }
              } as stringFile),
              ({
                uri: "../../src/assets/logo.png",
                meta: {
                  mime: 'image/png',
                }
              } as stringFile),
            ]
          },
          "output10": 1365413,
          "output11": "aaaaaaa",
        } as OutputMap
      }
      let mockData = Object.assign(outputs, jobMetaExample)
      setTimeout(() => {
        resolve(mockData)
      }, mockQueryTime)
    })
  }
  return new Promise((resolve, reject) => { reject("Not Ok Yet") })
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
export const getApps = (): Promise<ApiResponseItems<AppMeta>> => {
  return http.get('/app')
}

export const getAppSpec = (app: string, params?: any): Promise<AppSpec> => {
  let mockAppSpec: AppSpec = {
    "id": 1406,
    "name": "graphppis",
    "render": {
      "id": "widgets-root",
      "type": "container",
      "name": "",
      "offset": 0,
      "width": 24,
      "label": "根组件",
      "attr": {},
      "data": [
        {
          "id": "info1",
          "type": "info",
          "name": "",
          "offset": 0,
          "width": 24,
          "label": "",
          "attr": {
            "visible": true,
            "default": "<h2 style=\"box-sizing: inherit; color: #303133; font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; text-align: center;\" data-v-67dea2ff=\"\"><span style=\"box-sizing: inherit; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; letter-spacing: normal; orphans: 2; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; color: #000000; font-family: 'Microsoft Yahei', 微软雅黑, 宋体; font-size: 36px; font-weight: 600; text-align: justify; background-color: #ffffff; float: none; display: inline !important;\">GraphPPIS  : 基于深度图卷积网络的结构感知的蛋白质相互作用位点预测</span><br style=\"box-sizing: inherit; color: #303133; font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif; font-size: 18.72px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: bold; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial;\" /><span style=\"color: #303133; font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif; font-size: 18.72px; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: bold; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;\">ref:&nbsp;</span><span style=\"box-sizing: inherit; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: bold; letter-spacing: normal; orphans: 2; text-align: center; text-indent: 0px; text-transform: none; white-space: normal; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; background-color: #ffffff; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; color: #333333; font-family: arial; font-size: 16px;\">https://doi.org/10.1093/bioinformatics/btab643</span></h2>"
          },
          "data": []
        },
        {
          "id": "text1",
          "type": "text",
          "name": "pdbID",
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
          "offset": 0,
          "width": 24,
          "label": "pdb",
          "attr": {
            "placeholder": "",
            "default": "",
            "visible": true,
            "required": false,
            "extends": {
              "accept": ".pdb",
            },
            "rules": ""
          },
          "data": []
        },
        {
          "id": "text2",
          "type": "text",
          "name": "chain",
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
        },
      ]
    },
    "title": "GraphPPIS",
    "icon": "513e68a9-d6e0-4014-93af-2c912448e258",
    "type": "1",
    "description": "蛋白质结合位点预测算法"
  }
  if (app === 'graph-ppis') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(mockAppSpec)
      }, mockQueryTime)
    })
  }
  return new Promise((resolve, reject) => { reject("Not Ok Yet") })
}

export const getJobs = (params?: any): Promise<ApiResponseItems<jobMeta>> => {
  const mockData = [
    jobMetaExample,
    jobMetaExample,
    jobMetaExample,
  ]
  if (params && params.mock === '1') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ spec: mockData, total: 1000 })
      }, mockQueryTime)
    })
  }
  return new Promise((resolve, reject) => { reject("Not Ok Yet") })
}

export const getFileSystemList = (params?: any): Promise<any> => {
  return $request({
    url: '/api/storage/user_storage_path',
    method: 'get',
    params,
    headers: { 'TIMEOUT': '15' },
  })
}

export const getDirInfo = (dirpath: string, params?: any): Promise<any> => {
  let query = Object.assign({
    dir: dirpath,
  }, params)
  console.log(query)
  return $request({
    url: '/api/storage/dir_info',
    method: 'get',
    params: query,
    headers: { 'TIMEOUT': '15' },
  })
}


export function uploadFileDirect(params: any, data: Blob, settings: any) {
  if (!settings) {
    settings = {}
  }
  var contentType = 'application/octet-stream'
  var mysettings = Object.assign(settings, {
    url: '/api/storage/upload',
    method: 'put',
    params: params,
    //  headers: { 'Content-Type': contentType },
    timeout: 0,
    data
  })
  if (!mysettings.headers) {
    mysettings.headers = {}
  }
  mysettings.headers['Content-Type'] = contentType
  return $request(mysettings)
}

export function uploadFileDirectSimple(filename: string, fileObj: File, settings?: any) {
  let blob = new Blob([fileObj])
  var filesize = blob.size
  if (filesize > 1024 * 1024 * 2) {
    ElNotification({
      title: '只允许小于2MB的文件',
      type: 'warning',
      duration: 10000
    })
    return
  }
  let params = {
    file: filename,
    overwrite: false || (settings && settings.overwrite)
  }
  return uploadFileDirect(params, blob, settings)
}

// 返回文本文件的内容
export const getText = (url: string, size: number, page: number): Promise<{ text: string, total: number }> => {
  let text: string
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => {
      text = res.data.slice(size * (page - 1), size * page)
      resolve({ text, total: res.data.length })
    }).catch(err => {
      reject(err)
    })
  })
}


// Orginal API
export const checkPredictStructureProjectName = (projName: string): Promise<any> => {
  return http.get('/predict/structure/check/', { params: { proj_name: projName } })
}

export const submitPredictStruct = (r: structurePredictRequest): Promise<any> => {
  return http.post('/predict/structure_submit/', r)
}



