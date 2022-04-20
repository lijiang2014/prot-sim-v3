<script  lang="ts" >
import { defineComponent, ref } from 'vue'
import HeadNav from './components/Nav/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { utils } from './utils/utils';

export default defineComponent({
  name: 'Layout',
  components: {
    HeadNav,
  },
  setup(props, ctx) {
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
const isCollapsed = ref(false)
const activePath = ref('/welcome')

activePath.value = $route.path

const logout = () => {
  window.sessionStorage.clear()
  utils.clearCookie('Bihu-Token',  'nscc-gz.cn')
  $router.push('/login')
}

const saveNavState = (navpath: string) => {
  activePath.value = navpath
  window.sessionStorage.setItem('activePath', navpath)
}
return {
  logout
}
  }
})


</script>

<template>
  <el-container class="home-container">
    <el-header class="header">
      <router-link to="/home" class="logo">
        <span> .logo. </span>
        <span>蛋白质设计</span>
      </router-link>
      <head-nav></head-nav>
      <el-button class="header" type="text" @click="logout">Logout</el-button>
    </el-header>
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
