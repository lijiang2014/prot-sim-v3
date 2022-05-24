<!-- 文件选择控件
  支持：
  * 通过 attr.extends.accept 控制文件类型
  * 目前只支持单文件模式
 -->
<template>
  <el-upload ref="uploadRef" :auto-upload="false" action="#" :limit="1" :on-exceed="handleExceed"
    :before-upload="beforeUpload" :on-change="handleChange" :accept="widgetForm.attr.extends?.accept">
    <template #trigger>
      <el-button type="primary">select file</el-button>
    </template>
    <!-- <el-button class="ml-3" type="success" @click="() => submitUpload()">
      upload to server
    </el-button> -->
    <wrf-btn v-model="wrfFiles" @update:model-value="handleChangedRFB" :workdir="widgetForm.attr.extends?.workdir"
      :accept="widgetForm.attr.extends?.accept">
    </wrf-btn>
    <template #tip>
      <div class="el-upload__tip text-red">
        limit 1 file, new file will cover the old file
      </div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AppWidgets } from '@/app-model'
import { UploadFiles, UploadInstance, UploadProps, UploadRawFile, } from 'element-plus'
import { genFileId, ElMessage, UploadFile, } from 'element-plus'
import WrfBtn from '../WebRemoteFinder/input.vue'
import { FileInfo } from '@/app-model/file'
import { uploadFileDirect, uploadFileDirectSimple } from '@/api/api'
import { useStore } from '@/store'

interface Props {
  widgetForm: AppWidgets
  modelValue?: string
}
let props = defineProps<Props>()
const emit = defineEmits(["update:modelValue"]);
const uploadRef = ref<UploadInstance>()
const files = ref<File[]>()
const wrfFiles = ref<FileInfo[]>()
const store = useStore()

onMounted(() => {
  if (props.widgetForm.attr.default) {
    if (!props.modelValue) {
      emit("update:modelValue", props.widgetForm.attr.default)
    }
  } else {
    emit("update:modelValue", "")
  }
})
const beforeUpload: UploadProps['beforeUpload'] | any = (rawFile: UploadRawFile, id: string) => {
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('File size can not exceed 2MB!')
    return false
  }
  console.log('本地上传只允许2MB的文件')
  return false
}
const handleChange: UploadProps['onChange'] = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  console.log("change", "localfile://" + genFileId())
  let newFiles: File[] = []
  uploadFiles.forEach(fi => {
    newFiles.push(fi.raw as File)
  })
  files.value = newFiles
  emit("update:modelValue", "localfile://" + genFileId())
  // emit("change", "localfile://" + genFileId())
}
const handleChangedRFB = (val: FileInfo[]) => {
  if (val && val.length > 0) {
    uploadRef.value?.clearFiles()
    let filei = val[0]
    // 模拟添加文件，让列表中有显示
    let rawfile = new File([], filei.path)
    let shadowfile = { ...rawfile, uid: filei.uid }
    shadowfile.name = filei.path
    uploadRef.value?.handleStart(shadowfile)
    emit("update:modelValue", val[0].path)
  } else {
    emit("update:modelValue", "")
  }
}

const handleExceed: UploadProps['onExceed'] | any = (files: UploadRawFile[]) => {
  if (!uploadRef.value) return
  uploadRef.value.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}

const submitUpload = () => {
  // TODO...
  uploadRef.value!.submit()
}
const prepareSubmit = async () => {
  return new Promise(async (resolve, reject) => {
    if (files.value && files.value.length > 0) {
      for (let i = 0; i < files.value.length; i++) {
        let filei = files.value[i]
        if (!filei.stream) {
          // skip handle uploaded File
          continue
        }
        // upload File to $HOME/.bihu/$UUID-$filename
        let uploadDir = store.state.user.home + "/.bihu/"
        let filename = uploadDir + (new Date()).valueOf() + '-' + filei.name
        let ret = await uploadFileDirectSimple(filename, filei)
        if (!ret) {
          return
        }
        emit("update:modelValue", filename)
        // })
      }
    }
    resolve("prepareSubmit in RFB ok")
  })
}
const widgetType = () => props.widgetForm.type
defineExpose({ widgetType, prepareSubmit })


</script>
<style lang="less">
.myform {
  padding-top: 40px
}

.item-row {
  width: 100%;
}
</style>