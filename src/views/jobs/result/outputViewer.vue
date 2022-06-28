<template>
  <div v-if="!itemParsed"></div>
  <div v-else-if="itemParsed.class === 'number'">
    <div class="simple-box">
      {{ itemParsed.value }}
    </div>
  </div>
  <div v-else-if="itemParsed.class === 'File'">
    <!-- {{ itemParsed }} -->
    <div v-if="itemParsed.meta.mime === 'text/plain'" class="file-box">
      <el-icon size="calc( 100px + 5vw)" @Click="readText">
        <Document />
      </el-icon>
      <span>{{ itemParsed.meta.basename }}</span>
    </div>
    <div v-else-if="itemParsed.meta.mime === 'chemical/fasta-predict'">
      <div>
        <saguaro v-if="fileToView" :url='reovelURI(fileToView)'>
        </saguaro>
        <el-popover placement="right">
          <template #reference>
            <span>{{ itemParsed.meta.basename }}</span>
          </template>
          <div>
            <hr>
            <el-button @Click="downloadFile" :icon="Download">{{ $t('table.download') }}</el-button>
          </div>
        </el-popover>

      </div>
    </div>
    <div v-else-if="itemParsed.meta.mime === 'chemical/pdb'">
      <div class="box">
        <db-view v-if="fileToView" :src='reovelURI(fileToView)' class="box">
        </db-view>
        <span>{{ itemParsed.meta.basename }}</span>
      </div>
    </div>
    <div v-else-if="itemParsed.meta.mime === 'chemical/cif'">
      <div class="box">
        <cif-viewer v-if="fileToView" :url='reovelURI(fileToView)' format="cif" innerRes></cif-viewer>
        <span>{{ itemParsed.meta.basename }}</span>
      </div>
    </div>
    <div v-else-if="itemParsed.meta.mime.startsWith('image')">
      <div class="imgbox">
        <el-image :src="itemParsed.location" fit="contain" class="img" :preview-src-list="[itemParsed.location!]">
        </el-image>
      </div>
    </div>
    <div v-else class="file-box">
      <!-- ="itemParsed.meta.mime === 'application/octet-stream'" -->
      <el-popover placement="right">
        <template #reference>
          <el-icon size="calc( 100px + 5vw)">
            <Document />
          </el-icon>
        </template>
        <div>{{ $t('task.tipUnknownFileView') }}
          <hr>
          <el-button @Click="downloadFile" :icon="Download">{{ $t('table.download') }}</el-button>
          <el-button @Click="readText" :icon="View">{{ $t('table.stillView') }}</el-button>
        </div>
      </el-popover>

      <span>{{ itemParsed.meta.basename }}</span>
    </div>
  </div>
  <div>
    <el-dialog v-model="showViewFile" :title="$t('table.viewContent')" width="50%" top="50vh" class="dialog">
      <div v-if="fileToView">
        <view-file :url="fileToView"></view-file>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import {
  Download,
  View,
} from '@element-plus/icons-vue'
import viewFile from "./viewFile.vue";
import store, { UserType } from '@/store'
import dbView from "@/components/common/dbView.vue";
import type { outputTypes, fileOutput, } from '@/app-model'
import { ref, onMounted } from "vue";
import { metaFromName } from "@/utils/meta";
import { FileMeta, fileVerbose } from "@/app-model/file";
import { ElNotification } from "element-plus";
import CifViewer from "@/components/common/cifViewer.vue";
import Saguaro from "@/components/common/saguaro.vue";
export interface numberValue {
  class: 'number',
  value: number
}
export interface stringValue {
  class: 'string',
  value: string
}
export interface warningValue {
  class: 'warning',
  value: string
}
export type ViewerItem = fileVerbose | numberValue | stringValue | warningValue

const itemParsed = ref<ViewerItem>()
let props = defineProps<{
  item: outputTypes
}>()
let showViewFile = ref(false)
let fileToView = ref<fileVerbose>()

const ansysOutput = (spec: outputTypes): ViewerItem => {
  if (typeof spec === "number") {
    return { class: "number", value: spec }
  }
  if (typeof spec === "string") {
    return { class: "string", value: spec }
  }
  if (Array.isArray(spec)) {
    return { class: "warning", value: "不支持显示列表" }
  }
  if (spec.class === "File") {
    let fileMeta = { ...spec, meta: metaFromName(spec.location) }
    return fileMeta
  }
  return { class: "warning", value: "Unknown output types." }
}

onMounted(() => {
  itemParsed.value = ansysOutput(props.item)
  if (itemParsed.value && itemParsed.value.class === "File") {
    fileToView.value = itemParsed.value
  }
})

const readText = () => {
  showViewFile.value = true
}

const reovelURI = (uri: fileVerbose): string => {
  let href = `${import.meta.env.VITE_APP_BASE_API}` + '/storage/download?'
  let fileQuery = ""
  let file = uri.location
  if (file.startsWith("file://")) {
    file = file.slice("file://".length)
  }
  if (file.startsWith("@") || file.startsWith("#")) {
    let dir = file.split("/")[0]
    dir = dir.slice(1)
    fileQuery += "&dir=" + dir
  }
  if (uri.meta.ext) {
    fileQuery += "&ext=" + uri.meta.ext
  }
  if (uri.checksum?.startsWith("sha1$")) {
    fileQuery += "&sha1=" + uri.checksum.slice("sha1$".length)
  }
  return href + fileQuery
}

const downloadFile = () => {
  if (!fileToView.value) {
    return
  }
  var url = reovelURI(fileToView.value)
  //https://blog.csdn.net/dmlcq/article/details/120416981
  var xhr = new XMLHttpRequest()
  var fileName = fileToView.value!.meta.basename
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
      // var blob = new Blob([this.response], { type: type })
      var blob = new Blob([this.response])
      // var blob = new Blob([this.response], { type: fileToView.value!.meta!.ext })
      console.log(blob)
      if (type === "application/json") {
        let txt = await blob.text().catch(err => {
          ElNotification.error({ title: "下载文件失败", message: err })
        })
        if (!txt) {
          return
        }
        console.log("resp json:", txt)
        try {
          let respData = JSON.parse(txt)
          if (respData && respData.code) {
            ElNotification.error({ title: "下载文件失败", message: respData.info })
            return
          }
        } catch (e) {
          console.log("Not Real Json File")
        }
      }
      var URL = window.URL || window.webkitURL
      var objectUrl = URL.createObjectURL(blob)
      var a = document.createElement('a')
      a.href = objectUrl
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      a.remove()
    }
  }
  xhr.send()
}
</script>

<style scoped lang="less">
.file-box {
  padding: 0 50px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.imgbox {
  width: calc(45px + 30vw);
  height: calc(30px + 20vw);

  .img {

    height: 100%;
    width: 80%;
    padding-left: 10%;
  }
}

.simple-box {
  padding: 10px;
  font-size: 15px
}

.box {
  height: 600px;
}

// .dialog {
//   // max-height: 98%;
//   // max-height: 800px;
// }

// ::v-deep(.el-dialog) {
//   transform: translateY(-50%);
// }
</style>