<template>
  <template v-if="widgetForm.type === 'container' && widgetForm.data && widgetForm.data.length > 0">
    <container ref="containerRef" :widget-form="widgetForm" :rules="rules" v-model="(modelValue as AppParams)">
    </container>
  </template>
  <template v-else>
    <el-form-item v-if="widgetForm.attr.visible !== false" :label="widgetForm.label" :prop="widgetForm.name">
      <el-row class="item-row">
        <el-col :span="widgetForm.width" :offset="widgetForm.offset">
          <div v-if="widgetForm.type === 'info'">
            <div v-html="widgetForm.attr.default" class="info"></div>
          </div>
          <div v-else-if="widgetForm.type === 'text'">
            <el-input type="text" clearable v-model="(modelValue as string)" :placeholder="widgetForm.attr.placeholder"
              :disabled="widgetForm.attr.disabled" @input="handleInput">
            </el-input>
          </div>
          <div v-else-if="widgetForm.type === 'list'">
            <el-select v-model="(modelValue as string | string[] | number | number[])" @change="handleChange"
              style="width: 100%;">
              <el-option v-for="opt in widgetForm.attr.options" :label="opt.label" :value="opt.value"
                :disabled="opt.disabled">
              </el-option>
            </el-select>
          </div>
          <div v-else-if="widgetForm.type === 'rfbPath'">
            <rfb-path ref="rfbPathRef" :widget-form="widgetForm" v-model="(modelValue as string)"
              @update:model-value="handleChange"></rfb-path>
          </div>
          <div v-else-if="widgetForm.type === 'rfb'">
            <rfb ref="rfbPathRef" :widget-form="widgetForm" v-model="(modelValue as FileInput)"
              @update:model-value="handleChange"></rfb>
          </div>
        </el-col>
      </el-row>
    </el-form-item>
  </template>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { AppWidgets } from '@/app-model'
import type { AppParams, baseAppParamsTypes } from '@/app-model/graph-ppis';
import type { FileInput } from '@/app-model/file'
import Container from './container.vue';
import RfbPath from './RfbPath.vue';
import Rfb from './Rfb.vue';
import { FormRules, FormValidateCallback } from 'element-plus';
interface Props {
  widgetForm: AppWidgets,
  // modelValue: AppParams | baseAppParamsTypes | baseAppParamsTypes[]
  modelValue: any,
  rules: FormRules,
}
let props = defineProps<Props>()
const containerRef = ref<typeof Container>()
const rfbPathRef = ref<typeof RfbPath>()
const emit = defineEmits(["update:modelValue"]);
const handleInput = (newValue: string | number) => {
  emit("update:modelValue", newValue)
}
const handleChange = (newValue: any) => {
  emit("update:modelValue", newValue)
}
const validate = (callback?: FormValidateCallback) => {
  if (containerRef) {
    return containerRef.value!.validate(callback)
  }
}

const prepareSubmit = async (settings: any) => {
  if (rfbPathRef && rfbPathRef.value) {
    return rfbPathRef.value.prepareSubmit(settings)
  } else if (containerRef && containerRef.value) {
    return containerRef.value.prepareSubmit(settings)
  }
  return new Promise((resolve, reject) => {
    resolve("prepareSubmit ok")
  })
}
const widgetType = () => props.widgetForm.type

defineExpose({ validate, prepareSubmit, widgetType })

// init Default Value
onMounted(() => {
  if (props.widgetForm.attr.default) {
    if (props.widgetForm.name === "" || props.widgetForm.type == 'info') {
      return
    }
    if (!props.modelValue) {
      emit("update:modelValue", props.widgetForm.attr.default)
    }
  }
})
</script>
<style lang="less">
.myform {
  padding-top: 40px
}

.item-row {
  width: 100%;
}

.info {
  line-height: 1.15;
}
</style>