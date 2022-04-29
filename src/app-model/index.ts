
import { type } from 'os'
import * as gp from './graph-ppis'

export interface fileOutput {
  class: 'file'
  file: gp.stringFile
}

export interface filesOutput {
  class: 'files'
  files: gp.stringFile[]
}

export type classOutput = fileOutput | filesOutput

export type outputTypes = classOutput | number | string

export type OutputMap = {
  [key: string]: outputTypes
}

export interface result extends jobMeta {
  outputs?: OutputMap 
}

export interface jobMeta {
  "id": number,
  "name": string,
  "app_name": string,
  "cluster_name"?: string,
  "cluster_job_id": string, 
  "status": number, 
  "created_at"?: string, 
  "updated_at"?: string, 
  "started_at"?: string, 
  "end_at"?: string, 
}


export type ApiResponseSpec<Type> = {
  spec: Type,
}

export type ApiResponseItems<Type> = {
  spec: Type[],
  total?: number,
}

export type ApiResponse<Type> = ApiResponseSpec<Type> | ApiResponseItems<Type>

export interface AppMeta {
  name: string,
  path?: string,
  title: string, 
  icon?: string,
  type: string,
}

export interface AppWidgets {
  id: string,
  type: "container" | "info" | "text" | "rfbPath" | "list",
  name: "",
  label: string,
  attr: AppWidgetAttr ,
  data: AppWidgets[],  
}

export interface AppWidgetAttr {
  visible?: true,
  default?: any,
  placeholder?: "",
  required?: boolean,
  disabled?: boolean,
  rules?: any,
  options?: AppWidgetOption[]
}

export interface AppWidgetOption {
  label: string,
  value: string,
  number?: boolean,
  disabled?: boolean,
  selected?: boolean,
}


export interface AppSpec extends AppMeta {
  render: any,
}

export const jobMetaExample = {
  "id": 238876, 
  "user_name": "nscc-gz_jiangli", 
  "group_name": "nscc-gz", 
  "cluster_name": "k8s_venus", 
  "partition_name": "venus-cpu", 
  "cluster_job_id": "graph-ppis-25113148", 
  "name": "graph-ppis-25113148", 
  "work_dir": "/GPUFS/app/bihu/spooler/graph-ppis-25113148", 
  "status": 3, 
  "created_at": "2022-04-25T11:31:54+08:00", 
  "updated_at": "2022-04-25T11:32:09+08:00", 
  "started_at": "2022-04-25T11:31:26+08:00", 
  "end_at": "2022-04-25T11:31:42+08:00", 
  "cpu_price": 0.7, 
  "cpu_used": 0, 
  "gpu_price": 0, 
  "gpu_used": 0, 
  "memory_price": 0.1, 
  "memory_used": 0, 
  "node": 0, 
  "type": 129, 
  "exit_code": 0, 
  "suspended_time": 0, 
  "app_name": "graphppis",
  "job_fee": 0.005, 
}

