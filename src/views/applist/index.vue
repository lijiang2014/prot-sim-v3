<template>
  <div class="welcome">
    <div class="content">
      <app-list v-for="(value, key) in state.regions" :title="transRegion(value)" :appList="state.appList[value]">
      </app-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import appList from './AppList.vue'
import { getApps } from '../../api/api'
import { reactive } from 'vue'
import { onMounted } from 'vue';
import { AppMeta } from '@/app-model';
import { trans } from "@/i18n";
interface appList {
  [key: string]: AppMeta[]
}
const transRegion = (s: string): string => {
  return trans(s, 'region.')
}

let state = reactive<{
  appList: appList,
  regions: string[],
}>({
  appList: {},
  regions: ["default"],
})
onMounted(async () => {
  let res = await getApps().catch(err => console.log(err))
  if (!res) return
  for (let item of res.spec) {
    // 暂不支持非作业类应用
    if (item.type !== 1 && item.type !== 10) {
      continue
    }
    // if (item.title.endsWith("GUI")) {
    //   continue
    // }
    if (!item.region) {
      item.region = "default"
    }
    if (!state.appList[item.region]) {
      state.appList[item.region] = []
    }
    if (state.regions.indexOf(item.region) === -1) {
      state.regions.push(item.region)
    }
    state.appList[item.region].push(item)
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