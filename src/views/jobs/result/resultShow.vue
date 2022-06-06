<template>
  <div>
    <div class="demo-collapse">
      <el-collapse v-model="activeNames" @change="changedActive">
        <el-collapse-item title="基本信息" name="基本信息" class="collapse-item">
          <div class="base-info">
            <div>名称：<span class="item-info">{{ baseInfo.name }}</span></div>
            <div>应用：<span class="item-info">{{ baseInfo.app_name }}</span></div>
            <div>UUID：<span class="item-info">{{ baseInfo.uuid }}</span></div>
            <div>提交时间：<span class="item-info">{{ parseTime(baseInfo.created_at) }}</span></div>
            <div>开始时间：<span class="item-info">{{ parseTime(baseInfo.started_at) }}</span></div>
            <div>结束时间：<span class="item-info">{{ parseTime(baseInfo.end_at) }}</span></div>
            <div>运行状态：<span>{{ baseInfo.status }}</span>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item v-for="(item, index) in resData" :title="item.title" :name="item.title" class="collapse-item">
          <template v-if="Array.isArray(item)">
            <el-scrollbar class="scrollbar-contain" ref="scrollbarRef" @mouseenter="scrollbarUpdate">
              <div class="scrollbar-flex-content">
                <output-viewer v-for="(innerItem, innerIndex) in item" :item="innerItem" />
              </div>
            </el-scrollbar>
          </template>
          <output-viewer :item="item.value"></output-viewer>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import outputViewer from "./outputViewer.vue";
import { onMounted, ref, nextTick } from 'vue'
import { outputTypes, result } from '@/app-model'
import { parseTime } from '@/utils/index'

interface ItemWithTitle {
  title: string,
  value: outputTypes,
}

let props = defineProps<{
  baseInfo: result
}>()

let resData = ref<ItemWithTitle[]>([])
let activeNames = ref<string[]>(['基本信息'])
let scrollbarRef = ref()

const changedActive = () => {
  nextTick(() => {
    let myEvent = new Event('resize');
    window.dispatchEvent(myEvent);
  })
}
onMounted(() => {
  let res = props.baseInfo
  for (let key in res.outputs_raw) {
    let value = res.outputs_raw[key]
    resData.value.push({ title: key, value })
    activeNames.value.push(key)
  }
})

let scrollbarUpdate = () => {            //更新滚动条，防止滚动条不显示的bug
  for (let item of scrollbarRef.value) {
    item.update()
  }
}
</script>

<style scoped lang="less">
.demo-collapse {
  font-size: 20px;
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

::v-deep(.el-dialog) {
  transform: translateY(-50%);
}
</style>