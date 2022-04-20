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
        <el-sub-menu :index="item.name" v-for="item in menuList" :key="item.id">
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
            <span class="header">Doc</span>
          </template>
        </el-menu-item>
        <!-- about -->
        <el-menu-item index="/about">
          <template #title>
            <!-- 文本 -->
            <span class="header">About</span>
          </template>
        </el-menu-item>
        <el-sub-menu
          :index="item.name"
          v-for="item in menuList2"
          :key="item.id"
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
      </el-menu>

      <el-button
        class="header"
        type="text"
        v-if="store.state.isLogin"
        @click="logout"
        >Logout</el-button
      >
      <el-button
        class="header"
        type="text"
        v-if="!store.state.isLogin"
        @click="loginHandle"
        >Login</el-button
      >
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
        <span
          >确认后将跳转到星光平台（https://starlight.nscc-gz.cn）进行用户登录；计算将使用您在星光平台上的资源进行；并将授权
          ProtSim 平台使用您在星光平台上的接口权限（一类权限）;详情可见<a
            href="javascript:;"
            >《星光平台第三方授权说明》（链接到星光说明页面（暂无））</a
          ></span
        >
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="starTip = false">Cancel</el-button>
            <el-button type="primary" @click="jumpStar">Confirm</el-button>
          </span>
        </template>
      </el-dialog>
      <template #footer>
        <div class="login-foot">
          
        <el-link type="primary" @click="starlightLogin"
          >通过星光平台登录</el-link
        >
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="submit" :disabled="!verifiedCode"
            >提交</el-button
          >
        </span>
        </div>
      </template>
    </el-dialog>
  </el-container>
</template>

<script lang="ts" setup>
import { el } from "element-plus/lib/locale";
import { computed, onMounted, reactive, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "@/store";
const $route = useRoute();
const $router = useRouter();
let store = useStore();
let centerDialogVisible = ref(false);
const menuList = ref([
  {
    //结构预测，// 一级菜单
    id: 10,
    name: "APP",
    // path: "predict/structure/",
    children: [
      {
        // 二级菜单
        id: 11,
        name: "结构预测",
        path: "predict/structure/",
        children: [],
        order: null,
      },
      {
        id: 12,
        name: "相似性计算",
        path: "structure_similarity/submit",
        children: [],
        order: null,
      },
    ],
    order: 1,
  },
]);
const menuList2 = reactive([
  {
    id: 20,
    name: "...",
    children: [
      {
        id: 21,
        name: "DataSet",
        path: "welcome1",
      },
      {
        id: 22,
        name: "Papers",
        path: "welcome2",
      },
      {
        id: 23,
        name: "Contacts",
        path: "welcome3",
      },
    ],
  },
]);
const iconObj = ref({
  10: "el-icon-s-opportunity",
  11: "el-icon-edit",
  12: "el-icon-s-goods",
  13: "el-icon-present",

  20: "el-icon-s-opportunity",
  21: "el-icon-edit",
  22: "el-icon-edit",

  125: "el-icon-user-solid",
  103: "el-icon-s-goods",
  101: "el-icon-s-opportunity",
  102: "el-icon-present",
  145: "el-icon-orange",
});
const isCollapsed = ref(false);
const activePath = ref("/welcome");

activePath.value = $route.path;

const logout = () => {
  window.sessionStorage.clear();
  store.commit("loginChange", false);
  $router.push("/login");
};
onMounted(() => {
  if (window.sessionStorage.token) {
    store.commit("loginChange", true);
  } else {
    store.commit("loginChange", false);
  }
});
const loginHandle = () => {
  centerDialogVisible.value = true;
};
const saveNavState = (navpath: string) => {
  activePath.value = navpath;
  window.sessionStorage.setItem("activePath", navpath);
};
//登录相关-----------

import { sendEmailCode, login, LoginRequest } from "./api/api";
import { ElNotification as $Notify, ElMessage, FormRules } from "element-plus";

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
    { required: true, message: "请输入验证码", trigger: "blur" },
    { pattern: regExpCode, message: "验证码格式不对", trigger: "blur" },
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
const toSendCode = async () => {
  const res = await sendEmailCode(loginForm.username).catch((err) => {
    console.log("err:", err, "123@45.cn will pass the mock test!");
    $Notify({
      type: "error",
      title: "验证码发送失败，请稍后再试",
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
  store.commit("loginChange", true);
  centerDialogVisible.value = false;
};
let starTip = ref(false);
let starlightLogin = () => {
  console.log(starTip);
  starTip.value = true;
};

let jumpStar = () => {
  centerDialogVisible.value = false;
  let param1 = "https://starlight.nscc-gz.cn/#/login";
  let param2 = "longTerm";
  let param3 = "http://localhost:8080/#/welcome";
  let param4 = 2;
  window.location.href = `
          ${param1}?redirect=%2Fstarlight&token_type=${param2}&redirect_url=${param3}&cookie_exp=${param4}
          `;
};
//登录相关***********
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
.get{
  width: 100%;
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
.login-foot{
  display: flex;
  justify-content: space-between;
}
</style>
