<template>
  <div class="welcome">
    <div>
      <app-list :title="state.title[0]" :appList="state.appList[state.title[0]]"></app-list>
    </div>
    <div>
      <app-list :title="state.title[1]" :appList="state.appList[state.title[1]]"></app-list>
    </div>
    <div>
      <app-list :title="state.title[2]" :appList="state.appList[state.title[2]]"></app-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import appList from './AppList.vue'
import { getApps } from '../../api/api'
import { reactive, ref } from '@vue/reactivity'
import { onMounted } from 'vue';
type list = {
  name: string;
  title: string;
  icon: string;
  type: string;
  path: string;
};
let state = reactive<{
  appList: {
    [propsName: string]: list[]
  },
  title: string[]
}>({
  appList: {},
  title: ['结构预测', '相似性比对', '位点预测']
})
onMounted(async () => {
  state.appList[state.title[0]] = await getApps(state.title[0], { mock: '1' })
  state.appList[state.title[1]] = await getApps(state.title[1], { mock: '1' })
  state.appList[state.title[2]] = await getApps(state.title[2], { mock: '1' })
})
</script>
<style lang="less" scoped>
.welcome {
  height: 3000px;
  padding: 20px 10%;
  min-width: 1000px;
}
</style>