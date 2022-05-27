<template>
  <div class="welcome">
    <div class="content">
      <app-list v-for="(value,key) in state.appList" :title="(key as string)" :appList="value"></app-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import appList from './AppList.vue'
import { getApps } from '../../api/api'
import { reactive } from 'vue'
import { onMounted } from 'vue';
import { AppMeta } from '@/app-model';

export interface appList {
  [key: string]: AppMeta[]
}

let state = reactive<{
  appList: appList
}>({
  appList: {},
})
onMounted(async () => {
  let res = await getApps().catch(err => console.log(err))
  if (!res) return
  for (let item of res.spec) {
    if (!state.appList[item.region!]) {
      state.appList[item.region!] = []
    }
    state.appList[item.region!].push(item)
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