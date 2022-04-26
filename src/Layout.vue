
<template>
  <el-container class="home-container">
    <el-header class="header">
      <router-link to="/" class="logo">
        <span> .logo. </span>
        <span>蛋白质设计</span>
      </router-link>
      <head-nav></head-nav>
      <lang-sel></lang-sel>
      <el-button class="header" type="text" @click="logout" v-if="store.state.isLogin">Logout</el-button>
      <el-button class="header" type="text" @click="loginHandle" v-if="!store.state.isLogin">Login</el-button>
    </el-header>
    <el-container>

      <el-container style="padding-bottom: 20px">
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
    <!-- 登录弹窗 -->
    <el-dialog
      v-model="centerDialogVisible"
      title="用户登录"
      width="30%"
      center
      draggable
      top="35vh"
    >
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item prop="username">
          <el-row style="width:100%">
            <el-col :span="18">
              <el-input
                ref="usernameRef"
                prefix-icon="el-icon-user-solid"
                v-model="loginForm['username']"
                placeholder="请输入邮箱地址"
                autofocus
                style="ime-mode: disabled"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <el-button
                class="get"
                type="primary"
                plain
                :disabled="!verifiedUsername"
                @click="toSendCode"
                >获取验证码</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入验证码"
            :disabled="!codeSent"
          ></el-input>
        </el-form-item>
      </el-form>

      <el-dialog
        v-model="starTip"
        title="确认信息"
        width="29%"
        center
        draggable
        top="30vh"
        append-to-body
      >
        <span>
          确认后将跳转到星光平台（https://starlight.nscc-gz.cn）进行用户登录；计算将使用您在星光平台上的资源进行；并将授权
          ProtSim 平台使用您在星光平台上的接口权限（一类权限）;详情可见
          <a href="javascript:;">《星光平台第三方授权说明》（链接到星光说明页面（暂无））</a>
        </span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="starTip = false">Cancel</el-button>
            <el-button type="primary" @click="jumpStar">Confirm</el-button>
          </span>
        </template>
      </el-dialog>
      <template #footer>
        <div class="login-foot">
          
        <el-link type="primary" @click="starlightLogin">
          通过星光平台登录
        </el-link>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submit" :disabled="!verifiedCode">提交</el-button>
        </span>
        </div>
      </template>
    </el-dialog>
    <!-- #endregion -->
  </el-container>

</template>

<script  lang="ts" setup>
// components
import HeadNav from './components/Nav/index.vue'
import LangSel from './components/common/LangSel.vue'
import { ref,reactive,watch, onMounted} from 'vue'
import {useStore} from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification as $Notify, ElMessage , FormRules} from 'element-plus'
import { utils } from './utils/utils';
import { sendEmailCode, login, LoginRequest } from '@/api/api'
import { RedirectLoginURL } from '@/api/starlight'
const $route = useRoute()
const $router = useRouter()

let store=useStore()
onMounted(()=>{
  if(window.sessionStorage.getItem('token')){
    store.commit('loginChange',true)
    return
  }
  const bihuToken = utils.checkStarlightLog();
  if (bihuToken) {
    window.sessionStorage.setItem("token", bihuToken);
    store.commit('loginChange',true)
    return
  }
  store.commit('loginChange',false)
})
const activePath = ref('/welcome')
activePath.value = $route.path

const logout = () => {
  window.sessionStorage.clear()
  utils.clearCookie('Bihu-Token',  'nscc-gz.cn')
  $router.push('/login')
  store.commit('loginChange',false)
}


let centerDialogVisible=ref(false)
const loginHandle =()=>{
 centerDialogVisible.value=true
}
const bihuToken = utils.checkStarlightLog()
// if (bihuToken) {
//   $router.push('/')
// }

const loginForm: LoginRequest = reactive({
  username: "",
  password: "",
}) as LoginRequest;
const regExpEmail = /^\w{3,}(\.\w+)*@[A-z 0-9]+(\.[A-z]{2,5}){1,2}$/;
const regExpCode = /^[0-9]{6}$/;
const loginFormRules = reactive({
  username: [
    { required: true, message: "请输入邮箱地址", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" },
  ],
  password: [
    { required: true,message: '请输入验证码', trigger: 'blur', },
    { pattern: regExpCode, message: '验证码格式不对', trigger: 'blur'},]
} as FormRules )
let verifiedUsername = ref(false)
let verifiedCode = ref(false)
let codeSent = ref(false)
watch(()=> loginForm, (newVal, oldVal) => {
  verifiedUsername.value = regExpEmail.test(newVal.username)
  verifiedCode.value = regExpCode.test(newVal.password)
  console.log(verifiedUsername.value, verifiedCode.value );
}, {deep: true})
const  toSendCode = async () => {
  const res = await sendEmailCode(loginForm.username).catch(err => {
    console.log("err:", err, "123@45.cn will pass the mock test!")
    $Notify({ type: 'error', title: '验证码发送失败，请稍后再试', message: err})
  })
  if (!res) { return }
  console.log("mock sendCode 123456")
  console.log("res", res)
  codeSent.value = true
}
const submit = async () => {
  console.log("mock submit ", loginForm);
  const res = await login(loginForm).catch((err) => {
    console.log("err:", err, "123456 will pass the mock test!");
    $Notify({ type: "error", title: "验证码校验出错", message: err });
  });
  if (!res) {
    return;
  }
  console.log("res", res);
  if (res.status === 200) {
     ElMessage({
      showClose: true,
      message: "Login Success!",
      type: "success",
      center: true,
      duration: 1000,
    });
  }
  // 保存token
  window.sessionStorage.setItem("token", res.token);
  centerDialogVisible.value=false
  store.commit('loginChange',true)
};
const starTip = ref(false);
const starlightLogin = async () => {
  starTip.value=true
}
let jumpStar=async ()=>{
  const href = RedirectLoginURL()
  window.location.href = href
}
//#endregion

</script>


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
