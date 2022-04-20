<template>
  <div class="list-head">
    <el-row>
      <el-col :span='1'>
        <div class="line"></div>
      </el-col>
      <el-col :span='18'>
        <div class="title">{{title}}</div>
      </el-col>
      <el-col :span='3'>
        <div class="next">
           <el-button round size='small'>浏览全部</el-button>
        </div>
      </el-col>
      <el-col :span='2'>
        <div class="next">
        <el-button size='small' @click="emit('btnClick',-1)">
          <el-icon><arrow-left-bold /></el-icon>
        </el-button>
        <el-button size='small' @click="emit('btnClick',1)">
          <el-icon><arrow-right-bold /></el-icon>
        </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts' setup>
defineProps<{title:string}>()
let emit=defineEmits<{
  (e:'btnClick',num:number):void
}>()
</script>
<style lang='less' scoped>
.list-head{
  height: 35px;
  line-height: 35px;
  margin-bottom: 30px;
}
.line{
  width: 3px;
  height: 35px;
  background-color: rgb(85, 2, 85);
}
.next{
  display: flex;
  justify-content: flex-end;
}
</style>
