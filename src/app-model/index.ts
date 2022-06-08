
import * as gp from './graph-ppis'

export interface fileOutputMeta {
  checksum?: string
  location: string
  size: number
}
export interface fileOutput extends fileOutputMeta {
  class: 'File'
}

// export interface filesOutput {
//   class: 'Files'
//   files: fileOutputMeta[]
// }

export type classOutput = fileOutput | fileOutput[]

export type outputTypes = classOutput | number | string

export type OutputMap = {
  [key: string]: outputTypes
}

export interface result extends jobMeta {
  outputs_raw?: OutputMap
}

export interface jobMeta {
  "uuid": string,
  "name": string,
  "app_name": string,
  "app_region"?: string,
  "cluster_name"?: string,
  "partition_name"?: string,
  "cluster_job_id": string,
  "status": string,
  "created_at"?: string,
  "created_by"?: string,
  "started_at"?: string,
  "end_at"?: string,
}

export interface ApiResponseMeta {
  uuid: string
  code: number
  kind?: string
}

export interface ApiResponseSpec<Type> extends ApiResponseMeta {
  spec: Type
}

export interface ApiResponseItems<Type> extends ApiResponseMeta {
  spec: Type[],
  total?: number,
}

export type ApiResponse<Type> = ApiResponseSpec<Type> | ApiResponseItems<Type>

export interface AppMeta {
  name: string,
  path?: string,
  title: string,
  region?: string,
  icon?: string,
  type?: 1 | 10,
  id?: number,
  description?: string,
}

export interface AppWidgets {
  id: string,
  type: "container" | "info" | "text" | "rfbPath" | "rfb" | "list",
  name: string,
  label: string,
  attr: AppWidgetAttr,
  data: AppWidgets[],
  width: number,
  offset: number,
}

export interface AppWidgetAttr {
  visible?: boolean,
  default?: any,
  placeholder?: string,
  required?: boolean,
  disabled?: boolean,
  rules?: any,
  extends?: any,
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
  render: AppWidgets,
}

export const jobMetaExample: jobMeta = {
  "uuid": '238876',
  "name": "graph-ppis-25113148",
  "app_name": "graphppis",
  "cluster_name": "k8s_venus",
  "partition_name": "venus-cpu",
  "cluster_job_id": "graph-ppis-25113148",
  "status": "CompletedSuccess",
  "created_at": "2022-04-25T11:31:54+08:00",
  "created_by": "nscc-gz_jiangli",
  "started_at": "2022-04-25T11:31:26+08:00",
  "end_at": "2022-04-25T11:31:42+08:00",
}

export interface PageView {
  Body: string
  Size: number
}

export const runtimeDefault: AppWidgets = {
  "id": "runtime-root",
  "type": "container",
  "name": "",
  "offset": 0,
  "width": 24,
  "label": "",
  "attr": {},
  "data": [
    {
      "id": "info-default",
      "type": "info",
      "name": "",
      "offset": 0,
      "width": 24,
      "label": "",
      "attr": {
        "visible": true,
        "default": "",
      },
      "data": []
    },
    {
      "id": "jobname",
      "type": "text",
      "name": "jobname",
      "offset": 0,
      "width": 24,
      "label": "Job Name",
      "attr": {
        "placeholder": "",
        "required": false,
        "disabled": false,
        "visible": true,
        "rules": "",
        "default": ""
      },
      "data": []
    }]
}