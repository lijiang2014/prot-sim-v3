<template>
  <div class="pan">
    <hr v-for="(item) in [2, 3, 4, 5, 6]" :style="{ 'font-size': item * 0.15 + 'em' }" />
    <div class="offset-box">
      <el-button class="btn btn-up" :icon="ArrowUp" @click="turn(1)" />
      <span class="offset-display">{{ defaultChars.charAt(modelValue.offset) }}</span>
      <el-button class="btn btn-down" :icon="ArrowDown" @click="turn(-1)" />
    </div>
    <hr v-for="(item) in [6, 5, 4, 3, 2]" :style="{ 'font-size': item * 0.15 + 'em' }" />
  </div>
</template>
<script lang="ts" setup>

import {
  ArrowUp, ArrowDown,
} from '@element-plus/icons-vue'
import { onMounted, ref, watch } from 'vue'
import type { KeyPair, KeyChars, linePairs } from './types'
const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
const row3 = ["Z", "X", "C", "V", "B", "N", "M"]
const defaultChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
interface Props {
  modelValue: { settings: linePairs, offset: number }
}

let props = defineProps<Props>()

const emit = defineEmits(["update:modelValue"])

const turn = (t: number) => {
  emit("update:modelValue", { settings: props.modelValue.settings, offset: props.modelValue.offset + t })
}

</script>
<style  lang="less" scope>
.pan {
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  border: 2px solid white;
  height: 8em;
  width: 5em;
  border-radius: 1em;
  text-align: center;
  background: black;
  color: white;
  line-height: 2em;

  .offset-display {
    font: 1em sans-serif;
    display: block;
  }

  .btn {
    display: block;
    clear: both;
    position: fixed;
    margin-left: 1.1em;
    width: 5em;
    background-color: grey;
    color: white;
  }

  .btn-up {
    margin-top: -40px;
  }

  .btn-down {
    margin-top: 10px;
  }

  // .offset-display::before {
  //   content: "+";
  //   height: 0;
  //   display: block;
  //   clear: both;
  //   position: fixed;
  //   /* top: 0em; */
  //   offset: 10px;
  //   // margin-left: 2.2em;
  //   margin-top: -100px;
  //   line-height: 60px;
  //   /*.trangle */
  //   width: 0px;

  //   // height: 5em;
  //   color: black;
  //   font-size: larger;
  //   border: 50px solid rgba(1, 1, 1, 0);
  //   border-top-color: transparent;
  //   border-bottom-color: rgba(197, 200, 18, 0.9);
  //   border-left-color: transparent;
  //   border-right-color: transparent;
  // }

  // .offset-display::after {
  //   content: "-";
  //   height: 0;
  //   display: block;
  //   clear: both;
  //   position: fixed;
  //   /* top: 0em; */
  //   offset: 10px;
  //   margin-left: 2.2em;
  //   margin-top: 0.3em;

  // }

  hr {
    width: 85%;
    overflow: hidden;
  }
}
</style>