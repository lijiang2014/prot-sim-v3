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
let baseInfo = ref<result>({
  "id": 0,
  "name": '',
  "app_name": '',
  "cluster_job_id": '',
  "status": 0,
})
let loading = ref(true)
onMounted(async () => {
  let res = await getJobResult('example', '').catch(err => {
    console.log(err)
  })
  if (!res) return
  baseInfo.value = res
  loading.value = false
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