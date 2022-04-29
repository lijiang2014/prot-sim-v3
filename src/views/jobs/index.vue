<template>
<!-- <h1>Queue {{ store.state.count }} , init {{count}}</h1> -->
<div class="job-list-container" style="">
  <div class="filter-container">
    <div class="filter-tools">
        <el-input
          v-model="listQuery.field_lk_name"
          class="filter-x"
          clearable
          style="width: 150px;"
          placeholder="作业名称"
        /> 
        <el-input
          v-model="listQuery.field_eq_cluster_job_id"
          class="filter-x"
          clearable
          style="width: 150px;"
          placeholder="作业ID"
        />
        <el-select class="filter-x" v-model="listQuery.field_eq_status"  placeholder="作业状态" filterable clearable >
          <el-option value="0">排队</el-option>
          <el-option value="1">运行</el-option>
          <el-option value="2">成功</el-option>
          <el-option value="3">失败</el-option>
        </el-select>
        <el-tooltip class="item" effect="dark" content="选择 提交时间范围 可查看更多记录" placement="right-start">
          <el-date-picker
            v-model="listQuery.field_ge_created_at"
            class="filter-x"
            type="datetime"
            placeholder="提交时间From (默认显示近2个月记录)"
            style="width: 300px;"
          />
        </el-tooltip>
        <el-date-picker
          v-if="listQuery.field_ge_created_at"
          class="filter-x"
          v-model="listQuery.field_le_created_at"
          type="datetime"
          placeholder="提交时间To"
          style="width: 200px;"
        /> 
        <el-button
          type="primary"
          class="filter-x"
          icon="el-icon-search"
          :loading="listLoading"
          @click="handleFilter"
        >
          {{ $t('table.search') }}
        </el-button>
    </div>
  </div>
</div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
const listQuery = ref({
        page: 1,
        offset: 0,
        limit: 10,
        field_lk_name: '',
        field_eq_cluster_job_id: '',
        // field_eq_user_name: '',
        // field_eq_group_name: '',
        field_ge_created_at: 0,
        field_le_created_at: 0,
        field_eq_status: []
})
const listLoading = ref(true)
const handleFilter = () => { 
}
</script>

<style rel="stylesheet/less" lang="less">
.job-list-container{
  // margin:20px;
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
  .filter-tools {
    .filter-x {
      .el-input .el-selector{
        min-width:120px;
      }
      display: inline-block;
      padding: 5px;
    }
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
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

</style>