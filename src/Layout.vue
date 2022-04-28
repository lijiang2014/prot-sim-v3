
<template>
  <el-container class="app-container">
    <el-header class="header-box">
      <router-link to="/" class="logo">
        <span> .logo. </span>
        <span>{{ rtrans('ProteinDesign') }}</span>
      </router-link>
      <head-nav></head-nav>
      <lang-sel style="width:70px"></lang-sel>
      <!-- el-color-picker for Test LANG -->
      <!-- <el-color-picker :model-value="''" style="vertical-align: middle" /> -->
      <el-button type="text" @click="logout" v-if="store.state.isLogin">{{ $t('navbar.logOut') }}</el-button>
      <el-button type="text" @click="loginHandle" v-if="!store.state.isLogin">{{ $t('login.logIn') }}</el-button>
    </el-header>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- <el-footer>Footer</el-footer> -->
    </el-container>
    <!-- 登录弹窗 -->
    <el-dialog v-model="loginWindowVisible" :title="$t('login.title')" width="30%" center draggable top="35vh">
      <login-form @closeWindow="closeWindow"></login-form>
    </el-dialog>
    <!-- #endregion -->
  </el-container>

</template>

<script  lang="ts" setup>
// components
import LoginForm from './components/Login/index.vue'
import HeadNav from './components/Nav/index.vue'
import LangSel from './components/common/LangSel.vue'
import { ref, onMounted } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import { utils } from './utils/utils';
import { trans } from './i18n'
const $router = useRouter()

let store = useStore()
onMounted(() => {
  if (window.sessionStorage.getItem('token')) {
    store.commit('loginChange', true)
    return
  }
  const bihuToken = utils.checkStarlightLog();
  if (bihuToken) {
    window.sessionStorage.setItem("token", bihuToken);
    store.commit('loginChange', true)
    return
  }
  store.commit('loginChange', false)
})
const logout = () => {
  window.sessionStorage.clear()
  utils.clearCookie('Bihu-Token', 'nscc-gz.cn')
  $router.push('/login')
  store.commit('loginChange', false)
}


let loginWindowVisible = ref(false)
const loginHandle = () => {
  loginWindowVisible.value = true
}
const closeWindow = () => {
  loginWindowVisible.value = false
}
const rtrans = (instr: string) => trans(instr, 'route.')
</script>


<style lang="less" scoped>
.app-container {
  height: 100%;
  font-size: calc(11px + 1vmin);

  .header-box {
    background-color: #333744;
    display: inline-flex;
    ;
    justify-content: space-between;
    padding: 0px 20px;
    align-items: center;
    color: #fff;
    font-size: calc(12px + 1vmin);

    .logo {
      color: #fff;
      background-color: #333744;
      display: inline-flex;
      ;
    }
  }
}
</style>
