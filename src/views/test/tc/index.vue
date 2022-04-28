<template>
  <div>
    <db-view
      :src='`/public/model_1.pdb`'
      boxId='id1'
    ></db-view>
  </div>
</template>

<script lang="ts" setup>
import dbView from "@/components/common/dbView.vue";
</script>

<style></style>
