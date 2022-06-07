<template>
    <el-row>
        <el-col v-for="({ config, children }, key, index) in tree" :span="config.width" :offset="config.offset"
            :key="config.id" class="box" @click.stop="boxClick(key as string)">
            <div :class="{ container: config.boxType === 'container', root: key === 'root' }">
                <div class="title">{{ config.label }}</div>
                <div v-if="config.boxType === 'text'">
                    <el-input v-model="config.default" :placeholder="config.placeholder" clearable />
                </div>
                <div v-if="config.boxType === 'rfb'">
                    <el-input v-model="config.default" :placeholder="config.placeholder" clearable />
                </div>
                <div v-if="config.boxType === 'rfbPath'">
                    <el-input v-model="config.default" :placeholder="config.placeholder" clearable />
                </div>
                <div v-if="config.boxType === 'password'">
                    <el-input v-model="inputValue[index]" :placeholder="config.placeholder" clearable show-password />
                </div>
                <div v-if="config.boxType === 'textarea'">
                    <el-input v-model="inputValue[index]" :placeholder="config.placeholder" clearable type="textarea" />
                </div>
                <div v-if="config.boxType === 'number'">
                    <el-input v-model="config.default" :placeholder="config.placeholder" type="number" :min='config.min'
                        :max='config.max' :step='config.step' />
                </div>
                <div v-if="config.boxType === 'info'">
                    <Tinymce v-model="inputValue[index]"></Tinymce>
                </div>
                <container :tree="children" @active-box-change="(id) => emit('activeBoxChange', id)"></container>
            </div>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tinymce from '@/components/Tinymce/index.vue'
import type { treeDataType } from './index.vue'
let porps = defineProps<{
    tree: treeDataType
}>()
let inputValue = ref([])
let emit = defineEmits<{
    (e: 'activeBoxChange', age1: string): void
}>()
let boxClick = (id: string) => {
    emit('activeBoxChange', id)
}
</script>


<style lang="less" scoped>
.box {
    border: 1px solid #87cefa;
    border-radius: 4px;
    padding: 10px 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 15px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
}

.title {
    font-size: 16px;
}

.container {
    min-height: 150px;
}
</style>