<template>
    <div>
        <div class="demo-collapse">
            <el-collapse v-model="activeNames" @change="changedActive">
                <el-collapse-item title="基本信息" name="基本信息" class="collapse-item">
                    <div class="base-info">
                        <div>名称：<span class="item-info">{{ baseInfo.name }}</span></div>
                        <div>应用：<span class="item-info">{{ baseInfo.app_name }}</span></div>
                        <div>ID：<span class="item-info">{{ baseInfo.id }}</span></div>
                        <div>提交时间：<span class="item-info">{{ parseTime(baseInfo.created_at) }}</span></div>
                        <div>开始时间：<span class="item-info">{{ parseTime(baseInfo.started_at) }}</span></div>
                        <div>结束时间：<span class="item-info">{{ parseTime(baseInfo.end_at) }}</span></div>
                        <div>运行状态：<span
                                :class="{ pending: baseInfo.status < 3, success: baseInfo.status === 3, fail: baseInfo.status > 3 }">{{
                                        status[baseInfo.status]
                                }}</span>
                        </div>
                    </div>
                </el-collapse-item>
                <el-collapse-item v-for="(item, index) in resData" :title="item.title" :name="item.title"
                    class="collapse-item">
                    <div v-if="item.class === 'simple'">
                        <div class="simple-box">
                            {{ item.value }}
                        </div>
                    </div>
                    <div v-else-if="item.class === 'file'">
                        <div v-if="item.file.meta.mime === 'text/plain'" class="text">
                            <el-icon size="calc( 80px + 3vw)" @Click="readText(item.file.uri!)">
                                <Document />
                            </el-icon>
                        </div>
                        <div v-else-if="item.file.meta.mime === 'chemical/pdb'">
                            <div class="box">
                                <db-view :src='item.file.uri'>
                                </db-view>
                            </div>
                        </div>
                        <div v-else-if="item.file.meta.mime.indexOf('image') !== -1">
                            <div class="imgbox">
                                <el-image :src="item.file.uri" fit="contain" class="img"
                                    :preview-src-list="[item.file.uri!]">
                                </el-image>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="item.class === 'files'">
                        <el-scrollbar class="scrollbar-contain" ref="scrollbarRef" @mouseenter="scrollbarUpdate">
                            <div class="scrollbar-flex-content">
                                <div v-for="(child, childIndex) in item.files" class="scrollbar-item">
                                    <div v-if="child.meta.mime === 'text/plain'" class="text">
                                        <el-icon size="calc( 80px + 3vw)" @Click="readText(child.uri!)">
                                            <Document />
                                        </el-icon>
                                    </div>
                                    <div v-else-if="child.meta.mime === 'chemical/pdb'" class="boxs">
                                        <db-view :src='child.uri'></db-view>
                                    </div>
                                    <div v-else-if="child.meta.mime.indexOf('image') !== -1">
                                        <el-image :src="child.uri" fit="cover" class="img"
                                            :preview-src-list="[child.uri!]">
                                        </el-image>
                                    </div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <el-dialog v-model="showViewFile" title="查看文本" width="50%" :top="'50vh'" class="dialog">
            <view-file :url="viewFileUrl"></view-file>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import dbView from "@/components/common/dbView.vue";
import viewFile from "./viewFile.vue";
import { onMounted, ref, nextTick } from 'vue'
import { fileOutput, filesOutput, result } from '@/app-model'
import { parseTime } from '@/utils/index'

enum status {
    '等待中' = 0,
    '挂起',
    '运行中',
    '成功',
    '失败',
    '提交失败',
    '挂起失效',
    '取消',
}

interface dataItem extends fileOutput {
    title: string
}
interface datasItem extends filesOutput {
    title: string
}
interface simple {
    title: string,
    class: 'simple',
    value: string | number
}
type listItem = dataItem | datasItem | simple


let props = defineProps<{
    baseInfo: result
}>()

let resData = ref<listItem[]>([])
let activeNames = ref<string[]>(['基本信息'])
let scrollbarRef = ref()
let showViewFile = ref(false)
let viewFileUrl = ref('')

const changedActive = () => {
    nextTick(() => {
        let myEvent = new Event('resize');
        window.dispatchEvent(myEvent);
    })
}
onMounted(() => {
    let res = props.baseInfo
    for (let key in res.outputs) {
        let outputK = res.outputs[key]
        if (typeof outputK === 'number' || typeof outputK === 'string') {
            resData.value.push({ title: key, class: 'simple', value: outputK })
        } else if (outputK.class) {
            resData.value.push(Object.assign({ title: key }, outputK))
        }
        activeNames.value.push(key)
    }
})

let scrollbarUpdate = () => {            //更新滚动条，防止滚动条不显示的bug
    for (let item of scrollbarRef.value) {
        item.update()
    }
}
let readText = async (uri: string) => {
    showViewFile.value = true
    viewFileUrl.value = uri
    console.log(viewFileUrl.value)
}
</script>

<style scoped lang="less">
.demo-collapse {
    font-size: 20px;
}

.text {
    padding: 0 50px;
    cursor: pointer;
}

.box {
    height: calc(30px + 20vw);
    width: 50%;
    position: relative;
}

.collapse-item {
    width: 100%;

    ::v-deep(.el-collapse-item__header) {
        font-size: 18px;
        font-weight: bold;
    }
}

.scrollbar-contain {
    .scrollbar-flex-content {
        display: flex;
    }

    .scrollbar-item {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px 10px;
        width: 25%;
        box-sizing: border-box;

        .boxs {
            width: calc(35px + 20vw);
            height: calc(30px + 13vw);

        }
    }
}

.base-info {
    font-size: 16px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-left: 20px;
    justify-content: space-between;

    .item-info {
        color: #29d;
    }

    .pending {
        color: #29d;
    }

    .success {
        color: #43be05
    }

    .fail {
        color: #F56C6C
    }

    &>div {
        padding: 20px 0;
        white-space: nowrap;
        margin-right: 60px;
        min-width: 270px;
    }

    &>div:last-child {
        justify-self: start;
    }

    .time {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-right: 0;

        &>div {
            padding: 20px 0;
            margin-right: 60px;
        }
    }
}

.imgbox {
    width: calc(45px + 30vw);
    height: calc(30px + 20vw);

    .img {

        height: 100%;
        width: 80%;
        padding-left: 10%;
    }
}

.simple-box {
    padding: 10px;
    font-size: 15px
}

::v-deep(.el-dialog) {
    transform: translateY(-50%);
}
</style>