<template>
  <el-menu
    :default-active="defaultActive"
    class="el-menu-vertical-demo"
    @select="selectMenuItem"
    mode="horizontal"
    background-color="#333744"
    text-color="#fff"
    active-text-color="#409EFF"
  >
    <template v-for="route in routes" :key="route">
      <!-- <el-menu-item v-if="!route.meta?.hidden" :index="route.path">
        <template #title>{{route.name}}</template>
      </el-menu-item> -->
      <Nav-item v-if="!route.meta?.hidden" :index="route.path" :item="route"></Nav-item>
    </template>
  </el-menu>
</template>
<script lang="ts" >
import { computed,defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { routes as asyncRoutes } from '@/router'
import NavItem from './nav-item.vue'

export default defineComponent({
  name: 'Layout',
  components: {
    NavItem,
  },
  setup(props, ctx) {
    const route = useRoute()
    const router = useRouter()
    const routes = asyncRoutes
    const defaultActive = computed(() => route.name?.toString())
    const selectMenuItem = (mtype: string) => {
      console.log("selectMenuItem", mtype)
      // router.push({
      //   name: mtype
      // })
    }
    return {
      routes,
      defaultActive,
      selectMenuItem,
    }
  }
})

 
</script>
<style lang="less" scoped>

.header {
  // font-size: 20px;
  font-size: calc(12px + 1vmin);
  // font-family: Arial, Helvetica, sans-serif;
}

.el-menu {
  // background-color: #333744;
  width: 80%;
  background-color: #333744;
  display: flex;
  justify-self: flex-end;
  margin: 0;
  padding: 0;
  padding-left: 20px;
  border: 0;
  font-size: 20px;

  .toggle-button {
    background-color: #4a5064;

    line-height: 25px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.1em;
    cursor: pointer;
  }
}

.el-menu-item {
  font-size: 18px;
}

.el-header {
  background-color: #333744;
  display: flex;
  justify-content: space-between;
  padding: 0px 20px;
  align-items: center;
  color: #fff;

  .logo {
    color: #fff;
    background-color: #333744;
    text-decoration: none;
    font-size: 24px;
  }
}

.el-main {
  background-color: #fff;
  padding: 0px;
  // font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);
}

.el-footer {
  background-color: white;
}

:deep(.el-menu--popup-bottom-start) .popper  {
  margin-top: 0px;
}
:deep( .el-menu--collapse) .el-menu .el-submenu,
:deep(.el-menu--popup) {
  min-width: 100px;
}
</style>