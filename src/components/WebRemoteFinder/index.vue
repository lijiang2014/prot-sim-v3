<template>
  <div>
    <div style="margin:16px;">
      <el-select v-model="storage" placeholder="请选择" @change="CurrentFileSystemChanged">
        <el-option v-for="item in storages" :key="item" :label="item" :value="item">
        </el-option>
      </el-select>
      <el-input v-model="queryPath" style="width: 60%;margin-bottom:10px;" class="filter-item" placeholder="远程路径"
        @keyup.enter.native="getServerDirInfo">
        <el-button slot="append" icon="el-icon-search" type="primary" @click="getServerDirInfo"></el-button>
      </el-input>
      <div style="margin-bottom:10px;display: inline-flex;">
        <div style="margin-right: 10px;min-width: 170px">
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="家目录" placement="bottom-start">
              <el-button :disabled="enterLoading" type="primary" :icon="HomeFilled" @click="handleRetureServerRoot">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="返回上一层" placement="bottom-start">
              <el-button :disabled="enterLoading" type="primary" :icon="ArrowUp" @click="handleRetureServerDotDot">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刷新" placement="bottom-start">
              <el-button :disabled="enterLoading" type="primary" :icon="Refresh" @click="getServerList()">
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
        <div style="width: 210px">
          <el-input v-model="searchFileName" placeholder="搜索当前目录文件" style="width: 200px">
            <template #append>
              <el-button :icon="Search" @click="searchFile"></el-button>
            </template>
          </el-input>
        </div>
        <div>
          <el-button-group>
            <el-tooltip class="item" effect="dark" content="下载文件" placement="bottom-start">
              <el-button :disabled="!(selectFile && (selectFile.type === FileType.NormalFile))" :icon="Download"
                @click="handleDownload()">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="上传文件" placement="bottom-start">
              <el-button @click="handleFastCreate" :icon="Upload">
              </el-button>
            </el-tooltip>
            <input ref="inputFileRef" type="file" style="display:none" @change="uploadQueues">
          </el-button-group>
        </div>
      </div>
      <el-row style="margin-bottom:10px;">
        <el-col class="file-location-text" :span="24">
          <span class="dark-info"> &nbsp; {{ selectFile?.path }} </span>
        </el-col>
      </el-row>
      <el-row>
        <div class="icons-wrapper">
          <div class="file-title">
            <el-row>
              <el-col :span="8" :xs="8">
                <span>名称</span>
              </el-col>
              <el-col :span="3" :xs="3">
                <span>属主</span>
              </el-col>
              <el-col :span="3" :xs="3">
                <span>权限</span>
              </el-col>
              <el-col :span="3" :xs="3">
                <span>大小</span>
              </el-col>
              <el-col :span="6" :xs="6">
                <span>修改日期</span>
              </el-col>
            </el-row>
          </div>
          <div v-for="element in list" @click="handlerFileClick(element)" @disabled="!itemSelectable(element)"
            @dblclick="handleEnterClick(element, 'dbclick')"
            :class="[selectedFiles.includes(element) ? 'item-select itemactive' : 'list-group-item item']">
            <el-row>
              <el-col :span="8" :xs="8">
                <div v-if="element.type === 1">
                  <span v-if="element.name === selectFile?.name" class="file-text2">
                    <el-icon>
                      <folder-opened />
                    </el-icon>{{ element.name }}
                  </span>
                  <span v-else class="file-text">
                    <el-icon>
                      <folder />
                    </el-icon> {{ element.name }}
                  </span>
                </div>
                <div v-else>
                  <span v-if="element.name === selectFile?.name" class="file-text2">
                    <el-icon>
                      <document-checked />
                    </el-icon>
                    {{ element.name }}
                  </span>
                  <span v-else class="file-text">
                    <el-icon>
                      <document />
                    </el-icon>
                    {{ element.name }}
                  </span>
                </div>
              </el-col>
              <el-col :span="3" :xs="3">
                <span v-if="element.uid">{{ element.uid + ' ' + element.gid }}</span>
              </el-col>
              <el-col :span="3" :xs="3">
                <span v-if="element.perm">{{ element.perm }}</span>
                <span v-else>-</span>
              </el-col>
              <el-col :span="3" :xs="3">
                <span v-if="element.type === 0">{{ humanByteSize(element.size) }}</span>
                <span v-else>-</span>
              </el-col>
              <el-col :span="7" :xs="7">
                <span v-if="element.time">{{ parseTime(element.time) }}</span>
                <span v-else>-</span>
              </el-col>
            </el-row>
          </div>
          <div v-if="listLoading">正在加载数据</div>
          <div v-else-if="list.length === 0">
            无可选数据
          </div>
        </div>
      </el-row>
      <el-row>
        <div class="pagination-container">
          <el-pagination :total="totals" :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]"
            :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" small background
            @size-change="handlePageSizeChange" @current-change="handlePageCurrentChange">
          </el-pagination>
        </div>
      </el-row>
      <el-row class="file-location-text">
        <el-icon>
          <location />
        </el-icon>
        <span class="dark-info"><i class="el-icon-location-outline">:</i>{{ queryPath }}</span>
      </el-row>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, Ref, reactive } from 'vue'

import {
  Search,
  HomeFilled,
  ArrowUp,
  Refresh,
  Download,
  Upload,
  CopyDocument,
  Location,
  Folder,
  FolderOpened,
  Document,
  DocumentChecked,
} from '@element-plus/icons-vue'

import { humanByteSize, parseTime } from '@/utils'
import { getDirInfo, getFileSystemList, uploadFileDirectToStarlight } from '@/api/api'
import { useStore } from '@/store';
import { ElNotification } from 'element-plus';
import { FileInfo, FileType } from '@/app-model/file'
import { StarlightURL } from '@/utils/starlightRequest';
import axios from 'axios';
const emit = defineEmits(["update:modelValue"]);
interface Props {
  workdir: string // 开始时的位置
  multiable: boolean // 可以多选
  types: FileType[] // 允许选择的类型
  accept: string // 允许的文件类型
  modelValue: FileInfo[] // 已经选择的文件
}
const props = withDefaults(defineProps<Props>(), {
  workdir: '',
  multiable: false,
  types: () => [FileType.NormalFile],
  accept: "",
  modelValue: () => [],
})
const store = useStore()
const inputFileRef = ref<HTMLElement>()
const storage = ref('')
const storages = ref<string[]>([])
const queryPath = ref('')
const enterLoading = ref(false)
const searchFileName = ref('')
const isShowHidden = ref(false)
const selectFile = ref<FileInfo>()
// const selectedFiles = ref<FileInfo[]>([])
let selectedFiles = reactive<FileInfo[]>([])
const froms = ref([])
type UploadFlieInfo = {
  status: number,
  name: string,
  file: File,
}
const uploadingFiles: UploadFlieInfo[] = []
type TransProgress = {
  total: number,
  loaded: number,
  status: string,
  type: 'upload' | 'download' | 'tar',
  speed: number,
  timestamp: Date,
  cancel?: Function,
}
const uploadProgresses = ref<{ [index: string]: TransProgress }>({})
// const list = ref<FileInfo[]>([])
const list = reactive<FileInfo[]>([])
let listAll: FileInfo[] = []
const listLoading = ref(false)
const totals = ref(0)
const listQuery = ref({
  page: 1,
  limit: 30
})

const handleClose = () => { }
const CurrentFileSystemChanged = () => {
  queryPath.value = "/" + storage.value + '/' + store.state.user.name
  getServerList()
}
const getServerDirInfo = () => { }
const handleRetureServerRoot = async () => {
  if (props.workdir) {
    queryPath.value = props.workdir
  } else {
    queryPath.value = store.state.user.home
  }
  if (!queryPath.value) {
    queryPath.value = "/" + storage.value + '/' + store.state.user.name
  }
  getServerList()
}
const handleRetureServerDotDot = () => {
  let parts = queryPath.value.split('/')
  if (parts.length > 3) {
    parts.pop()
    queryPath.value = parts.join('/')
    getServerList()
  }
}
const searchFile = () => {
  console.log('searchFileName.value', searchFileName.value)
  splitListAll(true)
}
const handleDownload = () => {
  selectedFiles.forEach(element => {
    var href = StarlightURL + '/api/storage/download?file='
    var params = encodeURIComponent(element.path)
    window.open(href + params)
  })
  selectedFiles.splice(0, selectedFiles.length)
}
const handleFastCreate = () => {
  inputFileRef.value?.click()
}
const uploadQueues = (event: Event) => {
  if (!event.target) {
    return
  }
  let target: HTMLInputElement = event.target as HTMLInputElement
  let name = target.value?.split('\\').pop()
  if (name && target.files) {
    var fileObj = target.files[0]
    var query = {
      status: 0,
      name: name,
      file: fileObj
    }
    for (var i = 0; i < uploadingFiles.length; i++) {
      if (name === uploadingFiles[i].name) {
        console.log('In uploading queue')
        return
      }
    }
    uploadingFiles.push(query)
    var filename = queryPath.value + '/' + name
    var blob = new Blob([fileObj])
    var filesize = blob.size
    if (filesize > 1024 * 1024 * 100) {
      ElNotification({
        title: '文件较大，建议使用客户端工具传输',
        type: 'warning',
        duration: 10000
      })
      return
    }
    if (uploadProgresses.value === undefined) {
      console.log('uploadProgresses undefined')
      return
    }
    console.log('Try to transfor File')
    let CancelToken = axios.CancelToken
    uploadProgresses.value[filename] = { total: filesize, loaded: 0, status: '', type: 'upload', speed: 0, timestamp: new Date(), }
    let params = {
      file: filename,
      overwrite: false
    }
    uploadFileDirectToStarlight(params, blob, {
      onUploadProgress: (progressEvent: any) => {
        if (!uploadProgresses.value) {
          return
        }
        let progress = uploadProgresses.value[filename]
        var addloaded = progressEvent.loaded - progress.loaded
        var newDate = new Date()
        progress.loaded = progressEvent.loaded
        progress.speed = addloaded / (newDate.getTime() - progress.timestamp.getTime())
        progress.timestamp = newDate
      },
      cancelToken: new CancelToken(token => {
        uploadProgresses.value![filename].cancel = token
      })
    }).then(resp => {
      ElNotification({
        title: '文件上传成功' + filename,
        type: 'success',
        duration: 10000
      })
    }
    )
  }
}
const splitListAll = (filterEnable?: boolean) => {
  let { page, limit } = listQuery.value
  let listOrg = listAll
  if (filterEnable && searchFileName.value !== '') {
    let searchStr = searchFileName.value
    listOrg = listAll.filter((item) => item.name.indexOf(searchStr) !== -1)
  }
  if (props.accept) {
    listOrg = listOrg.filter((item) => item.type === FileType.NormalDir || itemAcceptFilter(item.name))
  }
  let total = totals.value = listOrg.length
  if (total <= limit) {
    listQuery.value.page = 1
    list.splice(0, list.length)
    list.push(...listOrg)
    return
  }
  if (((page - 1) * limit) >= total) {
    page = Math.floor((total - 1) / limit) + 1
  }
  if (page === 0) {
    page = 1
  }
  list.splice(0, list.length)
  list.push(...listOrg.slice((page - 1) * limit, page * limit))
  // list = listOrg.slice((page - 1) * limit, page * limit)
}
const handlePageSizeChange = (newPageSize: number) => {
  listQuery.value.limit = newPageSize
  splitListAll()
}
const handlePageCurrentChange = (newPage: number) => {
  listQuery.value.page = newPage
  splitListAll()
}

const itemAcceptFilter = (itemname: string) => {
  if (props.accept !== "") {
    let accepts = props.accept.split(",")
    for (let aiIndex in accepts) {
      let ai = accepts[aiIndex]
      if (ai.startsWith('.')) {
        if (itemname.endsWith(ai)) {
          return true
        }
      } else if (ai.endsWith('.')) {
        if (itemname.startsWith(ai)) {
          return true
        }
      } else if (ai === itemname) {
        return true
      }
    }
    return false
  }
  return true
}

const itemSelectable = (item: FileInfo) => {
  if (props.types && props.types.length > 0) {
    if (props.types.indexOf(item.type) === -1) {
      return false
    }
  }
  return itemAcceptFilter(item.name)
}

const handlerFileClick = (fileClicked: FileInfo) => {
  if (!itemSelectable(fileClicked)) {
    return
  }
  if (!props.multiable) {
    if (selectedFiles.length == 0) {
      selectedFiles.push(fileClicked)
      selectFile.value = fileClicked
      emit("update:modelValue", [{ ...fileClicked }])
    } else if (selectedFiles[0].path === fileClicked.path) {
      selectedFiles.pop()
      selectFile.value = undefined
      emit("update:modelValue", [])
    } else {
      selectedFiles.pop()
      selectedFiles.push(fileClicked)
      selectFile.value = fileClicked
      emit("update:modelValue", [{ ...fileClicked }])
    }
    return
  }
  let inSelectedIndex = selectedFiles.findIndex((filei) => filei.path === fileClicked.path)
  if (inSelectedIndex >= 0) {
    selectedFiles.splice(inSelectedIndex, 1)
    selectFile.value = undefined
  } else {
    selectedFiles.push(fileClicked)
    selectFile.value = fileClicked
  }
  emit("update:modelValue", selectedFiles)
  console.log('emitted', selectedFiles)
  return
}
const handleEnterClick = (item: FileInfo, type: string) => {
  if (item.type === FileType.NormalDir) {
    queryPath.value = item.path
    getServerList()
  }
}

const getServerList = async () => {
  listLoading.value = true
  list.splice(0, list.length)
  const ret = await getDirInfo(queryPath.value).catch(err => {
    ElNotification.error(err)
  })
  listAll = ret.spec
  listLoading.value = false
  totals.value = ret.total
  listQuery.value.page = 1
  splitListAll()
}

onMounted(async () => {
  storage.value = store.state.user.defaultFS
  selectedFiles.push(...props.modelValue)
  const ret = await getFileSystemList().catch(err => {
    ElNotification.error(err)
  })
  if (ret.code !== 200) {
    ElNotification.error(ret.info)
  }
  if (ret.spec) {
    storages.value = ret.spec
  }
  handleRetureServerRoot()
})

</script>
<style lang="less" scoped>
.icons-wrapper {
  margin: 0 auto;
  min-height: 330px;
  width: 100%;

  .icon-item {
    position: relative;
    margin: 10px;
    float: left;
    margin-left: auto;
    margin-right: auto;
  }
}

.list-group-item:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.list-group-item {
  position: relative;
  display: block;
  margin: 1px;
  padding: 2px 2px;
  color: #909399;
  font-size: 12px;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #fff;
}

.item:hover {
  position: relative;
  display: block;
  color: #909399 !important;
  font-size: 12px;
  background-color: #Ecf5ff;
  border: 1px solid #66b1ff;
}

.itemactive:hover {
  position: relative;
  display: block;
  font-size: 12px;
}

.item-select {
  position: relative;
  display: block;
  margin: 1px;
  padding: 2px 2px;
  font-size: 12px;
  color: #fff;
  background-color: #66B1ff;
  border: 1px solid #00C1DE;
  border-radius: 4px;
}

.dark-info {
  font-size: 12px;
  color: #909399;
}
</style>