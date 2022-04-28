<template>
<el-form
  label-width="0px"
  class="login_form"
  :model="loginForm"
  :rules="loginFormRules"
  >
  <el-form-item prop="username">
    <el-row style="width:100%">
      <el-col :span="16">
        <el-input
          ref="usernameRef"
          prefix-icon="el-icon-user-solid"
          v-model="loginForm['username']"
          :placeholder="$t('login.email')"
          autofocus
          style="ime-mode: disabled"
        ></el-input>
      </el-col>
      <el-col :span="8">
        <el-button
          class="btn-code"
          type="primary"
          plain
          :disabled="!verifiedUsername"
          @click="toSendCode"
          >{{$t('login.sendCode')}}</el-button
        >
      </el-col>
    </el-row>
  </el-form-item>
  <el-form-item prop="password">
    <el-input
      prefix-icon="el-icon-lock"
      v-model="loginForm.password"
      type="password"
      :placeholder="$t('login.codePlaceholder')"
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
  <login-wran></login-wran>
  <template #footer>
    <span class="footer">
      <el-button @click="starTip = false">Cancel</el-button>
      <el-button type="primary" @click="jumpStar">Confirm</el-button>
    </span>
  </template>
</el-dialog>
  <div class="footer">
    <el-link class="f-left" type="primary" @click="starlightLogin">
      {{$t('login.starlightLogin')}}
    </el-link>
    <slot></slot>
    <span class="f-right">
      <el-button type="primary" @click="submit" :disabled="!verifiedCode">{{$t('login.submit')}}</el-button>
    </span>
  </div>
</template>
<script lang="ts" setup>
/* TODO LIST
 * 验证码发送以及成功后的防治再次触发 （60s）
 * starlightLogin
 */
import LoginWran from './starlightLoginWarn.vue'
import { ref,reactive,watch, onMounted} from 'vue'
import {useStore} from '@/store'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification as $Notify, ElMessage , FormRules} from 'element-plus'
import { utils } from '@/utils/utils';
import { sendEmailCode, login, LoginRequest } from '@/api/api'
import { RedirectLoginURL } from '@/api/starlight'
import { trans } from '@/i18n'
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
const rtrans = (instr:string) => trans(instr, 'route.')
</script>
<style lang="less" scoped>

.login_form {
  background-color: #fff;
  padding: 0px;
  // font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);
  .btn-code {
    width: 100%;
  }
}

.footer {
  display: flex;
  justify-content: space-between;

  // .f_left {
  //   color: red;
  // }
  // .f_right {
  //   color: blue;
  // }
}
</style>