import http from '@/api/http'
// import { AxiosPromise } from 'axios'
import { structurePredictRequest } from '@/app-model/structure'
import type { ApiResponseItems, ApiResponseSpec, AppMeta, AppSpec, fileOutput, jobMeta, OutputMap, PageView, result as JobResult, result, } from '@/app-model'
import { jobMetaExample } from '@/app-model'
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios'
import $request from '@/utils/starlightRequest'
import { stringFile } from '@/app-model/graph-ppis'
import { ElNotification } from 'element-plus'
import { FileInfo, FileMeta, fileVerbose } from '@/app-model/file'
import store from '@/store'
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


export const submitAppTask = (app: string, params: any, runtime_params: any): Promise<ApiResponseItems<string>> => {
  if (!runtime_params?.partition) {
    runtime_params = Object.assign(runtime_params, {
      cluster: 'k8s_venus',
      partition: 'venus-cpu',
      cpu: 1,
      memory: 5,
      userMode: "starlight",
    })
  }
  return http.post('/job/submit', {
    app,
    params,
    runtime_params
  })
}

export const getJobResult = (jobindex: string): Promise<ApiResponseSpec<JobResult>> => {
  if (jobindex === 'example') {
    return new Promise((resolve, reject) => {
      let outputs = {
        "outputs_raw": {
          "output1": {
            class: "File",
            checksum: "sha1$93ecfc6be24744aa31463abb550a83474bf06cfa",
            location: "file:///GPUFS/app/bihu/spooler/graphppis-26111427j19n/log.job",
            size: 1165,
          },
          "output10": 1365413,
          "output11": "aaaaaaa",
        } as OutputMap
      }
      let spec = Object.assign(outputs, jobMetaExample)
      setTimeout(() => {
        resolve({ spec, code: 200, uuid: "0000" })
      }, mockQueryTime)
    })
  }
  return http.get('/job/result/' + jobindex)
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

export const getAppSpec = async (app: string, params?: any): Promise<AppSpec> => {
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
    "type": 1,
    "description": "蛋白质结合位点预测算法"
  }
  if (app === 'graph-ppis') {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(mockAppSpec)
      }, mockQueryTime)
    })
  }
  let ret = await http.get('/app/' + app).catch(err => {
    throw (err)
  })
  let appData = ret.data?.spec || (ret as any).spec
  if (typeof appData.render === "string") {
    appData.render = JSON.parse(appData.render)
  }
  return (appData as AppSpec)
}

export const getJobs = (params?: any): Promise<ApiResponseItems<jobMeta>> => {
  console.log("params:", params)
  return http.get('/job/result', { params })
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

export function uploadFileDirectToStarlight(params: any, data: Blob, settings: any) {
  if (!settings) {
    settings = {}
  }
  var contentType = 'application/octet-stream'
  var mysettings = Object.assign(settings, {
    url: '/api/storage/upload',
    method: 'put',
    params: params,
    timeout: 0,
    data
  })
  if (!mysettings.headers) {
    mysettings.headers = {}
  }
  mysettings.headers['Content-Type'] = contentType
  return $request(mysettings)
}


export function uploadFileDirect(params: any, data: Blob, settings: any): Promise<ApiResponseSpec<FileInfo>> {
  if (!settings) {
    settings = {}
  }
  var contentType = 'application/octet-stream'
  var mysettings = Object.assign(settings, {
    url: '/storage/upload',
    method: 'put',
    params: params,
    timeout: 0,
    data
  })
  if (!mysettings.headers) {
    mysettings.headers = {}
  }
  mysettings.headers['Content-Type'] = contentType
  // return $request(mysettings)
  return http.request(mysettings)
}

export function uploadFileDirectSimple(filename: string, fileObj: File, params?: any, settings?: any): Promise<ApiResponseSpec<FileInfo>> {
  let blob = new Blob([fileObj])
  var filesize = blob.size
  if (filesize > 1024 * 1024 * 5) {
    ElNotification({
      title: '只允许小于5MB的文件',
      type: 'warning',
      duration: 10000
    })
    return Promise.reject("只允许小于5MB的文件")
  }
  console.log("parmas ? :", params)
  let paramsAtt = {
    ...params,
    file: filename,
    overwrite: false || (settings && settings.overwrite)
  }
  return uploadFileDirect(paramsAtt, blob, settings)
}

export function mkDirInput(dirname: string) {
  let params = {
    file: "@input/" + store.state.user.name + "/" + dirname
  }
  return http.post("/storage/mkdir", null, { params })
}

// 返回文本文件的内容
export const previewFile = (url: string | fileVerbose, size: number = 1000, page: number = 1): Promise<ApiResponseSpec<PageView>> => {
  let file = ""
  let [sha1, dir, ext] = ["", "", "", ""]
  if (typeof url === "object") {
    file = url.location
    if (url.checksum?.startsWith("sha1$")) {
      sha1 = url.checksum.slice("sha1$".length)
    } else {
      return http.get("/storage/view", {
        params: { page, size, file, sha1, dir, ext },
      })
    }
    ext = url.meta.ext
    if (file.startsWith("file://")) {
      file = file.slice("file://".length)
    }
    if (file.startsWith("@") || file.startsWith("#")) {
      dir = file.split("/")[0]
      dir = dir.slice(1)
    }
    file = ""
  } else {
    file = url
  }
  return http.get("/storage/view", {
    params: { page, size, file, sha1, dir, ext },
  })
}


// Orginal API
export const checkPredictStructureProjectName = (projName: string): Promise<any> => {
  return http.get('/predict/structure/check/', { params: { proj_name: projName } })
}

export const submitPredictStruct = (r: structurePredictRequest): Promise<any> => {
  return http.post('/predict/structure_submit/', r)
}



