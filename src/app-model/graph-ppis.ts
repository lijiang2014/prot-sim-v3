
export interface StarlightRuntimeParams {
  jobname: string
  cluster: string
  partition: string
  cpu?: number
  gpu?: number
  memory?: number
  nodes?: number
}

export interface baseWidget {
  getValue(): any
}

export interface FileWidget extends baseWidget {
  uri?: string  // select File From Remote
  content?: string // create File With content
  clientFile?: File // upload File From Client
  meta?: any // insert anything others
}


export interface objFile extends FileWidget {
  class: 'File'
  path: string
}

export class stringFile implements FileWidget {
  public uri?: string
  public content?: string
  public clientFile?: File
  public meta?: any
  constructor(uri: string = '', content: string = '', file?: File, meta?: any) {
    this.uri = uri
    this.content = content
    this.clientFile = file
    this.meta = meta
  }
  public getValue() {
    return this.uri
  }
}

export type GraphPPISMode = 'fast' | 'slow'

export interface GraphPPISParams {
  chain: string
  mode: GraphPPISMode
  pdbID?: string
  pdb?: stringFile
}

export type baseAppParamsTypes = string | number | stringFile | objFile

export interface AppParams {
  [key: string]: baseAppParamsTypes | baseAppParamsTypes[]
}

export function createJobName(prefix: string): string {
  let jobnametmp = ''
  const mydate = new Date()
  const time = mydate.getDate().toString() + mydate.getHours().toString() + mydate.getMinutes().toString() + mydate.getSeconds().toString()
  if (prefix.length > 10) {
    jobnametmp = prefix.substring(0, 10) + '-' + time
  } else {
    jobnametmp = prefix + '-' + time
  }
  return jobnametmp.split('_').join('-')
}
