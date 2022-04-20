<template>
  <div class="login_container">
    <el-button @click="enterHome">直接进入主页</el-button>
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
        <el-form-item class="btns">
          <el-row style="width: 100%">
            <el-col :span="12" class="jump">
              <el-link type="primary" @click="starlightLogin"
                >星光平台登录</el-link
              >
            </el-col>
            <el-col :span="12" class="submit">
              <el-button
                type="primary"
                @click="submit"
                :disabled="!verifiedCode"
                >提交</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      v-model="centerDialogVisible"
      title="确认信息"
      width="30%"
      center
      draggable
      top="35vh"
    >
      <span
        >确认后将跳转到星光平台（https://starlight.nscc-gz.cn）进行用户登录；计算将使用您在星光平台上的资源进行；并将授权
        ProtSim 平台使用您在星光平台上的接口权限（一类权限）;详情可见<a
          href="javascript:;"
          >《星光平台第三方授权说明》（链接到星光说明页面（暂无））</a
        ></span
      >
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="jumpStar">Confirm</el-button>
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
import { sendEmailCode, login, LoginRequest } from '../api/api'
import { RedirectLoginURL } from '../api/starlight'
import { ref, reactive, watch } from 'vue'
import { ElNotification as $Notify, ElMessage , FormRules} from 'element-plus'
import { useRouter } from 'vue-router'
import { utils } from '@/utils/utils'
const $router = useRouter()

const bihuToken = utils.checkStarlightLog()
if (bihuToken) {
  $router.push('/home')
}

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
  //  跳转
  $router.push("/home");
};
const centerDialogVisible = ref(false);
const starlightLogin = async () => {
  const href = RedirectLoginURL()
  window.location.href = href
}
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
</style>
