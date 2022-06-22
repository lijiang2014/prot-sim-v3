<template>
  <div class="container">
    <div class="main">
      <div class="cycle-box" @dragover="dragover($event)">
        <div class="delete-box" @dragenter="dragenter(-1, $event)">
          <el-icon>
            <Delete />
          </el-icon>
        </div>
        <div v-for="(item, index) in state.cycles" :draggable="true" @dragstart="dragstart(index)"
          @dragenter="dragenter(index, $event)" @dragend="dragend(index, $event)" @dragover="dragover($event)">
          <cycle-pan v-model="state.cycles[index]"></cycle-pan>
        </div>
        <div class="reflect-box"> reflect</div>
      </div>
      <div class="bulbs">
        <bulbs-view :lightChar="outChar"></bulbs-view>
      </div>
      <div class="keyboard">
        <keyboard-view @pressDownKey="keyDownHandler" @pressUpKey="keyUpHandler"></keyboard-view>
      </div>
      <div class="switcher">
        <!-- 接线板 -->
        <!-- <switcher-view v-module="state.switcher"></switcher-view> -->
        <switcher-view v-model="state.switcher"></switcher-view>
      </div>
    </div>
    <div class="side">
      <div class="part msg">
        控制台
        <hr />
        <el-checkbox v-model="state.controls.twirling" label="twirling" size="large" />
        <el-tooltip class="box-item" effect="dark" content="Generate A New Runner" placement="top-start">
          <el-button @click="newCycle" size="small" circle>F1</el-button>
        </el-tooltip>
        <el-tooltip class="box-item" effect="dark" content="turn All Runner to AAA" placement="top-start">
          <el-button @click="setCycleAAA" size="small" circle>F2</el-button>
        </el-tooltip>

        {{ infoMsg }}

        {{ errMsg }}
      </div>
      <div class="part msg">
        INPUT : {{ inChar }} <br>
        {{ inMsg }}
      </div>
      <div class="part msg">
        OUTPUT : {{ outChar }} <br>
        {{ outMsg }}
      </div>
    </div>
  </div>


</template>
<script lang="ts" setup>
import KeyboardView from './keyboard.vue'
import BulbsView from './bulbs.vue'
import SwitcherView from './switcher.vue'
import CyclePan from './cyclepan.vue'
import { reactive, ref } from 'vue';
import type { KeyPair, KeyChars, linePairs } from './types'
const orginChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const inMsg = ref('')
const outMsg = ref('')
const errMsg = ref('')
const infoMsg = ref('')
const inChar = ref('')
const outChar = ref('')
const simpleCycle = (lineStr = 'EFGHIJKLMNOPQRSTUVWXYZABCD'): KeyChars[] => {
  let r: KeyChars[] = []
  for (let c of lineStr) {
    r.push(c as KeyChars)
  }
  return r
}
const simpleReflects = (lineStr = orginChars): KeyPair[] => {
  let r: KeyPair[] = []
  for (let index = 0; index < lineStr.length; index = index + 2) {
    let a = lineStr[index] as KeyChars
    let b = lineStr[index + 1] as KeyChars
    r.push([b, a])
  }
  return r
}
const state = reactive<{
  switcher: KeyPair[],
  reflector: KeyPair[],
  cycles: { settings: linePairs, offset: number }[],
  controls: {
    twirling: boolean,
  }
}>({
  switcher: [["A", "X"]],
  reflector: simpleReflects(),
  cycles: [
    { settings: simpleCycle(), offset: 20 },
    { settings: simpleCycle(), offset: 1 },
    { settings: simpleCycle(), offset: 15 },
  ],
  controls: {
    twirling: true,
  }
})

const encodeChar = (c: KeyChars): KeyChars => {
  let c0 = switchChar(c, state.switcher)
  console.log('After swither', c0)
  for (let ci of state.cycles) {
    c0 = cycleR2L(c0, ci.settings, ci.offset)
    console.log('After cycle', c0)
  }
  let cf = reflectChar(c0, state.reflector)
  console.log('After reflector', cf)

  for (let ci of state.cycles) {
    cf = cycleL2R(cf, ci.settings, ci.offset)
    console.log('After reflector', cf)
  }
  // let cf1 = cycleL2R(cf, [], 0) // C1
  return cf
}
const switchChar = (c: KeyChars, settings: KeyPair[]): KeyChars => {
  for (let pairi of settings) {
    if (c === pairi[0]) return pairi[1]
    if (c === pairi[1]) return pairi[0]
  }
  return c
}
const cycleR2L = (c: KeyChars, settings: linePairs, offset: number): KeyChars => {
  // String.fromCharCode(65) -> A
  if (settings.length === 0) return c
  const A0 = 'A'.charCodeAt(0)
  let index = (c.charCodeAt(0) - A0 + offset) % settings.length
  return settings[index]
}
const cycleL2R = (c: KeyChars, settings: linePairs, offset: number): KeyChars => {
  let mapper: { [key: string]: KeyChars } = {}
  for (let i of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
    let iout = cycleR2L(i as KeyChars, settings, offset)
    mapper[iout] = i as KeyChars
  }
  return mapper[c]
}
const reflectChar = (c: KeyChars, settings: KeyPair[]): KeyChars => {
  if (settings.length === 0) return c
  for (let pairi of settings) {
    if (c === pairi[0]) return pairi[1]
    if (c === pairi[1]) return pairi[0]
  }
  errMsg.value += `not available  reflect setting! ${settings}`
  return c
}
const twirling = () => {
  for (let i = 0; i < state.cycles.length; i++) {
    let newOffset = state.cycles[i].offset + 1
    if (newOffset >= state.cycles[i].settings.length) {
      newOffset = newOffset % state.cycles[i].settings.length
      state.cycles[i].offset = newOffset
      continue
    }
    state.cycles[i].offset = newOffset
    break
  }
}


const keyDownHandler = (key: string) => {
  inChar.value = key
  console.log("got msg", key)
  // 使用 TS 类型检查函数
  const outKey = encodeChar(key as KeyChars)
  if (!outKey) {
    errMsg.value = `no output created! ${key} ${outKey}`
  }
  outChar.value = outKey
}
const keyUpHandler = (key: string) => {
  if (inChar.value !== key) {
    errMsg.value = `up key is not down key : ${inChar.value} !== ${key}`
  }
  inMsg.value += key
  outMsg.value += outChar.value
  inChar.value = ''
  outChar.value = ''
  if (state.controls.twirling) {
    twirling()
  }
}
const newCycle = () => {
  let lineLeft: linePairs = []
  let lineRandom: linePairs = []
  for (let i = 0; i < orginChars.length; i++) {
    lineLeft.push(orginChars.charAt(i) as KeyChars)
  }
  while (lineLeft.length) {
    let randomIndex = Math.floor(Math.random() * lineLeft.length)
    lineRandom.push(lineLeft[randomIndex])
    lineLeft.splice(randomIndex, 1)
  }
  state.cycles.push({ settings: lineRandom, offset: 0 })
}

const setCycleAAA = () => {
  state.cycles.forEach((item, index) => {
    state.cycles[index].offset = 0
  })
}

/* 转盘拖拽排序 */
let dragIndex: number | undefined = undefined
let dragIndex2: number | undefined = undefined
const dragstart = (index: number) => {
  dragIndex = index
}
const dragenter = (index: number, e: DragEvent) => {
  dragIndex2 = index
  e.preventDefault()
}
const dragover = (e: DragEvent) => {
  e.preventDefault()
}
const dragend = (index: number, e: DragEvent) => {
  if (typeof dragIndex === 'undefined' || typeof dragIndex2 === 'undefined') {
    return
  }
  if (dragIndex !== dragIndex2 && dragIndex >= 0) {
    if (dragIndex2 < 0) {
      // delete
      state.cycles.splice(dragIndex, 1)
      infoMsg.value = "Delete one cycleDisc...."
      return
    }
    let newCycles = [...state.cycles]
    let tmpCycle = newCycles.splice(dragIndex, 1)
    newCycles.splice(dragIndex2, 0, tmpCycle[0])
    state.cycles = newCycles
  }
}
</script>
<style  lang="less" scope>
.container {
  width: 100%;
  height: 100%;
  background-color: aqua;
  display: flex;

  .main {
    padding: 10px;
    width: 80%;
    background-color: blanchedalmond;

    .part {
      background-color: white;
      min-height: 100px;
      margin: 10px;
    }

    .cycle-box {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;

      .reflect-box,
      .delete-box {
        border: 2px solid white;
        height: 8em;
        width: 2em;
        writing-mode: vertical-lr;
        border-radius: 1em;
        text-align: center;
        background: gray;
        color: white;
        line-height: 2em;

      }

      .delete-box {
        width: 5em;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .keyboard,
    .bulbs {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .keyboard {
      background-color: black;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-weight: 500;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // height: 100vh;
    }

    .bulbs,
    .switcher {
      // background-color: bisque;
      display: flex;
      flex-direction: column;
      font-weight: 100;
      justify-content: center;
    }
  }

  .side {
    width: 20%;
    background-color: aquamarine;

    .part {
      background-color: black;
      color: aliceblue;
      min-height: 200px;
      margin: 10px;
    }

    .msg {
      line-break: anywhere;
      overflow: scroll;
    }
  }

}
</style>