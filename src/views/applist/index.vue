<template>
  <div class="welcome">
    <div class="content">
      <app-list :title="state.regions[0]" :appList="state.appList[0]"></app-list>
      <app-list :title="state.regions[1]" :appList="state.appList[1]"></app-list>
      <app-list :title="state.regions[2]" :appList="state.appList[2]"></app-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import appList from './AppList.vue'
import { getApps } from '../../api/api'
import { reactive } from 'vue'
import { onMounted } from 'vue';
import { AppMeta } from '@/app-model';

let state = reactive<{
  appList: AppMeta[][],
  regions: string[]
}>({
  appList: [[], [], []],
  regions: ['structurePrediction', 'structureSimilarity', 'sitePrediction']
})
onMounted(async () => {
  for (let i in state.regions) {
    let res = await getApps(state.regions[i], { mock: '1' }).catch(err => console.log(err))
    if (res) {
      state.appList[i] = res.spec
    }
  }
})
</script>
<style lang="less" scoped>
.welcome {
  // height: 3000px;
  padding: 20px calc(10vw - 20px);

  .content {
    min-width: 950px;
  }
}
</style>