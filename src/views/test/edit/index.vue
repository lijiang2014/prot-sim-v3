<template>
    <h1 class="title">应用编辑</h1>
    <div class="base">
        <div class="base-box">
            <el-button type="primary" plain>基本信息</el-button>
            <el-button type="primary" plain>配置信息</el-button>
            <el-button type="primary" plain>提交应用</el-button>
        </div>
    </div>
    <div class="container">
        <main>
            <div class="window" @click="showToggle('#info')">
                <header>应用说明</header>
                <div>
                    <Tinymce v-model="info.content"></Tinymce>
                </div>
            </div>
            <div class="window" @click="showToggle('#cluster')">
                <header>集群与分区设置</header>
            </div>
            <div class="window" @click="showToggle('#nodes')">
                <header>节点数量设置</header>
            </div>
            <div @click="showToggle('', true)">
                <container v-model:tree="tree" @active-box-change="activeBoxChange"></container>
            </div>
        </main>
        <aside>
            <div class="window">
                <header>{{ curName }}属性配置</header>
                <el-divider></el-divider>
                <div v-show="curName === '#info'">
                    <md-input v-model="info.default">default</md-input>
                    <el-switch v-model="info.visible" active-color="#13ce66" inactive-color="#ff4949"
                        active-text="提交页显示该控件" inactive-text="提交页隐藏该控件">
                    </el-switch>
                </div>
                <div v-show="curName === '#cluster'" class="cluster">
                    <div>
                        目标集群:
                        <el-button type="primary" size="small" plain @click="addCluster()">添加</el-button>
                    </div>
                    <el-input v-model="cluster.target" placeholder="目标集群"></el-input>
                    <el-switch v-model="cluster.visible" active-color="#13ce66" inactive-color="#ff4949"
                        active-text="提交页显示该控件" inactive-text="提交页隐藏该控件">
                    </el-switch>
                </div>
                <div v-show="curName === '#nodes'">
                    <md-input v-model="nodes.default">default</md-input>
                    <el-switch v-model="nodes.visible" active-color="#13ce66" inactive-color="#ff4949"
                        active-text="提交页显示该控件" inactive-text="提交页隐藏该控件">
                    </el-switch>
                    <md-input v-model="nodes.min" type="number">Min</md-input>
                    <md-input v-model="nodes.max" type="number">Max</md-input>
                    <md-input v-model="nodes.step" type="number">Step</md-input>
                </div>
                <div v-show="boxShow">
                    <container-config v-model:tree="tree" v-model:activeId="activeId"></container-config>
                </div>
            </div>
        </aside>
        <div>
            <cluster-dialog v-model="clusterDialogVisible" @set-group="setGroup"></cluster-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import mdInput from '@/components/MDinput/index.vue'
import Tinymce from '@/components/Tinymce/index.vue'
import clusterDialog from './clusterDialog.vue'
import containerConfig from './containerConfig.vue'
import container from './container.vue'

export type configType = {
    id: string,
    offset: number,
    width: number,
    boxType: string,
    name: string,
    label: string,
    visible: true,
    type: string,
    default?: string,
    disabled?: boolean,
    required?: boolean,
    placeholder?: string,
    min?: string,
    max?: string,
    step?: string,
    rules?: string,
    fileOrDir?: string
}
export type nodeType = {
    config: configType,
    children: treeDataType
}
export interface treeDataType {
    [key: string]: nodeType
}
type selectList = { name: string, value: string[] }[]


let curName = ref('layout')
let boxShow = ref(true)
let showToggle = (name: string, box?: boolean) => {
    if (box) {
        curName.value = 'layout'
        boxShow.value = true
    } else {
        curName.value = name
        boxShow.value = false
    }
}

let info = reactive({
    default: '',
    visible: true,
    content: ''
})

let cluster = reactive({
    target: '',
    visible: true
})
let clusterDialogVisible = ref(false)
let addCluster = () => {
    clusterDialogVisible.value = true
}

let nodes = reactive<{
    default: string,
    visible: boolean,
    min: string | undefined,
    max: string | undefined,
    step: string | undefined,
}>({
    default: '',
    visible: true,
    min: undefined,
    max: undefined,
    step: undefined
})

let setGroup = (selectList: selectList) => {
    console.log(selectList)
    cluster.target = JSON.stringify(selectList)
}

let tree = ref<treeDataType>({
    root: {
        config: {
            id: 'root',
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
let activeId = ref('root')
let activeBoxChange = (id: string) => {
    activeId.value = id
    curName.value = 'layout'
    boxShow.value = true
}
</script>

<style lang="less" scoped>
h1 {
    text-align: center;
    font-weight: 400;
    font-size: 30px;
}

.window {
    border: 1px solid #87cefa;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    padding: 10px 20px;
    box-sizing: border-box;
    margin-bottom: 20px;

    header {
        font-size: 18px;
    }
}

.base {
    position: relative;
    height: 32px;

    .base-box {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
}

.container {
    display: flex;
    margin-top: 35px;

    main {
        width: 75%;
        margin-right: 30px;
    }

    aside {
        width: 25%;

        header {
            font-size: 14px;
            color: #409eff
        }

        .window {
            position: sticky;
            top: 0
        }
    }
}

.cluster {
    font-size: 16px;

    &>div {
        margin-bottom: 15px;
    }
}
</style>