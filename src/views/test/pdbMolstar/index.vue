<template>
  <div>
    <db-view src="/model_1.pdb" class="box"></db-view>
  </div>
</template>

<script lang="ts" setup>
import DbView from "@/components/common/dbView.vue";
</script>

<style lang="less" scoped>
.box {
  height: 800px;
}
</style>
