<template>
  <div class="welcome">
    <div>
      <App-list :title="`热门应用`"></App-list>
    </div>
    <div>
      <App-list :title="`结构预测`"></App-list>
    </div>
    <div>
      <App-list :title="`结构相似度`"></App-list>
    </div>
  </div>
</template>
<script lang="ts" setup>
import AppList from './AppList.vue'
</script>
<style lang="less" scoped>
.welcome{
  height: 3000px;
  padding: 50px 300px;
}
</style>