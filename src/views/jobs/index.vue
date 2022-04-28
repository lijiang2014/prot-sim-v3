<template>
<!-- <h1>Queue {{ store.state.count }} , init {{count}}</h1> -->
<div class="job-list-container" style="">
  <div class="filter-container">
    <div style="">
      <div class="filter-tool">
          <el-select class="test">xxxx</el-select> 
          <el-input
              v-model="listQuery.field_lk_name"
              class="test"
              clearable
              style="width: 150px;"
              placeholder="作业名称"
            /> 
          <el-input
              v-model="listQuery.field_lk_name"
              class="test"
              clearable
              style="width: 150px;"
              placeholder="作业名称"
            />
          <el-button
            type="primary"
            icon="el-icon-search"
            :loading="listLoading"
            @click="handleFilter"
          >
            {{ $t('table.search') }}
          </el-button>
      </div>
    </div>
  </div>
</div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
// import { useStore } from '@/store';
// const store = useStore()
// // const count = ref(store.state.count)
const listQuery = ref({
        page: 1,
        offset: 0,
        limit: 10,
        field_lk_name: '',
        field_eq_cluster_job_id: '',
        field_lk_partition_name: '',
        field_eq_user_name: '',
        field_eq_group_name: '',
        field_ge_created_at: 0,
        field_eq_status: []
})
const listLoading = ref(true)
// const handleClick = () => {
//   store.commit("increment")
//   console.log(store.state.count)
// }
const handleFilter = () => { 
}
</script>

<style rel="stylesheet/less" lang="less">
.job-list-container{
  margin:20px;
  .same-width-chart {
    font-family: Consolas, Monaco, monospace;
  }
}
.span-monospace {
  display: inline-block;
  font-family: Consolas, Monaco, monospace;
}
.job-list-container{
  .same-width-chart {
    font-family: Consolas, Monaco, monospace;
  }
}
.span-monospace {
  display: inline-block;
  font-family: Consolas, Monaco, monospace;
}
.filter-container {
  display: inline-block;
  width: 100%;
      // margin-right: 10px;
      height:200px;
      margin-right: 0px;
    box-sizing: content-box;
}
.text-label {
  font-size: 14px;
  color: #606266;
  font-weight: 700;
}
.tooltip-text {
  display: inline-block;
  line-height: 8px;
  font-size: 12px;
  color: #ff6a00;
}
.test {
    display: inline-block;
  width:120px;
}
</style>