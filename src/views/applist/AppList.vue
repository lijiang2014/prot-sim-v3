<template>
  <div>
    <List-head :title="title" @btnClick="btnClick"></List-head>
    <div class="box">
      <div
        class="app-list"
        :style="`transform:translateX(-${transform * 34.1}%)`"
      >
        <template v-for="(i, n) in 7" :key="n">
          <div class="contain">
            <el-card :body-style="{ padding: '20px' }">
              <img
                src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                class="image"
              />
              <div style="padding: 14px">
                <span>好吃的汉堡{{ i }}</span>
                <div class="bottom clearfix">
                  <time class="time">{{ "2121" }}</time>
                  <el-button type="text" class="button">操作按钮</el-button>
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
import ListHead from "./ListHead.vue";
defineProps<{title:string}>()
let transform = ref(0);
let btnClick = (num) => {
  if (transform.value >= 4 && num > 0) return;
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
  width: 31.8%;
  margin-right: 2.3%;
  flex-shrink: 0;
}
</style>
