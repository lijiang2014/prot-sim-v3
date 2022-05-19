<template>
  <template v-if="widgetForm.type === 'container' && widgetForm.data && widgetForm.data.length > 0">
    <el-form ref="formRef" label-position="top" label-width="120px" :rules="rules" :model="modelValue">
      <index v-for="(item, index) in widgetForm.data" :widgetForm="item"
        :ref="(el: any) => { if (el) children[index] = el }" v-model="modelValue[item.name]" :rules="rules">
      </index>
    </el-form>
  </template>
</template>
<script lang="ts" setup>
import { AppWidgets } from '@/app-model'
import { AppParams } from '@/app-model/graph-ppis';
import { FormInstance, FormRules, FormValidateCallback } from 'element-plus';
import { ref, defineProps } from 'vue';
import Index from './index.vue';
interface Props {
  widgetForm: AppWidgets
  modelValue: AppParams
  rules: FormRules
}
let props = defineProps<Props>()
const formRef = ref<FormInstance>()
const validate = (callback?: FormValidateCallback) => {
  return formRef.value?.validate(callback)
}
const children = ref<(typeof Index)[]>([])

const prepareSubmit = async () => {
  return new Promise(async (resolve, reject) => {
    for (let i = 0; i < children.value.length; i++) {
      let childrenRefI = children.value[i]
      console.log(childrenRefI, '\nxxx:', childrenRefI.widgetType())
      if (childrenRefI.widgetType() == 'rfbPath') {
        await childrenRefI.prepareSubmit().catch((err: any) => {
          reject(err)
        })
      }
    }
    resolve("prepareSubmit ok")
  })
}
const widgetType = () => props.widgetForm.type
defineExpose({ validate, prepareSubmit, widgetType })

</script>
<style lang="less">
.myform {
  padding-top: 40px
}

.item-row {
  width: 100%;
}
</style>