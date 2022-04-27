<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <el-form
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item prop="username">
          <el-row style="width: 100%">
            <el-col :span="18">
              <!-- 请输入邮箱地址 -->
              <el-input
                ref="usernameRef"
                prefix-icon="el-icon-user-solid"
                v-model="loginForm['username']"
                :placeholder="$t('login.username')"   
                autofocus
                style="ime-mode: disabled"
              ></el-input>
            </el-col>
            <!-- 获取验证码 -->
            <el-col :span="6">
              <el-button
                class="get"
                type="primary"
                plain
                :disabled="!verifiedUsername"
                @click="toSendCode"
                >{{$t('login.getCode')}}</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 请输入验证码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
            :placeholder="$t('login.password')"  
            :disabled="!codeSent"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-row style="width: 100%">
            <el-col :span="12" class="jump">
              <el-link type="primary" @click="starlightLogin"
                >{{$t('login.starLogin')}}</el-link
              >
              <!-- 星光平台登录 -->
            </el-col>
            <el-col :span="12" class="submit">
              <el-button
                type="primary"
                @click="submit"
                :disabled="!verifiedCode"
                >{{$t('login.submit')}}</el-button
              >
              <!-- 提交 -->
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
<!-- 直接进入主页 -->
      <el-link class="enter-home" @click="enterHome">{{$t('login.quickEnter')}} </el-link>
      <div class="lang-sel">
        <lang-sel></lang-sel>
      </div>
    </div>
    <el-dialog
      v-model="centerDialogVisible"
      :title="$t('login.confirmTitle')"
      width="30%"
      center
      draggable
      top="35vh"
    >
    <!-- 确认后将跳转到星光平台（https://starlight.nscc-gz.cn）进行用户登录；计算将使用您在星光平台上的资源进行；并将授权
        ProtSim 平 -->
        <!-- 《星光平台第三方授权说明》（链接到星光说明页面（ -->
      <span
        >{{$t('login.confirmMessage')}}<a
          href="javascript:;"
          >{{$t('login.explainBook')}}</a
        ></span
      >
      <!-- 取消  确认 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">{{$t('login.cancel')}}</el-button>
          <el-button type="primary" @click="jumpStar">{{$t('login.confirm')}} </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
/* TODO LIST
 * 验证码发送以及成功后的防治再次触发 （60s）
 * starlightLogin
 */
import { sendEmailCode, login, LoginRequest } from "../api/api";
import { RedirectLoginURL } from "../api/starlight";
import { ref, reactive, watch, getCurrentInstance, onMounted, computed } from "vue";
import { ElNotification as $Notify, ElMessage, FormRules } from "element-plus";
// import type { FormRules } from "element-plus";
import { useRouter } from "vue-router";
import { utils } from "@/utils/utils";
import LangSel from '../components/common/LangSel.vue'
import { useI18n } from "vue-i18n";
import { useStore } from "@/store";
const store = useStore()
const $router = useRouter();
let i18=useI18n()
const bihuToken = utils.checkStarlightLog();
if (bihuToken) {
  window.sessionStorage.setItem("token", bihuToken);
  store.commit("setToken",bihuToken)
  $router.push("/");
}

const loginForm: LoginRequest = reactive({
  username: "",
  password: "",
}) as LoginRequest;
const regExpEmail = /^\w{3,}(\.\w+)*@[A-z 0-9]+(\.[A-z]{2,5}){1,2}$/;
const regExpCode = /^[0-9]{6}$/;
// 请输入邮箱地址邮箱格式不正确请输入验证码验证码格式不对
let i18username=computed(()=>i18.t('login.username')).value
let i18wrongName=computed(()=>i18.t('login.wrongName')).value
let i18password=computed(()=>i18.t('login.password')).value
let i18wrongWord=computed(()=>i18.t('login.wrongWord')).value
let i18sendFail=computed(()=>i18.t('login.sendFail')).value
let i18checkWrong=computed(()=>i18.t('login.checkWrong')).value
let i18loginOk=computed(()=>i18.t('login.loginOk')).value

const loginFormRules = reactive({
  username: [
    { required: true, message: i18username, trigger: "blur" },
    { type: "email", message: i18wrongName, trigger: "blur" },
  ],
  password: [
    { required: true, message: i18password, trigger: "blur" },
    { pattern: regExpCode, message: i18wrongWord, trigger: "blur" },
  ],
} as FormRules);
let verifiedUsername = ref(false);
let verifiedCode = ref(false);
let codeSent = ref(false);
watch(
  () => loginForm,
  (newVal, oldVal) => {
    verifiedUsername.value = regExpEmail.test(newVal.username);
    verifiedCode.value = regExpCode.test(newVal.password);
    console.log(verifiedUsername.value, verifiedCode.value);
  },
  { deep: true }
);
// 验证码发送失败，请稍后再试
const toSendCode = async () => {
  const res = await sendEmailCode(loginForm.username).catch((err) => {
    console.log("err:", err, "123@45.cn will pass the mock test!");
    $Notify({
      type: "error",
      title: i18sendFail,
      message: err,
    });
  });
  if (!res) {
    return;
  }
  console.log("mock sendCode 123456");
  console.log("res", res);
  codeSent.value = true;
};
// 验证码校验出错
const submit = async () => {
  console.log("mock submit ", loginForm);
  const res = await login(loginForm).catch((err) => {
    console.log("err:", err, "123456 will pass the mock test!");
    $Notify({ type: "error", title: i18checkWrong, message: err });
  });
  if (!res) {
    return;
  }
  console.log("res", res);
  if (res.status === 200) {
    ElMessage({
      showClose: true,
      message: i18loginOk,
      type: "success",
      center: true,
      duration: 1000,
    });
  }
  // 保存token
  window.sessionStorage.setItem("token", res.token);
  //  跳转
  $router.push("/");
};
const centerDialogVisible = ref(false);
const starlightLogin = async () => {
  centerDialogVisible.value = true;
};
let jumpStar = async () => {
  const href = RedirectLoginURL();
  window.location.href = href;
};
let enterHome = () => {
  $router.push("/");
};
</script>
<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;

  .avatar_box {
    width: 100px;
    height: 100px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    padding: 2px;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 10px #ddd;
    border: 1px solid #eee;
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .get {
    width: 100%;
    text-align: center;
    padding-left: 15px;
  }
}

.login_form {
  position: absolute;
  width: 100%;
  bottom: 10%;
  box-sizing: border-box;
  padding: 0 20px;
}

.btns {
  .jump {
    color: #000;
  }
  .submit {
    display: flex;
    justify-content: flex-end;
  }
}
.pop-window {
  position: absolute;
  top: 50%;
}
.enter-home {
  position: absolute;
  left: 20px;
  bottom: 20px;
  color: #409eff
}
.lang-sel{
  position: absolute;
  left: 20px;
  top: 20px;
}
</style>
