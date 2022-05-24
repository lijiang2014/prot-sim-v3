<template>
  <h1>Mock Api</h1>
  <el-select v-model="apiSelected" style="width: 100%;" :value-key="'description'">
    <el-option v-for="(item, index) in apiList" :value="item" :label="item.description + ' : ' + item.url" :key="index">
    </el-option>
  </el-select>
  <button @click="handleClick"> Submit</button>
  <hr>
  <h2>Resp Data:</h2>
  <code>
    {{ respData }}
  </code>
  <h2>Resp Err:</h2>
  <code>
    {{ respErr }}
  </code>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
const respData = ref("")
const respErr = ref("")

interface apiType {
  url: string,
  description: string,
  method: "post" | "get",
}
const apiList = ref<apiType[]>([
  { url: "/api/getUsers", description: "查询用户列表", method: "get" },
  { url: "/api/login", description: "登录", method: "post" },
])
const apiSelected = ref<apiType>()
// const apiSelected = ref(0)

const handleClick = () => {
  axios
    .request({
      method: apiSelected.value!.method,
      url: apiSelected.value!.url,
    })
    .then((res) => {
      respData.value = JSON.stringify(res.data.data)
      console.log("data --->", respData.value)
      console.log("res --->", res.data.data)
    })
    .catch((err) => {
      respErr.value = JSON.stringify(err)
      console.log("err:", err)
    })
}
</script>