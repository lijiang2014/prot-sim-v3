<template>
  <div>
    <el-row>
      <el-col :span="16" :offset="4">
        <div class="demo-collapse">
          <el-collapse v-model="activeNames" @change="changedActive">
            <el-collapse-item v-for="(item, index) in resData" :title="item.title" :name="item.title">
              <div v-if="item.class === 'file'">
                <div v-if="item.file.meta.mime === 'text/plain'">
                  <div class="text" v-html="item.file.text"></div>
                </div>
                <div v-if="item.file.meta.mime === 'chemical/pdb'">
                  <div class="box">
                    <db-view :src='item.file.uri' :boxId='item.file.uri'>
                    </db-view>
                  </div>
                </div>
                <div v-if="item.file.meta.mime === 'image/png'">
                  <div class="imgbox">
                    <el-image :src="item.file.uri" fit="contain" class="img"></el-image>
                  </div>
                </div>
              </div>
              <div v-if="item.class === 'files'">
                <el-scrollbar class="scrollbar-contain" ref="scrollbarRef" @mouseenter="scrollbarUpdate">
                  <div class="scrollbar-flex-content">
                    <div v-for="(child, childIndex) in item.files" class="scrollbar-demo-item">
                      <div v-if="child.meta.mime === 'text/plain'">
                        <div class="text" v-html="child.text"></div>
                      </div>
                      <div v-if="child.meta.mime === 'chemical/pdb'" class="boxs">
                        <db-view :src='child.uri' :boxId='child.uri + childIndex + index'></db-view>
                      </div>
                      <div v-if="child.meta.mime === 'image/png'">
                        <el-image :src="child.uri" fit="contain" class="img"></el-image>
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

let resData = ref<any>([])
let activeNames = ref<string[]>([])
let scrollbarRef = ref()

const changedActive = () => {
  nextTick(() => {
    let myEvent = new Event('resize');
    window.dispatchEvent(myEvent);
  })
}

async function addText(obj: any) {
  for (let key in obj) {
    if (obj[key].file) {
      if (obj[key].file.meta.mime === 'text/plain') {
        let text = await getText(obj[key].file.uri).catch(err => {
          console.log(err)
        });
        obj[key].file.text = text!.data
      }
    } else if (obj[key].files) {
      for (let item of obj[key].files) {
        if (item.meta.mime === 'text/plain') {
          let text = await getText(item.uri).catch(err => {
            console.log(err)
          });
          item.text = text!.data
        }
      }
    }
  }
}
onMounted(async () => {
  let res = await getJobResult('example', '').catch(err => {
    console.log(err)
  })
  if (!res) return
  await addText(res.outputs)//加入文本内容
  for (let key in res.outputs) {
    resData.value.push(Object.assign({ title: key }, res.outputs[key]))
    activeNames.value.push(key)
  }
  console.log(resData)
})

let scrollbarUpdate = () => {            //更新滚动条，防止滚动条不显示的bug
  for (let item of scrollbarRef.value) {
    item.update()
  }
}
</script>

<style scoped lang="less">
.text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 8;
  width: 80%;
}

.box {
  height: 400px;
  width: 50%;
  position: relative;
}

.scrollbar-flex-content {
  display: flex;

  .text {
    width: 300px;
  }
}

.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  // position: relative;

  .boxs {
    width: calc(300px + 1vw);
    height: calc(300px + 1vw);

  }

  .img {
    width: 300px;
  }
}

.imgbox {
  height: 300px;
  width: 50%;
  position: relative;

  .img {

    height: 80%;
    width: 80%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>