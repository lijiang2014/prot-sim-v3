<template>
  <h1>Page Cannot Found</h1>
  <button @click="handleClick" >Return HOME</button>
</template>
<script lang="ts" setup>
const handleClick = () => {
  window.location.href = '/'
}
</script>