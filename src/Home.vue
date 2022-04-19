<script  lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const $route = useRoute()
const $router = useRouter()

const menuList = ref([
        {
          //结构预测，// 一级菜单
          id: 10,
          name: 'Structure Prediction',
          path: 'predict/structure/',
          children: [
            {
              // 二级菜单
              id: 11,
              name: 'Sumbit',
              path: 'predict/structure/',
              children: [],
              order: null,
            },
            {
              id: 12,
              name: 'Queue',
              path: 'predict/structure/queue/',
              children: [],
              order: null,
            },
            {
              id: 13,
              name: 'Example',
              path: 'predict/structure/result',
              children: [],
              order: null,
            },
          ],
          order: 1,
        },
        {
          //结构相似，// 一级菜单
          id: 20,
          name: 'Structure Similarly',
          path: 'structure_similarity/',
          children: [
            // 二级菜单
            {
              id: 21,
              name: 'Submit',
              path: 'structure_similarity/submit',
              children: [],
              order: 1,
            },
            {
              id: 22,
              name: 'DUF-SPalignNS',
              path: 'structure_similarity/DUF',
              children: [],
              order: null,
            },
          ],
          order: 3,
        },
        // 序列相似
        {
          name: 'BLAST',
          path: '/sequence/blast',
          children: [
            // 二级菜单
            {
              id: 21,
              name: 'Submit',
              path: 'sequence/blast',

              order: 1,
            },
            {
              id: 32,
              name: 'Queue',
              path: 'sequence/blast/queue',

              order: 1,
            },
            {
              id: 33,
              name: 'Conserved Domains',
              path: 'sequence/blast/cdd_submit',

              order: 1,
            },
            {
              id: 34,
              name: 'Conserved Domains(Queue)',
              path: 'sequence/blast/cdd_searchSave',

              order: 1,
            },
          ],
        },

        {
          //test，// 一级菜单
          id: 30,
          name: 'Test',
          path: 'test/',
          children: [
            // 二级菜单
            {
              id: 31,
              name: 'svg-msa',
              path: 'test/svg-msa',
              children: [],
              order: 1,
            },
            {
              id: 32,
              name: 'pdbeMolstar',
              path: 'test/pdbe-molstar',
              children: [],
              order: 1,
            },
            {
              id: 33,
              name: 'phylotree',
              path: 'test/phylotree',
              children: [],
            },
          ],
          order: 2,
        },
      ])
const iconObj = ref({
        10: 'el-icon-s-opportunity',
        11: 'el-icon-edit',
        12: 'el-icon-s-goods',
        13: 'el-icon-present',

        20: 'el-icon-s-opportunity',
        21: 'el-icon-edit',
        22: 'el-icon-edit',

        125: 'el-icon-user-solid',
        103: 'el-icon-s-goods',
        101: 'el-icon-s-opportunity',
        102: 'el-icon-present',
        145: 'el-icon-orange',
      })
const isCollapsed = ref(false)
const activePath = ref('/welcome')

activePath.value = $route.path

const logout = () => {
  window.sessionStorage.clear()
  $router.push('/login')
}

const saveNavState = (navpath: string) => {
  activePath.value = navpath
  window.sessionStorage.setItem('activePath', navpath)
}
</script>

<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header class="header">
      <router-link to="/home" class="logo">
        <span> .logo. </span>
        <span>蛋白质设计</span>
      </router-link>
      <!-- <bugReport-button></bugReport-button> -->
      <el-menu
        unique-opened
        :collapse="isCollapsed"
        :collapse-transition="false"
        :router="true"
        :default-active="activePath"
        background-color="#333744"
        text-color="#fff"
        active-text-color="#409EFF"
        mode="horizontal"
        popper-class="popper"
      >
        <el-menu-item index="/welcome">
          <template #title>
            <span class="header">Home</span>
          </template>
        </el-menu-item>
        <el-sub-menu
          :index="item.path + ''"
          v-for="item in menuList"
        >
          <!-- 一级菜单模板区域 -->
          <template #title>
            <!-- 文本 -->
            <span class="header">{{ item.name }}</span>
          </template>

          <!-- 二级菜单 -->
          <el-menu-item
            :index="'/' + subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            @click="saveNavState('/' + subItem.path)"
          >
          <el-icon><opportunity /></el-icon>
              <!-- <el-icon >  </el-icon> -->
              <span>{{ subItem.name }}</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- about -->
        <el-menu-item index="/queue">
          <template #title>
            <!-- 文本 -->
            <span class="header">Queue</span>
          </template>
        </el-menu-item>
        <!-- about -->
        <el-menu-item index="/about">
          <template #title>
            <!-- 文本 -->
            <span class="header">About</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/help">
          <template #title>
            <!-- 文本 -->
            <span class="header">Help</span>
          </template>
        </el-menu-item>
      </el-menu>

      <el-button class="header" type="text" @click="logout">Logout</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->

      <el-container style="padding-bottom: 20px">
        <!-- 右侧内容区 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>

        <!-- 注脚 -->
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
  </el-container>

</template>

<style lang="less" scoped>
.home-container {
  height: 100%;
  font-size: calc(11px + 1vmin);
}
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
</style>

<style lang="less">
/deep/ .el-menu--popup-bottom-start .popper {
  margin-top: 0px;
}
/deep/ .el-menu--collapse .el-menu .el-submenu,
.el-menu--popup {
  min-width: 100px;
}
</style>

