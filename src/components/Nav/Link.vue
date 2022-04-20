
<template>
  <!-- eslint-disable vue/require-component-is -->
  <!-- <component v-bind="linkProps(to)">
    <slot />
  </component> -->
  <router-link :to="to" >
    <slot />
  </router-link>
</template>
<script lang="ts" >
import { defineComponent, h } from 'vue'
export default defineComponent({
  name: 'AppLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  methods: {
    linkProps(url:string) {
      // if (isExternal(url)) {
      //   return {
      //     is: 'a',
      //     href: url,
      //     target: '_blank',
      //     rel: 'noopener'
      //   }
      // }
      return {
        is: 'router-link',
        to: url
      }
    }
  }
})
</script>