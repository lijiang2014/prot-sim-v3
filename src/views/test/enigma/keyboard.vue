<template>
  <div>
    <!-- <h1 class="title">Eyes on the screen</h1> -->
    <div class="keyboard">
      <!-- <ul class="row row-0">
        <li class="pinky" id="esc">ESC</li>
        <li class="pinky" id="1">1</li>
        <li class="ring" id="2">2</li>
        <li class="middle" id="3">3</li>
        <li class="pointer1st" id="4">4</li>
        <li class="pointer2nd" id="5">5</li>
        <li class="pointer2nd" id="6">6</li>
        <li class="pointer1st" id="7">7</li>
        <li class="middle" id="8">8</li>
        <li class="ring" id="9">9</li>
        <li class="pinky" id="10">0</li>
        <li class="pinky">-</li>
        <li class="pinky">+</li>
        <li class="pinky" id="back">BACK</li>
      </ul> -->
      <ul class="row row-1">
        <!-- <li class="pinky" id="tab">TAB</li> -->
        <li class="pinky key" id="KeyQ" @mousedown="handleMouseDown('Q')" @mouseup="handleMouseUp('Q')">Q
        </li>
        <!-- <li class="pinky key" id="KeyQ" ref="KeyQ" @mousedown="handleMouseDown('Q')" @mouseup="handleMouseUp('Q')">Q
        </li> -->
        <li class="ring key" id="KeyW">W</li>
        <li class="middle key" id="KeyE">E</li>
        <li class="pointer1st key" id="KeyR">R</li>
        <li class="pointer2nd key" id="KeyT">T</li>
        <li class="pointer2nd key" id="KeyY">Y</li>
        <li class="pointer1st key" id="KeyU">U</li>
        <li class="middle key" id="KeyI">I</li>
        <li class="ring key" id="KeyO">O</li>
        <li class="pinky key" id="KeyP">P</li>
        <!-- <li class="pinky">[</li>
        <li class="pinky">]</li>
        <li class="pinky">\</li> -->
      </ul>
      <ul class="row row-2">
        <!-- <li class="pinky" id="caps">CAPS</li> -->
        <li class="pinky key" id="KeyA">A</li>
        <li class="ring key" id="KeyS">S</li>
        <li class="middle key" id="KeyD">D</li>
        <li class="pointer1st key" id="KeyF">F</li>
        <li class="pointer2nd key" id="KeyG">G</li>
        <li class="pointer2nd key" id="KeyH">H</li>
        <li class="pointer1st key" id="KeyJ">J</li>
        <li class="middle key" id="KeyK">K</li>
        <li class="ring key" id="KeyL">L</li>
        <!-- <li class="pinky">:</li>
        <li class="pinky">''</li>
        <li class="pinky" id="enter">ENTER</li> -->
      </ul>
      <ul class="row row-3">
        <!-- <li class="pinky" id="left-shift">SHIFT</li> -->
        <li class="pinky key" id="KeyZ">Z</li>
        <li class="ring key" id="KeyX">X</li>
        <li class="middle key" id="KeyC">C</li>
        <li class="pointer1st key" id="KeyV">V</li>
        <li class="pointer2nd key" id="KeyB">B</li>
        <li class="pointer2nd key" id="KeyN">N</li>
        <li class="pointer1st key" id="KeyM">M</li>
        <!-- <li class="middle">,</li>
        <li class="ring">.</li>
        <li class="pinky">;</li>
        <li class="pinky" id="right-shift">SHIFT</li> -->
      </ul>
    </div>
    <!-- <h1 class="title">Hands on the keyboard</h1> -->
  </div>
</template>
<script lang="ts" setup>import { ref } from 'vue';
import { KeyChars } from './types';
// const KeyQ = ref(null)
const emit = defineEmits(["pressDownKey", "pressUpKey"]);

const keyDownHandler = (event: KeyboardEvent) => {
  const keyPressed = String.fromCharCode(event.keyCode);
  const keyElement = document.getElementById("Key" + keyPressed);
  // const keyElement = ref("Key" + keyPressed)
  const highlightedKey = document.querySelector(".selected.key");
  // console.log("press", keyPressed, keyElement.value, highlightedKey)

  if (!keyElement) {
    return
  }
  const key = document.getElementById("Key" + keyPressed);
  if (!key) {
    return
  }
  if (highlightedKey) {
    return
  }
  console.log("press", keyPressed, highlightedKey)
  key.classList.add("selected");
  emit("pressDownKey", keyPressed)

  if (!keyElement || !highlightedKey) {
    return
  }
  return
}


const keyUpHandler = (event: KeyboardEvent) => {
  const keyPressed = String.fromCharCode(event.keyCode);
  const keyElement = document.getElementById("Key" + keyPressed);
  const highlightedKey = document.querySelector(".selected.key");
  if (!keyElement) {
    return
  }
  console.log("pressed", keyPressed, highlightedKey)
  if (!keyElement || !highlightedKey) {
    console.log("No keyElement orhighlightedKey ", keyElement, highlightedKey)
    return
  }
  keyElement.classList.add("hit")
  keyElement.addEventListener('animationend', () => {
    keyElement.classList.remove("hit")
  })
  console.log("match", keyPressed, highlightedKey)
  if (keyPressed === highlightedKey.innerHTML.trim()) {
    // timestamps.unshift(getTimestamp());
    // const elapsedTime = timestamps[0] - timestamps[1];
    // console.log(`Character per minute ${60 / elapsedTime}`)
    highlightedKey.classList.remove("selected");
    emit("pressUpKey", keyPressed)
    // targetRandomKey();
  }
}

const createKeyEvent = (key: KeyChars, evtType: string) => {
  let code = key.charCodeAt(0)
  const KeyboardEventInit = {
    key: key, code: key, location: 0, repeat: false,
    isComposing: false, bubbles: true, composed: true, charCode: code, keyCode: code
  }
  return new KeyboardEvent(evtType, KeyboardEventInit)
}

const handleMouseDown = (key: KeyChars) => {
  keyDownHandler(createKeyEvent(key, "mousedown"))
}

const handleMouseUp = (key: KeyChars) => {
  console.log('clicked key up ', key)
  keyUpHandler(createKeyEvent(key, "mouseup"))
}

document.addEventListener("keydown", keyDownHandler)
document.addEventListener("keyup", keyUpHandler)

</script>
<style  lang="less" scope>
// body {
//   background-color: black;
//   font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
//   font-weight: 500;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   height: 100vh;
// }

.keyboard {

  // .keyboard {
  display: flex;
  flex-direction: column;
  // }

  .row {
    list-style: none;
    display: flex;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    height: 3em;
    width: 3em;
    color: rgba(0, 0, 0, 0.7);
    border-radius: 0.4em;
    line-height: 3em;
    letter-spacing: 1px;
    margin: 0.2em;
    transition: 0.3s;
    text-align: center;
    font-size: 1em;
  }

  #tab {
    width: 5em;
  }

  #caps {
    width: 6em;
  }

  #left-shift {
    width: 8em;
  }

  #enter {
    width: 6em;
  }

  #right-shift {
    width: 8em;
  }

  #back {
    width: 5em;
  }

  .pinky {
    background-color: crimson;
    border: 2px solid crimson;
  }

  .pinky.selected {
    color: crimson;
  }

  .ring {
    background-color: coral;
    border: 2px solid coral;
  }

  .ring.selected {
    color: coral;
  }

  .middle {
    background-color: darkorange;
    border: 2px solid darkorange;
  }

  .middle.selected {
    color: darkorange;
  }

  .pointer1st {
    background-color: gold;
    border: 2px solid gold;
  }

  .pointer1st.selected {
    color: gold;
  }

  .pointer2nd {
    background-color: khaki;
    border: 2px solid khaki;
  }

  .pointer2nd.selected {
    color: khaki;
  }

  .fill-out-key {
    background-color: slategrey;
    border: 2px solid slategrey;
  }

  .selected {
    background-color: transparent;
    -webkit-animation: vibrate-1 0.3s linear infinite both;
    animation: vibrate-1 0.3s linear infinite both;
  }

  /* ----------------------------------------------
 * Generated by Animista
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

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