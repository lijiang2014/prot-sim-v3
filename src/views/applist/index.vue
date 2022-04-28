<template>
  <div class="welcome">
    <div>
      <app-list :title="state.regions[0]" :appList="state.appList[0]"></app-list>
    </div>
    <div>
      <app-list :title="state.regions[1]" :appList="state.appList[1]"></app-list>
    </div>
    <div>
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
  appList: [[],[],[]],
  regions: ['structurePrediction', 'structureSimilarly', 'sitePrediction']
})
onMounted(async () => {
  
  state.appList[0] = (await getApps(state.regions[0], { mock: '1' })).spec
  state.appList[1] = (await getApps(state.regions[1], { mock: '1' })).spec
  state.appList[2] = (await getApps(state.regions[2], { mock: '1' })).spec

})
</script>
<style lang="less" scoped>
.welcome {
  // height: 3000px;
  padding: 20px 10%;
  min-width: 1000px;
}
</style>