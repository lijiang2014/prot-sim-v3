<template>
  <div class="myform">
    <!-- {{ message }} -->
    <!-- {{ props }} -->
    <el-row>
      <el-col :span="formData?.render.width" :offset="formData?.render.offset">
        <el-form label-position="top" label-width="120px" :model="message" ref="bottomFormRef">

          <el-form-item v-for="(item, index) in formData?.render.data" :label="item.label" :prop="item.id">
            <el-row v-if="item.attr.visible" class="item-row">
              <el-col :span="item.width" :offset="item.offset">
                <div v-if="item.type === 'info'">
                  <div v-html="item.attr.default" class="info"></div>
                </div>
                <div v-if="item.type === 'text'">
                  <el-input type="text" clearable v-model="message[item.id]" :placeholder="item.attr.placeholder"
                    :disabled="item.attr.disabled">
                  </el-input>
                </div>
                <div v-if="item.type === 'rfbPath'">
                  <el-upload ref="uploadRef" :auto-upload="false" action="#" :limit="1"
                    :on-exceed="(...e) => handleExceed(e, item.id)"
                    :before-upload="(...e) => beforePDBUpload(...e, item.id)"
                    :on-change="(...e) => handleChange(...e, item.id)" accept=".pdb">
                    <template #trigger>
                      <el-button type="primary">select file</el-button>
                    </template>
                    <el-button class="ml-3" type="success" @click="() => submitUpload(item.id)">
                      upload to server
                    </el-button>
                    <template #tip>
                      <div class="el-upload__tip text-red">
                        limit 1 file, new file will cover the old file
                      </div>
                    </template>
                  </el-upload>
                </div>
                <div v-if="item.type === 'list'">
                  <el-select v-model="message[item.id]" style="width: 100%;">
                    <el-option v-for="opt in item.attr.options" :label="opt.label" :value="opt.value"
                      :disabled="opt.disabled"></el-option>
                  </el-select>
                </div>
              </el-col>
            </el-row>

            <el-row v-if="index === 0" style="width: 100%;">
              <el-col :span="formData?.render.data[0].width" :offset="formData?.render.data[0].offset">
                <div>
                  <el-form :model="runtimeForm" :rules="runtimeRules" ref="topFormRef" label-width="120px"
                    class="demo-ruleForm" label-position="top" @submit.native.prevent>
                    <el-form-item prop="jobname" label="job name">
                      <template #label>
                        <span slot="label">
                          <span class="span-box">
                            <span>job name</span>
                          </span>
                        </span>
                      </template>
                      <el-input type="text" v-model="runtimeForm.jobname" clearable></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </el-col>
            </el-row>

          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">Submit</el-button>
            <el-button @click="resetForm()">Reset</el-button>
          </el-form-item>
        </el-form>

      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { getAppSpec } from '@/api/api'
import { onMounted, reactive, ref, watch } from 'vue';
import { AppSpec } from '@/app-model'
import { genFileId, ElMessage, UploadFile, } from 'element-plus'
import type { FormRules, FormInstance, UploadInstance, UploadProps, UploadRawFile, UploadFiles, } from 'element-plus'
import { submitAppTask, uploadFile } from '@/api/api'
import { StarlightRuntimeParams, createJobName } from '@/app-model/graph-ppis';

let props = defineProps(['formData'])

const appname = 'graph-ppis'
const runtimeForm = ref({
  jobname: createJobName(appname),
} as StarlightRuntimeParams)
const topFormRef = ref<FormInstance[]>()
const runtimeRules = ref({
  jobname: [
    { required: true, message: 'Please input a job name!', trigger: 'blur', },
    { pattern: /^[a-z][a-z0-9_\-]{3,23}[a-z0-9]$/, message: '命名不符合规范 /^[a-z][a-z0-9_]{3,23}[a-z0-9]$/ ', trigger: 'blur', }
  ],
} as FormRules)




//----------------------------------------------------------------------------------------------------------
let formData = ref<AppSpec>()
let message = ref<any>({
  pdb: {},
})

let uploadRef = ref<UploadInstance[]>()
let initData = {
  jobname:""
}
// onMounted(async () => {
//   let res = await getAppSpec('graph-ppis').catch((err: any) => console.log(err))
//   if (!res) return
//   formData.value = res
//   function fun(data: any) {
//     if (data.attr?.default) {
//       if (data.type !== 'info') {
//         message.value[data.id] = data.attr.default
//       }
//     }
//     if (data.data.length) {
//       for (let i of data.data) {
//         fun(i)
//       }
//     }
//   }
//   fun(res.render)   //加入默认值
//   initData = JSON.parse(JSON.stringify(message.value))
// })

watch(()=>props.formData,(newVal,oldVal)=>{
  if(!newVal)return 
  formData.value = newVal
  function fun(data: any) {
    if (data.attr?.default) {
      if (data.type !== 'info') {
        message.value[data.id] = data.attr.default
      }
    }
    if (data.data.length) {
      for (let i of data.data) {
        fun(i)
      }
    }
  }
  fun(newVal.render)   //加入默认值
  initData = JSON.parse(JSON.stringify(message.value))
  initData.jobname=runtimeForm.value.jobname
})

const handleExceed: UploadProps['onExceed'] | any = (files: UploadRawFile[], id: string) => {
  let num: number = Number(id.match(/\d/g)?.join('')) - 1   //根据id取得ref索引
  uploadRef.value![num].clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  // uploadRef.value!.handleStart(file)
}

const beforePDBUpload: UploadProps['beforeUpload'] | any = (rawFile: UploadRawFile, id: string) => {
  if (! /.pdb$/.test(rawFile.name)) {
    ElMessage.error('PDB File must be pdb format!')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('File size can not exceed 2MB!')
    return false
  }
  return false
}

const handleChange: UploadProps['onChange'] | any = (uploadFile: UploadFile, uploadFiles: UploadFiles, id: string) => {
  if (uploadFile) {
    if (!message.value.pdb[id]) {
      message.value.pdb[id] = {}
    }
    message.value.pdb![id].clientFile = uploadFile.raw!
  }
}

const submitUpload = (id: string) => {
  let num: number = Number(id.match(/\d/g)?.join('')) - 1; //根据id取得ref索引
  uploadRef.value![num].submit()
}
const bottomFormRef = ref<FormInstance>()
const submitForm = async () => {

  let pass = true
  // check forms
  await topFormRef.value![0].validate((valid, fields) => {
    if (valid) {
      console.log('sumit!')
    } else {
      console.log('error submit!', fields)
      pass = false
    }
  })
  await bottomFormRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log('sumit!')
    } else {
      console.log('error submit!', fields)
      pass = false
    }
  })
  if (!pass) { return }
  // check uploads
  for (let key in message.value.pdb) {
    console.log(message.value.pdb[key])
    if (message.value.pdb[key]?.clientFile) {
      await uploadFile("ok", message.value.pdb!.clientFile).catch(err => {
        console.log("err", err)
        pass = false
      })
    }
  }
  if (!pass) { return }
  // submit Form
  console.log(appname, message.value, runtimeForm.value)
  // change File Format
  let params: any = Object.assign({}, message.value)

  if (!message.value.pdb!.uid) {
    // params.pdb = ""
  }
  const res = await submitAppTask(appname, params, runtimeForm.value).catch(err => {
    console.log("err", err)
    pass = false
  })
  console.log(res)
  // TODO redirect to res..JobID result page
  // 请求网址: https://starlight.nscc-gz.cn/api/job/running/k8s_venus/graph-ppis-25113148

}

const resetForm = () => {
  runtimeForm.value.jobname=initData.jobname
  message.value = initData
  initData = JSON.parse(JSON.stringify(message.value))
  initData.jobname=runtimeForm.value.jobname
  console.log(message)
  for (let item of uploadRef.value!) {
    item.clearFiles()
  }
}


</script>
<style lang="less">
.myform {
  padding-top: 40px
}

.item-row {
  width: 100%;
}
</style>