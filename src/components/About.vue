<template>
  <h1>About {{ store.state.count }} , init {{count}}</h1>
  <button @click="handleClick" >  Add</button>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useStore } from '@/store';
const store = useStore()
const count = ref(store.state.count)
const handleClick = () => {
  store.commit("increment")
  console.log(store.state.count)
}
</script>