<template>
    <div class="box">
        <el-dialog v-model="modelValue" title="目标集群与分区配置" class="dialog">
            <el-row>
                <el-col :span="10">
                    <div class="cluster-title">集群名称</div>
                </el-col>
                <el-col :span="10">
                    <div class="cluster-title">分区名称</div>
                </el-col>
            </el-row>
            <el-row style="position:relative" v-for="(item, index) in selectList" :key="item.name" :gutter="20">
                <div class="pre">{{ index + 1 }}</div>
                <el-col :span="10" class="t-c m-2">{{ item.name }}</el-col>
                <el-col :span="10" class="t-c m-2">{{ item.value }}</el-col>
                <el-col :span="2">
                    <el-button type="danger"  @click="del(item.name)">删除</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-select class="sel" v-model="groupName">
                        <el-option v-for="item in optionName" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-col>
                <el-col :span="10">
                    <el-select class="sel" multiple v-model="groupValue">
                        <el-option v-for="item in nameToValue" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="insert">插入</el-button>
                </el-col>
            </el-row>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="emit('update:modelValue', false)">取消</el-button>
                    <el-button type="primary" @click="confirm">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

let props = defineProps<{
    modelValue: boolean,
}>()
let emit = defineEmits<{
    (e: 'update:modelValue', arg: boolean): void,
    (e: 'setGroup', arg: { name: string, value: string[] }[]): void
}>()
watch(() => props.modelValue, () => emit('update:modelValue', props.modelValue))

let groupName = ref('')
let groupValue = ref([])
let optionName = [
    { label: 'name1', value: 'name1' },
    { label: 'name2', value: 'name2' },
    { label: 'name3', value: 'name3' },
]
let optionValue: {
    [name: string]: { label: string, value: string }[]
} = {
    name1: [
        { label: 'value1-1', value: 'value1-1' },
        { label: 'value1-2', value: 'value1-2' },
    ],
    name2: [
        { label: 'value2-1', value: 'value2-1' },
        { label: 'value2-2', value: 'value2-2' },
    ],
    name3: [
        { label: 'value3-1', value: 'value3-1' },
        { label: 'value3-2', value: 'value3-2' },
    ],
}
let nameToValue = computed(() => {
    groupValue.value = []
    return optionValue[groupName.value]
})


let selectList = ref<{ name: string, value: string[] }[]>([])
let insert = () => {
    for (let item of selectList.value) {
        if (item.name === groupName.value) {
            item.value = groupValue.value
            return
        }
    }
    selectList.value.push({ name: groupName.value, value: groupValue.value })
}
let del = (name: string) => {
    for (let i in selectList.value) {
        let index = Number(i)
        if (name === selectList.value[i].name) {
            selectList.value.splice(index, 1)
        }
    }
}
let confirm = () => {
    emit('update:modelValue', false)
    emit('setGroup', selectList.value)
}
</script>

<style lang="less" scoped>
.dialog {
    padding: 10px 30px
}

.sel {
    width: 100%;
}

.pre {
    position: absolute;
    left: 30px;
    line-height: 36px;
}

.t-c {
    text-align: center;
    line-height: 36px;
}

.m-2 {
    margin-bottom: 20px;
}


.cluster-title {
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 20px;
}
</style>
<style>
.el-popper{
    z-index: 3000 !important;
}
</style>