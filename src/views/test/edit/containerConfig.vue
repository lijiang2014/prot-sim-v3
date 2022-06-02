<template>
    <div>
        <p class="top-title">当前选中：{{ curConfig.label }}</p>
        <el-select placeholder="请选择" v-model="selectType" style="margin-bottom: 15px;">
            <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-row style="margin-bottom: 15px;">
            <el-tooltip content="添加控件" placement="top">
                <el-button color="#13ce66" circle @click="add">
                    <el-icon color="#fff">
                        <Plus />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip content="删除控件" placement="top">
                <el-button color="#ff4949" circle>
                    <el-icon color="#fff">
                        <Minus />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip content="撤销" placement="top">
                <el-button color="#1890ff" circle>
                    <el-icon color="#fff">
                        <ArrowLeftBold />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip content="重做" placement="top">
                <el-button color="#ffba00" circle>
                    <el-icon color="#fff">
                        <ArrowRightBold />
                    </el-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip content="加载" placement="top">
                <el-button type="info" circle>
                    <el-icon color="#fff">
                        <Refresh />
                    </el-icon>
                </el-button>
            </el-tooltip>
        </el-row>
        <el-row>
            <el-button type="success" class="btn">保存</el-button>
            <el-button type="primary" class="btn">预览</el-button>
        </el-row>
        <el-divider></el-divider>
        <el-row>
            <el-col class="slider-title">偏移</el-col>
            <el-col :span="23" :offset="1">
                <el-slider v-model="curConfig.offset" show-input :max="24" />
            </el-col>
            <el-col class="slider-title">宽度</el-col>
            <el-col :span="23" :offset="1">
                <el-slider v-model="curConfig.width" show-input :max="24" :min='1' />
            </el-col>
            <el-col>
                <md-input disabled>类型: {{ curConfig.boxType }}</md-input>
            </el-col>
            <el-col>
                <md-input disabled>id: {{ activeId }}</md-input>
            </el-col>
            <el-col>
                <md-input v-model="curConfig.name">Name</md-input>
            </el-col>
            <el-col>
                <md-input v-model="curConfig.label">Label</md-input>
            </el-col>
            <el-col
                v-if="curConfig.boxType === 'text' || curConfig.boxType === 'info' || curConfig.boxType === 'rfb' || curConfig.boxType === 'rfbPath'">
                <md-input v-model="curConfig.default">Default</md-input>
            </el-col>
            <el-col
                v-if="curConfig.boxType === 'number'">
                <md-input v-model="curConfig.default" type="number" :min="curConfig.min" :max="curConfig.max" :step="curConfig.step">Default</md-input>
            </el-col>
            <el-col v-if="curConfig.boxType === 'text' || curConfig.boxType === 'password' || curConfig.boxType === 'rfb' || curConfig.boxType === 'rfbPath'">
                <md-input v-model="curConfig.rules">Rules</md-input>
            </el-col>
            <el-col>
                <el-switch v-model="curConfig.visible" active-color="#13ce66" inactive-color="#ff4949"
                    active-text="提交页显示该控件" inactive-text="提交页隐藏该控件">
                </el-switch>
            </el-col>
            <el-row
                v-if="curConfig.boxType === 'text' || curConfig.boxType === 'number' || curConfig.boxType === 'password' || curConfig.boxType === 'textarea' || curConfig.boxType === 'rfb' || curConfig.boxType === 'rfbPath'">
                <el-col>
                    <md-input v-model="curConfig.placeholder">Placeholder</md-input>
                    <template v-if="curConfig.boxType !== 'rfb'">
                        <template v-if="curConfig.boxType !== 'rfbPath'">
                            <template v-if="curConfig.boxType !== 'password'">
                                <span class="text-title">Disabled：</span>
                                <el-switch v-model="curConfig.disabled" active-color="#13ce66" inactive-color="#ff4949"
                                    active-text="是" inactive-text="否">
                                </el-switch>
                            </template>
                        </template>
                    </template>
                </el-col>
                <el-col v-if="curConfig.boxType !== 'textarea'">
                    <span class="text-title">Required：</span>
                    <el-switch v-model="curConfig.required" active-color="#13ce66" inactive-color="#ff4949"
                        active-text="是" inactive-text="否">
                    </el-switch>
                </el-col>
                <el-col v-if="curConfig.boxType === 'rfb' || curConfig.boxType === 'rfbPath'">
                    <span class="text-title">FileOrDir：</span>
                    <el-radio-group v-model="curConfig.fileOrDir" class="ml-4">
                        <el-radio label="file" size="large">file</el-radio>
                        <el-radio label="dir" size="large">dir</el-radio>
                        <el-radio label="all" size="large">all</el-radio>
                    </el-radio-group>
                </el-col>
            </el-row>
            <el-col>
                <md-input v-model="curConfig.type">Type</md-input>
            </el-col>
            <template v-if="curConfig.boxType === 'number'">
                <el-col>
                    <md-input v-model="curConfig.min" type="number">Min</md-input>
                </el-col>
                <el-col>
                    <md-input v-model="curConfig.max" type="number">Max</md-input>
                </el-col>
                <el-col>
                    <md-input v-model="curConfig.step" type="number">Step</md-input>
                </el-col>
            </template>
        </el-row>
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import mdInput from '@/components/MDinput/index.vue'
let props = defineProps<{
    tree: any,
    activeId: any
}>()
let emit = defineEmits<{
    (e: 'update:tree', arg1: any): void
}
>()
let selectType = ref()
let typeOption = [
    {
        label: 'container',
        value: 'container'
    },
    {
        label: 'info',
        value: 'info'
    },
    {
        label: 'text',
        value: 'text'
    },
    {
        label: 'number',
        value: 'number'
    },
    {
        label: 'password',
        value: 'password'
    },
    {
        label: 'textarea',
        value: 'textarea'
    },
    {
        label: 'rfb',
        value: 'rfb'
    },
    {
        label: 'rfbPath',
        value: 'rfbPath'
    },
]
let idStore: {
    [type: string]: number[]
} = {
    container: [],
    info: [],
    text: [],
    number: [],
    password: [],
    textarea: [],
    rfb: [],
    rfbPath: [],
}
let baseConfig = {
    offset: 0,
    width: 24,
    boxType: '',
    name: '',
    label: '',
    visible: true,
    type: '',
}
let makeBaseConfig = (type: string) => {
    let config = JSON.parse(JSON.stringify(baseConfig))
    switch (type) {
        case 'info':
            config.default = ''
            break;
        case 'text':
            config.disabled = false
            config.required = false
            config.placeholder = ''
            config.default = ''
            config.rules = ''
            break;
        case 'password':
            config.required = false
            config.placeholder = ''
            config.rules = ''
            break;
        case 'number':
            config.disabled = false
            config.required = false
            config.placeholder = ''
            config.default = ''
            config.min = '1'
            config.max = '10'
            config.step = '1'
            break;
        case 'textarea':
            config.placeholder = ''
            config.disabled = false
            break;
        case 'rfb':
            config.placeholder = ''
            config.required = false
            config.fileOrDir = 'file'
            config.default = ''
            config.rules = ''
            break;
        case 'rfbPath':
            config.placeholder = ''
            config.required = false
            config.fileOrDir = 'file'
            config.default = ''
            config.rules = ''
            break;
    }
    return config
}


let treeData = reactive({
    root: {
        config: {
            offset: 0,
            width: 24,
            boxType: 'container',
            name: '',
            label: 'root',
            visible: true,
            type: '',
        },
        children: {
        }
    },
})
let curRoot = ref('root')
let curConfig = ref<any>(treeData.root.config)
let find = (tree: any, target: any): any => {
    if (!tree) return
    for (let key in tree) {
        if (key === target) {
            return tree[key]
        } else {
            let isFind = find(tree[key].children, target)
            if (isFind) {
                return isFind
            }
        }
    }
}
let findParent = (tree: any, target: any, pre: any): any => {
    if (!tree) return
    for (let key in tree) {
        if (key === target) {
            if (tree[key].config.boxType === 'container') return key
            return pre
        } else {
            let isFind = findParent(tree[key].children, target, key)
            if (isFind) {
                return isFind
            }
        }
    }
}
let makeId = (type: string): number => {
    for (let i in idStore[type]) {
        let index = Number(i)
        if (idStore[type][i] !== index + 1) {
            idStore[type].splice(index, 0, index + 1)
            return index + 1
        }
    }
    idStore[type].push(idStore[type].length + 1)
    return idStore[type].length
}
let add = () => {
    if (!selectType.value) { return alert('请选择控件') }
    let id = selectType.value + makeId(selectType.value)
    let config = makeBaseConfig(selectType.value)
    config.boxType = selectType.value
    config.label = id
    find(treeData, curRoot.value).children[id] = { config, children: {} }
}
watch(() => treeData, () => {
    emit('update:tree', treeData)
}, { deep: true, immediate: true })

watch(() => props.activeId, () => {
    let cur = find(treeData, props.activeId)
    curConfig.value = cur.config
    curRoot.value = findParent(treeData, props.activeId, treeData)
})

</script>
<style lang="less">
.top-title {
    font-size: 16px;
    margin-top: -10px;
    margin-bottom: 5px;
}

.btn {
    width: 60px;
}

.slider-title {
    font-size: 14px;
    color: #409eff;
}

.text-title {
    display: inline-block;
    width: 60px;
    font-size: 14px;
    font-weight: 400;
    padding-right: 20px;
    color: #909399;
}
</style>