<template>
  <div v-if="!hidden" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && ( (onlyOneChild&&!onlyOneChild.children) || noShowingChildren)">
      <app-link v-if="onlyOneChild" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item  v-if="onlyOneChild.meta" :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="icon" :title="generateTitle(onlyOneChild.meta.title as string)" />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <div class="title">
          <item v-if="item.meta" :icon="icon" :title="generateTitle(item.meta?.title as string)" />
        </div>
      </template>
      <nav-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>
<script  lang="ts" >
import path from 'path-browserify'
import { defineComponent, PropType, ref } from 'vue'
import { RouteRecordRaw } from 'vue-router'
import  Item  from './item.vue'
import  AppLink  from './Link.vue'
export default defineComponent({
  name: 'NavItem',
  components: {
    Item,AppLink,
  },
  props: {
    // route object
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    // TODO 处理特殊的 path 
    const isExternal = (routePath:string) => {
      return /^(https?:|mailto:|tel:)/.test(routePath)
    }

    const resolvePath = (routePath: string) => {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return path.resolve(props.basePath, routePath)
    }
    // TODO  处理 多语言支持
    const generateTitle = (title: string) => title
    const onlyOneChild = ref<RouteRecordRaw>()
    const hidden = ref(false)
    const noShowingChildren =  ref(false)
    const icon =  ref('')
    if (props.item.meta?.icon){
      icon.value = props.item.meta?.icon as string
    }
    if (props.item.meta?.hidden){
      hidden.value = true
    }
    const hasOneShowingChild = (children: Array<RouteRecordRaw> | undefined, parent: RouteRecordRaw) => {
      if (!children){
        children = []
      }
      const showingChildren = children.filter(item => {
        if (item.meta?.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          // onlyOneChild.value = item
          return true
        }
      })
      if (showingChildren.length === 1) {
        onlyOneChild.value = showingChildren[0]
        return true
      }
      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ... parent,  }
        noShowingChildren.value = true
        console.log("ooc",onlyOneChild.value)
        return true
      }
      return false
    }
    return {
      hidden,
      resolvePath,hasOneShowingChild,generateTitle,
      onlyOneChild,noShowingChildren,icon,
    }
  }
})


</script>

<style scoped>
.title{
  padding-right: 20px;
}
</style>