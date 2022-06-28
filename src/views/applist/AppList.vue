<template>
  <div>
    <list-head :title="transName(title)" @btnClick="btnClick"></list-head>
    <div class="box">
      <div class="app-list" :style="`transform:translateX(-${transform * (24 + 1.3)}%)`">
        <template v-for="item in props.appList" :key="item.name">
          <div class="contain">
            <el-card class="card">
              <el-tooltip placement="bottom" :content="item.description">
                <div class="app" @click="appClick(item)">
                  <el-image :src="imgUrl + item.icon" fit="scale-down" class="img" />
                  <div class="text">
                    <div>{{ item.title }}</div>
                  </div>
                </div>
              </el-tooltip>
            </el-card>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AppMeta } from "@/app-model";
import { trans } from "@/i18n";
import { ref } from "vue";
import { useRouter } from "vue-router";
import listHead from "./ListHead.vue";


let router = useRouter()
let props = defineProps<{ title: string; appList: AppMeta[] }>();
let imgUrl = "https://starlight.nscc-gz.cn/api/mei/acorn/";
let transform = ref(0);
const transName = (s: string): string => {
  return trans(s, 'route.')
}
let btnClick = (num: number) => {
  let n = props.appList.length;
  if (transform.value + num >= n - 3) return;
  if (transform.value + num >= 0) {
    transform.value += num;
  }
};
let appClick = (app: AppMeta) => {
  if (app.path) {
    router.push(app.path)
    return
  }
  router.push({ name: 'AppForm', params: { name: app.name } })
}
</script>

<style lang="less" scoped>
.box {
  overflow: hidden;
  width: 100%;
}

.app-list {
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  transition: all 0.3s linear;
}

.contain {
  height: 250px;
  width: 24%;
  margin-right: 1.33%;
  flex-shrink: 0;
}

.img {
  width: 100%;
  height: 150px;
}

.text {
  text-align: center;
}

.app {
  cursor: pointer;
}
</style>
