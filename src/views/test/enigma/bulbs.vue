<template>
  <div>
    <div class="bulbs">
      <ul class="row row-1">
        <li class="pinky bulb" id="BulbQ">Q</li>
        <li class="ring bulb" id="BulbW">W</li>
        <li class="middle bulb" id="BulbE">E</li>
        <li class="pointer1st bulb" id="BulbR">R</li>
        <li class="pointer2nd bulb" id="BulbT">T</li>
        <li class="pointer2nd bulb" id="BulbY">Y</li>
        <li class="pointer1st bulb" id="BulbU">U</li>
        <li class="middle bulb" id="BulbI">I</li>
        <li class="ring bulb" id="BulbO">O</li>
        <li class="pinky bulb" id="BulbP">P</li>
      </ul>
      <ul class="row row-2">
        <li class="pinky bulb" id="BulbA">A</li>
        <li class="ring bulb" id="BulbS">S</li>
        <li class="middle bulb" id="BulbD">D</li>
        <li class="pointer1st bulb" id="BulbF">F</li>
        <li class="pointer2nd bulb" id="BulbG">G</li>
        <li class="pointer2nd bulb" id="BulbH">H</li>
        <li class="pointer1st bulb" id="BulbJ">J</li>
        <li class="middle bulb" id="BulbK">K</li>
        <li class="ring bulb" id="BulbL">L</li>
      </ul>
      <ul class="row row-3">
        <li class="pinky bulb" id="BulbZ">Z</li>
        <li class="ring bulb" id="BulbX">X</li>
        <li class="middle bulb" id="BulbC">C</li>
        <li class="pointer1st bulb" id="BulbV">V</li>
        <li class="pointer2nd bulb" id="BulbB">B</li>
        <li class="pointer2nd bulb" id="BulbN">N</li>
        <li class="pointer1st bulb" id="BulbM">M</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts" setup>import { watch } from 'vue';

let props = withDefaults(defineProps<{
  lightChar: string,
}>(), {
  lightChar: 'Q',
})

watch(
  () => props.lightChar,
  (newValue: string, oldValue: string) => {
    console.log(`light changed  ${oldValue} to ${newValue} !`)
    const key = newValue || oldValue
    if (newValue === "") {
      // removeClass
      const keyElement = document.getElementById("Bulb" + key);
      if (!keyElement) {
        return
      }
      keyElement.classList.remove("selected");

    } else {
      // addClass
      const keyElement = document.getElementById("Bulb" + key);
      if (!keyElement) {
        return
      }
      keyElement.classList.add("selected");
    }
  }
)

</script>
<style  lang="less" scope>
.bulbs {
  display: flex;
  flex-direction: column;

  .row {
    list-style: none;
    display: flex;
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    height: 1.5em;
    width: 1.5em;
    color: rgba(0, 0, 0, 0.7);
    border-radius: 1em;
    border: 2px solid white;
    margin: 0.05em;
    margin-left: 1.3em;
    // margin-right: 0.7em;
    line-height: 1.4em;
    letter-spacing: 1px;
    transition: 0.3s;
    text-align: center;
    font-size: 1em;
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