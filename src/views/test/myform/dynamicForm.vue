<!-- 动态表单
  * 以 widget 控件为基础实现
    * 支持 "container" | "info" | "text" | "rfbPath" | "list" 等控件的嵌套使用
      - [ ] objRFB
    * 类似于 input 控件的值绑定
  * 支持基础的表单校验
  * 支持提交
    -[ ] 支持两种文件选择方式 TODO 选择服务器文件
    -[ ] 支持上传文件 TODO 自动上传文件
 -->
<template>
  <div class="myform">
    <div v-if="debug">
      {{ runtimeParams }}
      <hr>{{ appParams }}
    </div>
    <div v-if="loading">数据加载中...</div>
    <el-row v-else>
      <el-col v-if="app && app.render" :span="app?.render.width" :offset="app?.render.offset">
        <el-form label-position="top" label-width="120px">
          <widget ref="runtimeFormRef" :widgetForm="runtimeForm" :rules="runtimeRules" v-model="runtimeParams"></widget>
          <widget ref="appFormRef" :widgetForm="app!.render" :rules="appRules" v-model="appParams"></widget>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">Submit</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { getAppSpec } from '@/api/api'
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AppSpec, AppWidgets } from '@/app-model'
import { FormRules, FormInstance, UploadInstance, ElNotification, } from 'element-plus'
import { submitAppTask, uploadFile } from '@/api/api'
import Widget from "@/components/Widget/index.vue"
import { StarlightRuntimeParams, createJobName, AppParams } from '@/app-model/graph-ppis';
const route = useRoute()
const debug = ref(route.query["debug"] == 'true')
const appname = 'graph-ppis'
const loading = ref(false)
const runtimeRules = ref<FormRules>({
  jobname: [
    { required: true, message: 'Please input a job name!', trigger: 'blur', },
    { pattern: /^[a-z][a-z0-9_\-]{3,23}[a-z0-9]$/, message: '命名不符合规范 /^[a-z][a-z0-9_]{3,23}[a-z0-9]$/ ', trigger: 'blur', }
  ],
})
const appRules = ref<FormRules>({})
let runtimeForm = ref<AppWidgets>({
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
})
const runtimeParams = ref<StarlightRuntimeParams>({
  jobname: createJobName(appname)
} as StarlightRuntimeParams)
let app = ref<AppSpec>()
const appParams = ref<AppParams>({})


onMounted(async () => {
  loading.value = true
  let res = await getAppSpec(appname).catch((err: any) => {
    console.log(err)
  })
  loading.value = false
  if (!res) {
    return
  }
  // 表单初始化
  // * 提取 info
  for (let i = 0; i < res.render.data.length; i++) {
    let widgeti = res.render.data[i]
    if (widgeti.type == 'info') {
      runtimeForm.value.data[0].attr.default = widgeti.attr.default
      res.render.data.splice(i, 1)
      break
    }
  }
  // * 创建 AppRules
  for (let i = 0; i < res.render.data.length; i++) {
    let widgeti = res.render.data[i]
    let newRule = []
    if (widgeti.attr.required) {
      newRule.push({ required: true, message: 'Please input ' + widgeti.label + '!', trigger: 'blur', })
    }
    if (widgeti.attr.rules) {
      console.log('Need To Set More rules....')
    }
    if (newRule.length > 0) {
      appRules.value[widgeti.name] = newRule
    }
  }
  app.value = res
})

const runtimeFormRef = ref<typeof Widget>()
const appFormRef = ref<typeof Widget>()
const submitForm = async () => {
  let pass = true
  // check forms
  await runtimeFormRef.value?.validate((valid: boolean, fields: any) => {
    if (!valid) {
      console.log('error submit check!', fields)
      ElNotification.error('error submit check!')
      pass = false
    }
  })
  await appFormRef.value?.validate((valid: boolean, fields: any) => {
    if (!valid) {
      console.log('error submit check!', fields)
      ElNotification.error('error submit check!')
      pass = false
    }
  })
  if (!pass) { return }
  // check uploads
  console.log("uploding Files if Need...")
  await appFormRef.value?.prepareSubmit().catch((err: any) => {
    console.log('error prepare submit!', err)
    ElNotification.error(err)
    pass = false
  })
  if (!pass) { return }
  // submit Form
  console.log("job submit:", appname, appParams.value, runtimeParams.value)
  return
  // change File Format
  const res = await submitAppTask(appname, appParams.value, runtimeParams.value).catch(err => {
    console.log("err", err)
    pass = false
  })
  console.log(res)
  // TODO redirect to res..JobID result page
  // 请求网址: https://starlight.nscc-gz.cn/api/job/running/k8s_venus/graph-ppis-25113148

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