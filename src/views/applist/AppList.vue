<template>
  <div>
    <List-head :title="title" @btnClick="btnClick"></List-head>
    <div class="box">
      <div
        class="app-list"
        :style="`transform:translateX(-${transform * (24 + 1.3)}%)`"
      >
        <template v-for="item in appList">
          <div class="contain" v-if="item.title == title" :key="item.name">
            <el-card :body-style="{ padding: '20px' }">
              <el-image
                :src="imgUrl + item.icon"
                fit="scale-down"
                class="img"
              />
              <div class="text">
                <div>{{ item.name }}</div>
                <el-button type="primary">使用</el-button>
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
import ListHead from "./ListHead.vue";
let props = defineProps<{ title: string; appList: any }>();
let imgUrl = "https://starlight.nscc-gz.cn/api/mei/acorn/";
let transform = ref(0);
let btnClick = (num:number) => {
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
</style>
