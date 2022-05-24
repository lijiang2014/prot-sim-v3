<template>
  <div class="page">
    <div class="login_box">
      <div class="login_img">
        <img src="../assets/login/login-img.png" />
      </div>
      <div class="login">
        <div class="login_logo">
          <img src="../assets/login/login_logo.png" />
        </div>
        <div class="login_name">
          <p>蛋白结构计算平台</p>
        </div>
        <div class="form_box">
          <login-form>
            <el-link class="link" type="primary" @click="enterHome">{{ $t('login.quickEnter') }}</el-link>
          </login-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, reactive, toRefs } from "@vue/runtime-core";
import { useRouter } from "vue-router";

import LoginForm from '@/components/Login/index.vue'
const $router = useRouter();
let enterHome = () => {
  $router.push("/");
};

</script>

<style scoped>
* {
  font: 13px/1.5 "微软雅黑";
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -box-sizing: border-box;
  padding: 0;
  margin: 0;
  list-style: none;
  box-sizing: border-box;
}

.page {
  height: 100%;
  overflow: hidden;
  background: #93defe url(../assets/login/background.jpg);
  background-size: cover;
}


img {
  border: none;
}

.login_box {
  width: 1100px;
  margin-top: 200px;
  margin-left: 250px;
  display: flex;
  justify-content: space-between;
}

.login_box .login_img {
  width: 432px;
  height: 440px;
  margin-left: 50px;
}

.login_box .login_img img {
  width: 480px;
  height: 420px;
}

.login {
  height: 320px;
  width: 450px;
  padding: 50px;
  background-color: #ffffff;
  border-radius: 6px;
  box-sizing: border-box;
  position: relative;
  margin-top: 50px;
}

.login_logo {
  width: 120px;
  height: 120px;
  border: 5px solid #93defe;
  border-radius: 100px;
  background: #fff;
  text-align: center;
  line-height: 110px;
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
}

.login_name {
  width: 100%;
  float: left;
  text-align: center;
  margin-top: 20px;
}

.login_name p {
  width: 100%;
  text-align: center;
  font-size: 18px;
  color: #444;
  padding: 10px 0 20px;
}

.login_logo img {
  width: 60px;
  height: 60px;
  display: inline-block;
  vertical-align: middle;
}
.form_box{
  float: left;
  width: 100%;
}
</style>