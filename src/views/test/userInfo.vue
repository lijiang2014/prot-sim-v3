<template>
  <h1>UserInfo </h1>
  <hr />
  {{ store.state }}
  <hr />
  <code>{{ userInfo }} </code>
  <button @click="handleClick"> Update</button>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useStore } from '@/store';
import { getUserInfo } from '@/api/api';
import { UserInfo } from '@/app-model';
const store = useStore()
const userInfo = ref<UserInfo>()
const handleClick = async () => {
  let ret = await getUserInfo()
  if (!ret.spec) {
    return
  }
  userInfo.value = ret.spec
}
</script>