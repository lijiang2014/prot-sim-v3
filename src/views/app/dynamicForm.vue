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
    <div v-if="!appName">Need App Name...</div>
    <div v-else-if="loading">loading...</div>
    <el-row v-else>
      <el-col v-if="app && app.render" :span="app?.render.width" :offset="app?.render.offset">
        <el-form label-position="top" label-width="120px" :disabled="!userAvailable">
          <widget ref="runtimeFormRef" :widgetForm="runtimeForm" :rules="runtimeRules" v-model="runtimeParams"></widget>
          <widget ref="appFormRef" :widgetForm="app!.render" :rules="appRules" v-model="appParams"></widget>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">Submit</el-button>
          </el-form-item>
          <span v-if="!userAvailable" class="warning">提交计算任务需要先登录系统</span>
          <div class="text-refs" v-html="appRefs">

          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { getAppSpec, mkDirInput } from '@/api/api'
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { AppSpec, AppWidgets, runtimeDefault } from '@/app-model'
import { FormRules, FormInstance, UploadInstance, ElNotification, } from 'element-plus'
import { submitAppTask, uploadFile } from '@/api/api'
import Widget from "@/components/Widget/index.vue"
import { StarlightRuntimeParams, createJobName, AppParams } from '@/app-model/graph-ppis';
import { useStore } from '@/store'

let store = useStore()
const route = useRoute()
const router = useRouter()
const debug = ref(route.query["debug"] == 'true')
const appName = route.params.name as string
const loading = ref(false)
const runtimeRules = ref<FormRules>({
  jobname: [
    { required: true, message: 'Please input a job name!', trigger: 'blur', },
    { pattern: /^[a-z][a-z0-9_\-]{3,23}[a-z0-9]$/, message: '命名不符合规范 /^[a-z][a-z0-9_]{3,23}[a-z0-9]$/ ', trigger: 'blur', }
  ],
})
const appRules = ref<FormRules>({})
let runtimeForm = ref<AppWidgets>(runtimeDefault)
const runtimeParams = ref<StarlightRuntimeParams>({
  jobname: createJobName(appName)
} as StarlightRuntimeParams)
let app = ref<AppSpec>()
const appParams = ref<AppParams>({})
const appRefs = ref<string>("")
let userAvailable = computed(() => store.state.user.token !== "")

onMounted(async () => {
  loading.value = true
  let res = await getAppSpec(appName).catch((err: any) => {
    console.log(err)
  })
  loading.value = false
  if (!res) {
    return
  }
  // 表单初始化
  // console.log("got app spec", res)
  // * 提取 info
  let gotFirstInfo = false
  for (let i = 0; i < res.render.data.length; i++) {
    let widgeti = res.render.data[i]
    if (widgeti.type == 'info') {
      if (widgeti.name == 'refs') {
        appRefs.value = widgeti.attr.default
        res.render.data.splice(i, 1)
        continue
      } else if (!gotFirstInfo) {
        runtimeForm.value.data[0].attr.default = widgeti.attr.default
        res.render.data.splice(i, 1)
        gotFirstInfo = true
        continue
      }
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
  // init project dir
  await mkDirInput(runtimeParams.value.jobname).catch(err => {
    console.log('error create project input dir!', err)
    ElNotification.error(err)
    pass = false
  })
  if (!pass) { return }

  await appFormRef.value?.prepareSubmit({ project: runtimeParams.value.jobname }).catch((err: any) => {
    console.log('error prepare submit!', err)
    ElNotification.error(err)
    pass = false
  })
  if (!pass) { return }
  // submit Form
  console.log("job submit:", appName, appParams.value, runtimeParams.value)
  // return
  // change File Format
  let params = { ...appParams.value }
  Object.keys(params).forEach(item => {
    if (params[item] === undefined || params[item] === null) {
      delete params[item]
    }
  })
  // TODO Need more nice runtime set function
  if (app.value?.configs?.requirements?.gpuMin >= 1) {
    runtimeParams.value = Object.assign(runtimeParams.value, {
      cluster: 'k8s_venus',
      partition: 'venus-gpu',
      gpu: 1,
      cpu: 6,
      memory: 60,
      userMode: "starlight",
    })
  }
  if (appName.startsWith('alphaFold')) {
    runtimeParams.value = Object.assign(runtimeParams.value, {
      cluster: 'k8s_venus',
      partition: 'venus-gpu-localdisk',
      gpu: 1,
      cpu: 5,
      memory: 32,
      userMode: "starlight",
    })
  }
  const res = await submitAppTask(appName, params, runtimeParams.value).catch(err => {
    console.log("err", err)
    ElNotification.error(err)
    pass = false
  })
  if (!res) {
    return
  }
  console.log(res)
  if (!res.spec) {
    ElNotification.error("未成功创建作业")
    return
  }
  if (res.spec.length == 1) {
    router.push({ name: 'jobResult', params: { uuid: res.spec[0] } })
  } else {
    router.push({ name: 'jobList', query: { uuid: res.spec } })
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

.warning {
  color: #3a87ad;
  background: #50bfff;
  background-color: #ecf8ff;
  padding: 10px;
  line-height: 1.6em;
  font-size: 14px;
}
</style>