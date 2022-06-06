<template>
  <div class="page">
    <div v-if="loading">数据加载中....</div>
    <div v-else>
      <result-show :baseInfo="baseInfo"></result-show>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import resultShow from './resultShow.vue'
import { getJobResult } from '@/api/api'
import { result } from '@/app-model'
import { useRoute } from 'vue-router';
import { ElNotification } from 'element-plus';



let jobIndex = ref('example')
let route = useRoute()
if (route.params.uuid) {
  if (typeof route.params.uuid === "string") {
    jobIndex.value = route.params.uuid
  } else {
    jobIndex.value = route.params.uuid[0]
  }
}
// console.log("route params", route.params)
let baseInfo = ref<result>({
  "uuid": '0000',
  "name": '',
  "app_name": '',
  "cluster_job_id": '',
  "status": "unknown",
})
let loading = ref(true)
onMounted(async () => {
  let res = await getJobResult(jobIndex.value).catch(err => {
    console.log(err)
    ElNotification(err)
  })
  loading.value = false
  if (!res) return
  console.log("res", res)
  baseInfo.value = res.spec
})

</script>

<style scoped lang="less">
@media screen and (max-width:1200px) {
  .page {
    width: 100%;
  }
}

@media screen and (min-width:1200px) {
  .page {
    width: 70%;
    margin: 0 auto;
  }
}
</style>