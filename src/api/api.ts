import http from '@/api/http'
// import { AxiosPromise } from 'axios'
import { structurePredictRequest } from '@/app-model/structure'
import type { ApiResponseItems, ApiResponseSpec, AppMeta, AppSpec, jobMeta, OutputMap, PageView, result as JobResult, UserInfo, } from '@/app-model'
import { jobMetaExample } from '@/app-model'
import { AxiosRequestConfig } from 'axios'
import $request from '@/utils/starlightRequest'
import { FileInfo, fileVerbose } from '@/app-model/file'
import store, { UserType } from '@/store'
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

export const getUserInfo = (params?: any): Promise<ApiResponseSpec<UserInfo>> => {
  return http.get('user/info', { params })
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
export const getApps = (params?: any): Promise<ApiResponseItems<AppMeta>> => {
  // not use direct after ...
  return http.get('/app', { params })
}

export const getAppSpec = async (app: string, params?: any): Promise<AppSpec> => {
  let ret = await http.get('/app/' + app).catch(err => {
    throw (err)
  })
  let appData = ret.data?.spec || (ret as any).spec
  if (typeof appData.render === "string") {
    appData.render = JSON.parse(appData.render)
  }
  return (appData as AppSpec)
}

export const createApp = async (app: AppSpec): Promise<ApiResponseSpec<AppSpec>> => {
  if (typeof app.render !== "string") {
    let rawrender = JSON.stringify(app.render)
    app.render = rawrender as any
  }
  return http.post('/app', app)
}

export const deleteApp = async (appId: number, mode: 'platform' | 'soft' | 'hard' = 'platform'): Promise<ApiResponseSpec<null>> => {
  return http.delete('/app/' + appId + "?mode=" + mode, { data: {} })
}

export const updateApp = async (app: AppSpec): Promise<ApiResponseSpec<AppSpec>> => {
  if (typeof app.render !== "string") {
    let rawrender = JSON.stringify(app.render)
    app.render = rawrender as any
  }
  return http.patch('/app/' + app.id, app)
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
  // if (filesize > 1024 * 1024 * 5) {
  //   ElNotification({
  //     title: '只允许小于5MB的文件',
  //     type: 'warning',
  //     duration: 10000
  //   })
  //   return Promise.reject("只允许小于5MB的文件")
  // }
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

//对象复制
export const copy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

// Orginal API
export const checkPredictStructureProjectName = (projName: string): Promise<any> => {
  return http.get('/predict/structure/check/', { params: { proj_name: projName } })
}

export const submitPredictStruct = (r: structurePredictRequest): Promise<any> => {
  return http.post('/predict/structure_submit/', r)
}



export const ConvertToObjectUrl = (url: string, fileName: string) => {
  return new Promise<string>((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)
    xhr.responseType = 'blob'
    if (store.state.user.type === UserType.StarlightUser) {
      xhr.setRequestHeader('Bihu-Token', store.state.user.token)
    } else if (store.state.user.type === UserType.EmailFreeUser) {
      xhr.setRequestHeader('Authorization', store.state.user.token)
    }
    xhr.onload = async function (res) {
      if (this.status === 200) {
        var type = xhr.getResponseHeader('Content-Type') || ""
        var blob = new Blob([this.response])
        console.log(blob)
        if (type === "application/json") {
          let txt = await blob.text().catch(err => {
            reject("下载文件失败" + err)
          })
          if (!txt) {
            return
          }
          try {
            let respData = JSON.parse(txt)
            if (respData && respData.code) {
              reject("下载文件失败" + respData.info)
              return
            }
          } catch (e) {
            console.log("Not Real Json File")
          }
        }
        var URL = window.URL || window.webkitURL
        var objectUrl = URL.createObjectURL(blob)
        resolve(objectUrl)
      }
    }
    xhr.send()
  })
}

export const downloadStream = (url: string): Promise<Blob> => {
  //https://blog.csdn.net/dmlcq/article/details/120416981
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)
    xhr.responseType = 'blob'
    if (store.state.user.type === UserType.StarlightUser) {
      xhr.setRequestHeader('Bihu-Token', store.state.user.token)
    } else if (store.state.user.type === UserType.EmailFreeUser) {
      xhr.setRequestHeader('Authorization', store.state.user.token)
    }
    xhr.onload = async function (res) {
      if (this.status === 200) {
        var type = xhr.getResponseHeader('Content-Type') || ""
        var blob = new Blob([this.response])
        resolve(blob)
      }
    }
    xhr.send()
  })
}