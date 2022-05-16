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
  "time"?: string | number,
  "uid": number,
  "gid": number,
}

