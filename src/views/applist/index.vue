<template>
  <div class="welcome">
      <div>
        <app-list :title="'结构预测'" :appList="state.appList"></app-list>
      </div>
      <div>
        <app-list :title="'相似性比对'" :appList="state.appList"></app-list>
      </div>
      <div>
        <app-list :title="'位点预测'" :appList="state.appList"></app-list>
      </div>
  </div>
</template>
<script lang="ts" setup>
import AppList from './AppList.vue'
import {getApps} from '../../api/api'
import { reactive, ref } from '@vue/reactivity'
let state=reactive({
  appList:[]
})
getApps('1',{mock:1}).then((res)=>{
  state.appList=res.spec
  // console.log(res.spec)
})
</script>
<style lang="less" scoped>
.welcome{
  height: 3000px;
  padding: 50px 300px;
}
</style>