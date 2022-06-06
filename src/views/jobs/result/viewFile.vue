<template>
  <div>
    <div class="text">
      <div v-if="loading">文件加载中...</div>
      <code v-if="textData" v-html="textData" class="txt-code"></code>
      <div v-if="textErr">{{ textErr }}</div>
    </div>
    <el-pagination v-model:currentPage="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper"
      :total="total" @current-change="handleCurrentChange" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { previewFile } from '@/api/api'
import { fileVerbose } from '@/app-model/file';
let props = defineProps<{
  url: string | fileVerbose
}>()
let currentPage = ref(1)
let textData = ref('')
let textErr = ref('')
let pageSize = ref(1000)
let total = ref(0)
const loading = ref(false)
let getContent = async () => {
  loading.value = true
  // let url = "file://@input/nscc-gz_jiangli/test/test.txt"
  let url = props.url
  // let url = {
  //   class: "File",
  //   size: 0,
  //   checksum: "98937a5bb80fc3d5e74b252a9195ec1f7ac42d6f",
  //   location: "file://@input/nscc-gz_jiangli/test/test.txt",
  //   dir: "input",
  // } as fileOutput
  let res = await previewFile(url, pageSize.value, currentPage.value).catch(
    err => {
      console.log("preview Err", err)
      if (err.data?.info) {
        textErr.value = `获取文件内容出错（${err.data?.code}） : ${err.data?.info}`
      } else {
        textErr.value = `获取文件内容出错`
      }
    }
  )
  loading.value = false
  console.log("res", res)
  if (!res) return
  textData.value = res.spec.Body
  total.value = res.spec.Size
}
onMounted(() => {
  console.log("mounted viewFile!")
  currentPage.value = 1
  getContent()
})
watch(() => props.url, () => {
  currentPage.value = 1
  getContent()
})
let handleCurrentChange = (page: number) => {
  currentPage.value = page
  getContent()
}
</script>

<style lang="less" scoped>
.text {
  padding: 10px;
}

.txt-code {
  white-space: pre-wrap;
}
</style>