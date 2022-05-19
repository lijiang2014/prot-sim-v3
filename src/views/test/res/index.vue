<template>
  <div>
    <el-row>
      <el-col :span="16" :offset="4">
        <div class="demo-collapse">
          <el-collapse v-model="activeNames" @change="changedActive">
            <el-collapse-item v-for="(item, index) in resData" :title="item.title" :name="item.title">
              <div v-if="item.class === 'file'">
                <div v-if="item.file.meta.mime === 'text/plain'" class="text">
                  <el-icon size="calc( 100px + 5vw)" @Click="readText(item.file.uri)">
                    <Document />
                  </el-icon>
                </div>
                <div v-if="item.file.meta.mime === 'chemical/pdb'">
                  <div class="box">
                    <db-view :src='item.file.uri' :boxId='item.file.uri'>
                    </db-view>
                  </div>
                </div>
                <div v-if="item.file.meta.mime.indexOf('image') !== -1">
                  <div class="imgbox">
                    <el-image :src="item.file.uri" fit="contain" class="img" :preview-src-list="[item.file.uri]">
                    </el-image>
                  </div>
                </div>
              </div>
              <div v-if="item.class === 'files'">
                <el-scrollbar class="scrollbar-contain" ref="scrollbarRef" @mouseenter="scrollbarUpdate">
                  <div class="scrollbar-flex-content">
                    <div v-for="(child, childIndex) in item.files" class="scrollbar-demo-item">
                      <div v-if="child.meta.mime === 'text/plain'" class="text">
                        <el-icon size="calc( 100px + 5vw)" @Click="readText(child.uri)">
                          <Document />
                        </el-icon>
                      </div>
                      <div v-if="child.meta.mime === 'chemical/pdb'" class="boxs">
                        <db-view :src='child.uri' :boxId='child.uri + childIndex + index'></db-view>
                      </div>
                      <div v-if="child.meta.mime.indexOf('image') !== -1">
                        <el-image :src="child.uri" fit="contain" class="img" :preview-src-list="[child.uri]"></el-image>
                      </div>
                    </div>
                  </div>
                </el-scrollbar>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import dbView from "@/components/common/dbView.vue";
import { onMounted, ref, nextTick } from 'vue'
import { getJobResult, getText } from '@/api/api'
import { fileOutput, filesOutput } from '@/app-model'

interface dataItem extends fileOutput {
  title: string
}
interface datasItem extends filesOutput {
  title: string
}
type listItem = dataItem | datasItem

let resData = ref<listItem[]>([])
let activeNames = ref<string[]>([])
let scrollbarRef = ref()

const changedActive = () => {
  nextTick(() => {
    let myEvent = new Event('resize');
    window.dispatchEvent(myEvent);
  })
}
onMounted(async () => {
  let res = await getJobResult('example', '').catch(err => {
    console.log(err)
  })
  if (!res) return
  for (let key in res.outputs) {
    resData.value.push(Object.assign({ title: key }, res.outputs[key] as dataItem | datasItem))
    activeNames.value.push(key)
  }
  console.log(resData)
})

let scrollbarUpdate = () => {            //更新滚动条，防止滚动条不显示的bug
  for (let item of scrollbarRef.value) {
    item.update()
  }
}
let readText = async (uri: string) => {
  let res = await getText(uri).catch(err => console.log(err))
  console.log(res)
}
</script>

<style scoped lang="less">
.text {
  padding: 0 50px;
  cursor: pointer;
}

.box {
  height: calc(300px + 2vw);
  width: calc(600px + 2vw);
  position: relative;
}

.scrollbar-flex-content {
  display: flex;
}

.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  // position: relative;

  .boxs {
    width: calc(350px + 1vw);
    height: calc(300px + 1vw);

  }

  .img {
    height: calc(250px + 1vw);
  }
}

.imgbox {
  height: 300px;
  width: 50%;

  .img {

    height: 100%;
    width: 80%;
    padding-left: 10%;
    vertical-align: bottom;
  }
}
</style>