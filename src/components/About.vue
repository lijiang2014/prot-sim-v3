<template>
  <h1>About {{ store.state.count }}</h1>
  <button @click="handleClick" >  Add</button>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
const store = useStore(key)
const state = store.state
const count = ref(0)
count.value = store.state.count
const handleClick = () => {
  store.commit("increment")
  console.log(store.state.count)
}
</script>