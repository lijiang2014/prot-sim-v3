<!-- 组件，可以用于选择一个远程文件或本地文件 -->
<template>
  <el-button @click="handleClick" type="primary"> select server file </el-button>
  <el-dialog v-model="visible">
    <web-remote-finder :workdir="workdir" :multiable="multiable" :types="types" :accept="accept" v-model="modelValue"
      @update:model-value="handleUpdate">
    </web-remote-finder>
    <el-button type="primary" @click="visible = false">Confirm</el-button>
  </el-dialog>
</template>
<script lang="ts" setup>
import { FileInfo, FileType } from '@/app-model/file';
import { ref } from 'vue';
import WebRemoteFinder from './index.vue';
const emit = defineEmits(["itemClick", "update:modelValue"]);

interface Props {
  workdir: string // 开始时的位置
  multiable?: boolean // 可以多选
  types?: FileType[] // 允许选择的类型
  accept: string // 允许的文件类型
  modelValue: FileInfo[]
}
const props = withDefaults(defineProps<Props>(), {
  workdir: '',
  multiable: false,
  accept: ".pdb,.cif,.bcif,.pdb.gz,.cif.gz,.bcif.gz,",
  types: () => [FileType.NormalFile],
  modelValue: () => [], // 已经选择的文件
})

let visible = ref(false)
const value = ref<FileInfo[]>([]) //选择的文件

const handleClick = () => {
  visible.value = true
}
const handleUpdate = (val: any) => {
  console.log("inner update", val, typeof val)
  emit("update:modelValue", val)
}
</script>