<template>
  <div>
    <dynamic-form :formData="formData"></dynamic-form>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import dynamicForm from './dynamicForm.vue';
import { getAppSpec } from '@/api/api'
let formData:any=ref()
onMounted(async () => {
  let res = await getAppSpec('graph-ppis').catch((err: any) => console.log(err))
  formData.value=res
})
</script>