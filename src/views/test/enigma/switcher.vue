<template>
  <div>
    <div class="pins">
      <ul class="row row-1">
        <li class="pin" v-for="item in row1" ref="pin" @click="handleClick(item)">{{ item }}</li>
      </ul>
      <ul class="row row-2">
        <li class="pin" v-for="item in row2" ref="pin" @click="handleClick(item)">{{ item }}</li>
      </ul>
      <ul class="row row-3">
        <li class="pin" v-for="item in row3" ref="pin" @click="handleClick(item)">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { indexOf } from 'lodash';
import { pairwise } from 'rxjs';
import { onMounted, ref, watch } from 'vue'
import type { KeyPair, KeyChars, linePairs } from './types'
const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
const row3 = ["Z", "X", "C", "V", "B", "N", "M"]

interface Props {
  modelValue: KeyPair[]
}

let props = defineProps<Props>()

const emit = defineEmits(["update:modelValue"])

const pin = ref()
const colorClasses = ["red", "blue", "orange", "aqua", "cadetblue", "chartreuse", "gold", "slateblue",]
let clickedPins = ref<KeyChars>()
const handleClick = (target: string) => {
  let targetChar = target as KeyChars
  let pairIndex = props.modelValue.findIndex((pairI, index) => {
    if (pairI[0] === targetChar || pairI[1] === targetChar) {
      return true
    }
    return false
  })
  if (pairIndex !== -1) {
    // remove pairs
    let newPair = [...props.modelValue]
    newPair.splice(pairIndex, 1)
    emit('update:modelValue', newPair)
    return
  }
  if (clickedPins.value === targetChar) {
    // remove 
    clickedPins.value = undefined
    // set html class
    for (let item of pin.value) {
      let itemPin = item as HTMLElement
      if (itemPin.innerHTML.trim() === targetChar) {
        itemPin.classList.remove("selected")
        return
      }
    }
    return
  } else if (clickedPins.value === undefined) {
    // no lines 
    if (props.modelValue.length === colorClasses.length) {
      alert("No enough lines to set swither!")
      return
    }
    // set one
    clickedPins.value = targetChar
    // set html class
    for (let item of pin.value) {
      let itemPin = item as HTMLElement
      if (itemPin.innerHTML.trim() === targetChar) {
        itemPin.classList.add("selected")
        return
      }
    }
    return
  }
  // new pair
  let newPair = [...props.modelValue]
  newPair.push([clickedPins.value, targetChar])
  emit('update:modelValue', newPair)
  clickedPins.value = undefined
  return

}

const drawPinColors = () => {
  for (let item of pin.value) {
    let itemPin = item as HTMLElement
    if (itemPin.classList.length > 1) {
      itemPin.classList.remove(itemPin.classList[1])
    }
  }
  const mapper: { [key: string]: number } = {}
  props.modelValue.forEach((item, index) => {
    mapper[item[0]] = index
    mapper[item[1]] = index
  })
  for (let item of pin.value) {
    // item.update()
    // console.log(item)
    let itemPin = item as HTMLElement
    let index = mapper[itemPin.innerHTML.trim()]
    // console.log(itemPin.innerHTML, index)
    if (typeof index === "undefined") {
      continue
    }
    if (index < colorClasses.length) {
      itemPin.classList.add(colorClasses[index])
    } else {
      alert("No enough switch lines!")
    }
    // itemPin.classList.add("red")
  }
}

watch(
  () => props.modelValue,
  (newValue: KeyPair[], oldValue: KeyPair[]) => {
    console.log("props changed", newValue)
    drawPinColors()
  }
)

onMounted(() => {
  drawPinColors()
})

</script>
<style  lang="less" scope>
.pins {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .row {
    list-style: none;
    display: flex;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    height: 1em;
    width: 1em;
    color: rgba(0, 0, 0, 0.7);
    border-radius: 1em;
    border: 2px solid white;
    margin: 0.05em;
    margin-left: 1.3em;
    margin-bottom: 1.3em;
    // margin-right: 0.7em;
    line-height: 3.3em;
    letter-spacing: 1px;
    transition: 0.3s;
    text-align: center;
    font-size: 1em;
  }

  .pin {
    background-color: gray;
  }

  .pointer1st {
    background-color: gold;
    border: 2px solid gold;
  }

  .pointer2nd {
    background-color: khaki;
    border: 2px solid khaki;
  }

  .red {
    background-color: red;
  }

  .blue {
    background-color: blue;
  }

  .orange {
    background-color: orange;
  }

  .aqua {
    background-color: aqua;
  }

  .cadetblue {
    background-color: cadetblue;
  }

  .chartreuse {
    background-color: chartreuse;
  }

  .gold {
    background-color: gold;
  }

  .slateblue {
    background-color: slateblue;
  }


  .selected {
    // background-color: transparent;
    -webkit-animation: vibrate-1 0.3s linear infinite both;
    animation: vibrate-1 0.3s linear infinite both;
    color: red;
    background-color: azure;
  }

  .hit {
    -webkit-animation: hit 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
    animation: hit 0.3s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
  }

  @-webkit-keyframes hit {
    0% {
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }

    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  @keyframes hit {
    0% {
      -webkit-transform: scale(1.2);
      transform: scale(1.2);
    }

    100% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }

  @-webkit-keyframes vibrate-1 {
    0% {
      -webkit-transform: translate(0);
      transform: translate(0);
    }

    20% {
      -webkit-transform: translate(-2px, 2px);
      transform: translate(-2px, 2px);
    }

    40% {
      -webkit-transform: translate(-2px, -2px);
      transform: translate(-2px, -2px);
    }

    60% {
      -webkit-transform: translate(2px, 2px);
      transform: translate(2px, 2px);
    }

    80% {
      -webkit-transform: translate(2px, -2px);
      transform: translate(2px, -2px);
    }

    100% {
      -webkit-transform: translate(0);
      transform: translate(0);
    }
  }

  @keyframes vibrate-1 {
    0% {
      -webkit-transform: translate(0);
      transform: translate(0);
    }

    20% {
      -webkit-transform: translate(-2px, 2px);
      transform: translate(-2px, 2px);
    }

    40% {
      -webkit-transform: translate(-2px, -2px);
      transform: translate(-2px, -2px);
    }

    60% {
      -webkit-transform: translate(2px, 2px);
      transform: translate(2px, 2px);
    }

    80% {
      -webkit-transform: translate(2px, -2px);
      transform: translate(2px, -2px);
    }

    100% {
      -webkit-transform: translate(0);
      transform: translate(0);
    }
  }

}
</style>