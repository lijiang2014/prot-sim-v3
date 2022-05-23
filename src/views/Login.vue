<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" />
      </div>
      <div class="form_box">
        <login-form>
          <el-link class="link" type="primary" @click="enterHome">{{ $t('login.quickEnter') }}</el-link>
        </login-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LoginForm from '@/components/Login/index.vue'
import { useRouter } from "vue-router";
const $router = useRouter();
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

  .form_box {
    margin: 75px 20px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
}
</style>
