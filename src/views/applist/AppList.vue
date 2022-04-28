<template>
  <div>
    <list-head :title="title" @btnClick="btnClick"></list-head>
    <div class="box">
      <div class="app-list" :style="`transform:translateX(-${transform * (24 + 1.3)}%)`">
        <template v-for="item in appList" :key="item.name">
          <div class="contain">
            <el-card class="card">
              <div class="app" @click="appClick(item.path)">
                <el-image :src="imgUrl + item.icon" fit="scale-down" class="img" />
                <div class="text">
                  <div>{{ item.name }}</div>
                  <el-button type="primary">使用</el-button>
                </div>
              </div>
            </el-card>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "@vue/reactivity";
import { computed, onMounted, watch, watchEffect } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import listHead from "./ListHead.vue";
let router = useRouter()
type list = {
  name: string;
  title: string;
  icon: string;
  type: string;
  path: string;
};
let props = defineProps<{ title: string; appList: list[] }>();
let imgUrl = "https://starlight.nscc-gz.cn/api/mei/acorn/";
let transform = ref(0);
let btnClick = (num: number) => {
  let n = 0;
  for (let item of props.appList) {
    if (item.title == props.title) {
      n++;
    }
  }
  if (transform.value + num >= n - 3) return;
  if (transform.value + num >= 0) {
    transform.value += num;
  }
};
let appClick = (path: string) => {
  router.push(path)
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
  height: 400px;
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
