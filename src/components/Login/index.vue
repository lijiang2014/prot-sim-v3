<template>
  <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
    <el-form-item prop="username">
      <el-row style="width:100%">
        <el-col :span="16">
          <el-input ref="usernameRef" v-model="loginForm['username']" :placeholder="$t('login.emailName')" autofocus
            style="ime-mode: disabled" class="input" name="email">
            <template #prefix>
              <el-icon class="icon">
                <MessageBox />
              </el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button class="btn-code" type="primary" plain :disabled="loading || !verifiedUsername || codeNotTimeout"
            @click="toSendCode">
            <!-- {{ codeNotTimeout ? waitTime + ' ' + $t('login.waitInfo') : $t('login.sendCode') }} -->
            {{ $t('login.sendCode') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="loginForm.password" type="password" :placeholder="$t('login.verificationCode')"
        :disabled="!codeSent" class="input">
        <template #prefix>
          <el-icon class="icon">
            <Key />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <el-dialog v-model="starTip" :title="$t('login.confirmTitle')" width="29%" center draggable top="30vh" append-to-body>
    <login-wran></login-wran>
    <template #footer>
      <span class="footer">
        <el-button @click="starTip = false">{{ $t('login.cancel') }}</el-button>
        <el-button type="primary" @click="jumpStar">{{ $t('login.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
  <div class="footer">
    <el-link class="f-left" type="primary" @click="starlightLogin">
      {{ $t('login.starlightLogin') }}
    </el-link>
    <slot></slot>
    <span class="f-right">
      <el-button type="primary" @click="submit" :disabled="loading || !verifiedCode">{{ $t('login.logon') }}
      </el-button>
    </span>
  </div>
</template>
<script lang="ts" setup>
/* TODO LIST
 * ??????????????????????????????????????????????????? ???60s???
 * starlightLogin
 */
import LoginWran from './starlightLoginWarn.vue'
import { ref, reactive, watch } from 'vue'
import { useStore } from '@/store'
import { ElNotification as $Notify, ElMessage, FormRules } from 'element-plus'
import { sendEmailCode, login, LoginRequest } from '@/api/api'
import { RedirectLoginURL } from '@/api/starlight'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { utils } from '@/utils/utils'
import { errorEode } from '@/api/responseCode'

let emit = defineEmits<{
  (event: 'closeWindow'): void
}>()
let store = useStore()
let $route = useRoute()
let $router = useRouter()
let $t = useI18n().t;
const loginForm: LoginRequest = reactive({
  username: "",
  password: "",
}) as LoginRequest;
const regExpEmail = /^\w{3,}([\. \- \_]\w+)*@[A-z \- \. \_ 0-9]+(\.[A-z]{2,5}){1,2}$/;
const regExpCode = /^[0-9]{6}$/;
const loginFormRules = reactive({
  username: [
    { required: true, message: $t('login.EmailOrTelephoneNeeded'), trigger: "blur" },
    { type: "email", message: $t('login.EmailFormatError'), trigger: "blur" },
  ],
  password: [
    { required: true, message: $t('login.VerificationCodeNeeded'), trigger: 'blur', },
    { pattern: regExpCode, message: $t('login.wrongWord'), trigger: 'blur' },]
} as FormRules)
let verifiedUsername = ref(false)
let verifiedCode = ref(false)
let codeSent = ref(false)
watch(() => loginForm, (newVal, oldVal) => {
  verifiedUsername.value = regExpEmail.test(newVal.username)
  verifiedCode.value = regExpCode.test(newVal.password)
  console.log(verifiedUsername.value, verifiedCode.value);
}, { deep: true })

//??????????????????
let curTimeSend: number
let loading = ref(false)
let isQuick = ref(false)
let codeNotTimeout = ref(false)
let waitTime = ref(10)

const toSendCode = async () => {
  loading.value = true
  const res = await sendEmailCode(loginForm.username).catch(err => {
    console.log("err:", err)
    if (err.data?.code === 20002) {
      $Notify({ type: 'info', title: $t('login.warning'), message: "???????????????????????????????????????", duration: 60000 })
      codeNotTimeout.value = true
      codeSent.value = true
      return
    }
    $Notify({ type: 'error', title: $t('login.sendFail'), message: err })
  })
  loading.value = false
  if (!res) { return }
  if (res.code === 200) {
    $Notify({ type: 'success', title: $t('login.sendSuccess'), message: res.info })
  } else {
    codeNotTimeout.value = true
    $Notify({ type: 'error', title: errorEode[res.code], message: res.info, duration: 60000 })
  }
  console.log("res", res)
  codeSent.value = true
}

//??????????????????
// let curTimeSubmit: number

const submit = async () => {
  loading.value = true
  const res = await login(loginForm).catch((err) => {
    console.log("err:", err,);
    $Notify({ type: "error", title: $t('login.checkWrong'), message: err });
  })
  loading.value = false
  if (!res) {
    return;
  }
  console.log("res", res);
  if (res.code !== 200) {
    $Notify({ type: "error", title: errorEode[res.code], message: res.info });
    return
  }
  ElMessage({
    showClose: true,
    message: $t('login.loginOk'),
    type: "success",
    center: true,
    duration: 1000,
  });

  // ??????token
  window.localStorage.setItem("token", res.spec);
  window.localStorage.setItem("username", loginForm.username);
  store.commit('setToken', { token: res.spec, username: loginForm.username })
  console.log($route.path)
  console.log($route.path == '/login')
  if ($route.path == '/login') {
    $router.push('/')
  } else {
    emit('closeWindow')
  }
};
const starTip = ref(false);
const starlightLogin = async () => {
  starTip.value = true
}
let jumpStar = async () => {
  const href = RedirectLoginURL()
  window.location.href = href
}

const bihuToken = utils.getCookie("Bihu-Token")
console.log("bihuToken:", bihuToken)
if (bihuToken !== "") {
  // login by Starlight 
  // ??????token
  store.commit('setToken', { token: bihuToken })
  console.log($route.path)
  if ($route.path == '/login') {
    $router.push('/')
  } else {
    emit('closeWindow')
  }
}

</script>
<style lang="less" scoped>
.login_form {
  background-color: #fff;
  padding: 0px;
  // font-family: Arial, Helvetica, sans-serif;
  font-size: calc(11px + 1vmin);

  .input ::v-deep(.el-input__inner) {
    padding-left: 30px !important;
  }

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

.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>