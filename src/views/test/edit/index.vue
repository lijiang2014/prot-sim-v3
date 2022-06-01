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
            <div class="window" @click="showToggle('', true)">
                <header>布局</header>
                <div>
                    <container :tree="tree" @active-box-change="activeBoxChange"></container>
                </div>
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
                    <container-config v-model:tree="tree" :activeId="activeId"></container-config>
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
let curName = ref('box')
let boxShow = ref(true)
let showToggle = (name: string, box?: boolean) => {
    if (box) {
        curName.value = 'box'
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

let nodes = reactive({
    default: '',
    visible: true,
    min: undefined,
    max: undefined,
    step: undefined
})

let setGroup = (selectList: any) => {
    cluster.target = JSON.stringify(selectList)
}

let tree = ref({})
let activeId = ref('root')
let activeBoxChange = (id: any) => {
    activeId.value = id
    curName.value = 'box'
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
        .window{
            position: sticky;
            top:0
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