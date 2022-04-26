<template>
<div style="padding-top: 40px">
    <el-row id="app_form">
      <el-col :span="12" :offset="6">
        <h2 class="title">Structure Prediction</h2>
        <el-form
          :model="runtimeForm"
          :rules="runtimeRules"
          ref="runtimeFormRef"
          label-width="120px"
          class="demo-ruleForm"
          label-position="top"
          @submit.native.prevent
        >
          <el-form-item prop="jobname"  label="job name" >
            <template #label>
            <span slot="label">
              <span class="span-box">
                <span>job name</span>
              </span>
            </span>
            </template>
            <el-input
              type="text"
              v-model="runtimeForm.jobname"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <el-form
          :model="appForm"
          :rules="appRules"
          ref="formRef"
          label-width="120px"
          class="demo-ruleForm"
          label-position="top"        
        >
          <el-form-item prop="pdbID" label="pdbID">
            <el-input
              type="text"
              v-model="appForm.pdbID"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item prop="pdb" label="pdbFile">
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              action="#"
              :limit="1"
              :on-exceed="handleExceed"
              :before-upload="beforePDBUpload"
              :on-change="handleChange"
              accept=".pdb"
            >
              <template #trigger>
                <el-button type="primary">select file</el-button>
              </template>
              <el-button class="ml-3" type="success" @click="submitUpload">
                upload to server
              </el-button>
              <template #tip> 
                <div class="el-upload__tip text-red">
                  limit 1 file, new file will cover the old file
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <el-form-item prop="chain" label="chain">
            <el-input
              type="text"
              v-model="appForm.chain"
              clearable
            ></el-input>
          </el-form-item>

          <el-form-item prop="mode" label="mode">
            <el-select v-model="appForm.mode" style="width: 100%;">
              <el-option label="fast" value="fast"></el-option>
              <el-option label="slow" value="slow"></el-option>
            </el-select>
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
import { ref } from 'vue';
import { StarlightRuntimeParams, GraphPPISParams as appParams,  stringFile, createJobName } from '@/app-model/graph-ppis';
import { genFileId,ElMessage, UploadFile, } from 'element-plus'
import type { FormRules, FormInstance, UploadInstance, UploadProps, UploadRawFile ,UploadFiles,} from 'element-plus'
// import { useStore } from 'vuex';
import { useStore } from '@/store';
import { submitAppTask, uploadFile } from '@/api/api';
const appname = 'graph-ppis'

// Hanle File Upload
const uploadRef = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  // uploadRef.value!.handleStart(file)
}

const submitUpload = () => {
  // TODO...
  uploadRef.value!.submit()
}
// refs: https://gitee.com/zhudachangs/big-file-uploader/blob/master/web-uploader-files-client/src/components/uploader-files.vue
const handleChange: UploadProps['onChange'] = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (uploadFile) {
    appForm.value.pdb!.clientFile = uploadFile.raw!
  }
}

const beforePDBUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (! /.pdb$/.test(rawFile.name)){
    ElMessage.error('PDB File must be pdb format!'  )
    return false
  }
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('File size can not exceed 2MB!')
    return false
  }
  return false
}

const runtimeForm = ref( {
  jobname: createJobName(appname),
 } as StarlightRuntimeParams )
const appForm = ref( {
  chain: 'E',
  mode: 'fast',
  pdbID: '1r8s',
  pdb: new stringFile()
  // _pdb: '',
 } as appParams )
const fileAvailable = (file: stringFile):boolean =>  {
  if (file.uri||file.clientFile) {
    return true
  }
  return false
}
const mustOneValidator = (rule: any, value: string, callback: any) => {
  const fileOK = fileAvailable(appForm.value.pdb as stringFile)
  if (appForm.value.pdbID && fileOK) {
    callback("pdb 和 pdbFile 只能有一个")
    return
  }
  if (appForm.value.pdbID || fileOK) {
    callback()
    return
  }
  callback("pdb 和 pdbFile 需要设置一个")
}
const runtimeRules = ref({
  jobname: [
    {required: true,  message: 'Please input a job name!',trigger: 'blur', },
    {pattern: /^[a-z][a-z0-9_\-]{3,23}[a-z0-9]$/, message: '命名不符合规范 /^[a-z][a-z0-9_]{3,23}[a-z0-9]$/ ', trigger: 'blur',}
  ],
} as FormRules)
const appRules = ref({
  pdbID: [{ pattern: /^[0-9a-zA-Z]{4}$/,  message: 'pdb ID 不符合规范',trigger: 'blur', },
    { validator: mustOneValidator, trigger: 'blur' },
  ],
  chain: [{required: true,  message: 'Please select a chain',trigger: 'blur', }],
  pdb: [     { validator: mustOneValidator, trigger: 'blur' }, ]
} as FormRules)
const runtimeFormRef = ref<FormInstance>()
const formRef = ref<FormInstance>()

// const store = useStore(key)
const store = useStore()
const state = store.state
const count = ref(0)
count.value = store.state.count
console.log(store.state.user)
const resetForm = () => {
}
const submitForm = async () => {
  let pass = true
  // check forms
  await runtimeFormRef.value?.validate((valid,fields) => {
    if (valid) {
      console.log('sumit!')
    } else {
      console.log('error submit!', fields)
      pass = false
    }
  })
  await formRef.value?.validate((valid,fields) => {
    if (valid) {
      console.log('sumit!')
    } else {
      console.log('error submit!', fields)
      pass = false
    }
  })
  if (!pass) {return}
  // check uploads
  if(appForm.value.pdb!.clientFile){
    // start upload
    await uploadFile("ok", appForm.value.pdb!.clientFile).catch(err => {
      console.log("err", err)
      pass = false
    })
  }
  if (!pass) {return}
  // submit Form
  console.log(appname, appForm.value, runtimeForm.value)
  // change File Format
  let params :any = Object.assign({}, appForm.value)
  if (! appForm.value.pdb!.uri){
    params.pdb = ""
  }
  const res = await submitAppTask(appname, params, runtimeForm.value).catch(err => {
    console.log("err", err)
    pass = false
  })
  console.log(res)
  // TODO redirect to res..JobID result page
  // 请求网址: https://starlight.nscc-gz.cn/api/job/running/k8s_venus/graph-ppis-25113148

}

</script>