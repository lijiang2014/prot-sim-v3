/* Gennertate File Meta From filenames */

import { FileMeta } from "@/app-model/file";
import { key } from "@/store";
// type dict = { [key: string]: string[] }
let extMap: { [key: string]: string[] } = {
  "text/plain": [".txt", ".sh", ".log"],
  "chemical/pdb": [".pdb"]
}

export function metaFromName(location: string): FileMeta {
  let parts = location.split('/')
  let basename = parts[parts.length - 1]
  let ext = ""
  let i = basename.lastIndexOf(".")
  if (i !== -1) {
    ext = basename.slice(i, basename.length)
  }
  let mime = 'application/octet-stream'
  for (let key in extMap) {
    if (extMap[key].indexOf(ext) !== -1) {
      mime = key
      break
    }
  }
  return { basename, ext, mime }
}