import type { fileOutput } from "."

export enum FileType {
  NormalFile, // 0
  NormalDir,  // 1
}

export type FileInfo = {
  "name": string,
  "path": string,
  "size": number,
  "type": FileType,
  "perm": string,
  "checksum"?: string,
  "time"?: string | number,
  "uid": number,
  "gid": number,
}

export interface FileMeta {
  mime: string // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
  basename: string
  ext: string
}


export interface fileVerbose extends fileOutput {
  meta: FileMeta
}

export interface FileInput {
  class: "File"
  checksum?: string,
  ext?: string
  path: string
}