<template>
  <div class="page">
    <div v-if="loading">{{ $t('table.loading') }}</div>
    <div v-else>
      <div>
        <div class="demo-collapse">
          <el-collapse v-model="activeNames" @change="changedActive">
            <el-collapse-item :title="$t('table.taskInfos')" name="basicInfos" class="collapse-item">
              <div class="base-info">
                <div><span class="label">{{ $t('table.name') }}</span><span class="item-info">{{ baseInfo.name }}</span>
                </div>
                <div><span class="label">{{ $t('table.app') }}</span><span class="item-info">{{ baseInfo.app_name
                }}</span></div>
                <div><span class="label">{{ $t('table.UUID') }}</span><span class="item-info">{{ baseInfo.uuid }}</span>
                </div>
                <div><span class="label">{{ $t('table.createdAt') }}</span><span class="item-info">{{
                    parseTime(baseInfo.created_at)
                }}</span></div>
                <div><span class="label">{{ $t('table.startedAt') }}</span><span class="item-info">{{
                    parseTime(baseInfo.started_at)
                }}</span></div>
                <div><span class="label">{{ $t('table.endedAt') }}</span><span class="item-info">{{
                    parseTime(baseInfo.end_at)
                }}</span></div>
                <div><span class="label">{{ $t('table.taskStatus') }}</span><span class="item-info">{{ baseInfo.status
                }}</span></div>
                <div>
                  <el-button :loading="loading" :disabled="baseInfo.status.startsWith('Completed')" type="primary"
                    @click="updateData">{{ $t('table.refresh') }}
                  </el-button>
                </div>
              </div>
            </el-collapse-item>
            <el-collapse-item v-for="(item, index) in resData" :title="item.title" :name="item.title"
              class="collapse-item">
              <template v-if="Array.isArray(item)">
                <el-scrollbar class="scrollbar-contain" ref="scrollbarRef" @mouseenter="scrollbarUpdate">
                  <div class="scrollbar-flex-content">
                    <output-viewer v-for="(innerItem, innerIndex) in item" :item="innerItem" />
                  </div>
                </el-scrollbar>
              </template>
              <output-viewer class="collapse-item" :item="item.value"></output-viewer>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick } from 'vue'
import { getJobResult } from '@/api/api'
import { useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
import { parseTime } from '@/utils/index'
import { outputTypes, result } from '@/app-model'
import outputViewer from "./outputViewer.vue";

interface ItemWithTitle {
  title: string,
  value: outputTypes,
}

let resData = ref<ItemWithTitle[]>([])
let activeNames = ref<string[]>(['basicInfos'])
let scrollbarRef = ref()


let jobIndex = ref('example')
let route = useRoute()
if (route.params.uuid) {
  if (typeof route.params.uuid === "string") {
    jobIndex.value = route.params.uuid
  } else {
    jobIndex.value = route.params.uuid[0]
  }
}
// console.log("route params", route.params)
let baseInfo = ref<result>({
  "uuid": '0000',
  "name": '',
  "app_name": '',
  "cluster_job_id": '',
  "status": "unknown",
})
let loading = ref(false)

const changedActive = () => {
  nextTick(() => {
    let myEvent = new Event('resize');
    window.dispatchEvent(myEvent);
  })
}

let scrollbarUpdate = () => {            //更新滚动条，防止滚动条不显示的bug
  for (let item of scrollbarRef.value) {
    item.update()
  }
}

const updateData = async () => {
  loading.value = true
  let res = await getJobResult(jobIndex.value).catch(err => {
    console.log(err)
    ElNotification(err)
  })
  loading.value = false
  if (!res) return
  console.log("res", res)
  baseInfo.value = res.spec
  let data = res.spec
  resData.value.splice(0)
  activeNames.value.splice(1)
  for (let key in data.outputs_raw) {
    let value = data.outputs_raw[key]
    resData.value.push({ title: key, value })
    activeNames.value.push(key)
  }
}

onMounted(async () => {
  updateData()
})

</script>

<style scoped lang="less">
@media screen and (max-width:1200px) {
  .page {
    width: 100%;
  }
}

@media screen and (min-width:1200px) {
  .page {
    width: 70%;
    margin: 0 auto;
  }
}

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

  overflow-x: scroll;

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

  .label {
    margin-right: 1em;
  }

  .item-info {
    color: #29d;
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