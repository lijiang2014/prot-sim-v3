<template>
    <el-dropdown @command='switching'>
      <span class="el-dropdown-link">
        En/中
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command='zh'>中文</el-dropdown-item>
          <el-dropdown-item command='en'>English</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
</template>

<script lang='ts' setup>
import {useI18n} from 'vue-i18n'
let {locale}=useI18n()
let switching=(lang:string)=>{
    if(locale.value===lang)return
    locale.value=lang
    window.localStorage.lang=lang
}
</script>

<style>
.el-dropdown-link {
  color: #409eff ;
}
</style>
