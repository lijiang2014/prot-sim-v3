<template>
  <!-- <h1>Queue {{ store.state.count }} , init {{count}}</h1> -->
  <div class="job-list-container" style="">
    <div class="filter-container">
      <div class="filter-tools">
        <el-input v-model="listQuery.field_lk_name" class="filter-x" clearable style="width: 150px;"
          :placeholder="$t('table.name')" />
        <el-input v-model="listQuery.field_lk_uuid" class="filter-x" clearable style="width: 150px;"
          :placeholder="$t('table.UUID')" />
        <el-select class="filter-x" v-model="listQuery.field_eq_status" :placeholder="$t('table.taskStatus')" filterable
          clearable>
          <el-option value="Pending">{{ $t('task.Pending') }}</el-option>
          <el-option value="Running">{{ $t('task.Running') }}</el-option>
          <el-option value="CompletedSuccess">{{ $t('task.CompletedSuccess') }}</el-option>
          <el-option value="CompletedFailed">{{ $t('task.Running') }}</el-option>
        </el-select>
        <el-tooltip placement="bottom" content="选择提交时间范围可查看更多记录">
          <el-date-picker v-model="listQuery.field_ge_created_at" class="filter-x" type="datetime"
            :placeholder="$t('table.createdAtFrom')" style="width: 180px;" />
        </el-tooltip>
        <el-date-picker v-if="listQuery.field_ge_created_at" class="filter-x" v-model="listQuery.field_le_created_at"
          type="datetime" :placeholder="$t('table.createdAtTo')" style="width: 180px;" />
        <el-button type="primary" class="filter-x" :icon="Search" :loading="listLoading" @click="handleFilter">
        </el-button>
      </div>
    </div>
    <div class="data-form">
      <el-table key="0" v-loading="listLoading" :data="list" stripe border fit highlight-current-row
        style="width: 100%">

        <el-table-column min-width="170px" :label="$t('table.name')" align="center">
          <template #default="scope">
            <div class="span-monospace">
              <span v-if="scope.row.name">
                {{ scope.row.name }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="170px" :label="$t('table.app')" align="center">
          <template #default="scope">
            <div class="span-monospace">
              <span v-if="scope.row.app_name">
                {{ scope.row.app_name }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.createdAt')" min-width="200px">
          <template #default="scope">
            <div class="span-monospace">
              <span v-if="scope.row.created_at">
                {{ parseTime(scope.row.created_at, '{y}-{m}-{d} {h}:{i}:{s}') }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.startedAt')" min-width="170px">
          <template #default="scope">
            <div class="span-monospace">
              <span v-if="scope.row.started_at"> {{ parseTime(scope.row.started_at, '{y}-{m}-{d} {h}:{i}:{s}')
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.endedAt')" min-width="170px">
          <template #default="scope">
            <div class="span-monospace">
              <span v-if="scope.row.end_at"> {{ parseTime(scope.row.end_at, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" class-name="status-col" :label="$t('table.taskStatus')" min-width="100px">
          <template #default="scope">
            <el-tag>{{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('table.actions')" min-width="120" fixed="right"
          class-name="small-padding">
          <template #default="scope">
            <el-button
              v-if="(scope.row.type !== 1 && scope.row.cluster_job_id) || (scope.row.type === 1 && scope.row.uuid)"
              type="primary" size="small" :icon="View" plain @click="viewSpecJob(scope.row)">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total"
        :loading="listLoading" @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  Search,
  View,
} from '@element-plus/icons-vue'
import { jobMeta } from '@/app-model';
import { ref, onMounted } from 'vue';
import { parseTime } from '@/utils';
import { getJobs } from '@/api/api';
import { useRouter, useRoute } from 'vue-router';
import { ElNotification } from 'element-plus';

const router = useRouter()
const route = useRoute()
console.log("route.query:", route.query)
const listQuery = ref({
  page: 1,
  offset: 0,
  limit: 10,
  field_lk_name: '',
  field_lk_uuid: '',
  field_ge_created_at: 0,
  field_le_created_at: 0,
  field_eq_uuid: route.query.uuid || [],
  field_eq_status: []
})

const list = ref<jobMeta[]>([])
const total = ref(0)
const listLoading = ref(false)
const handleFilter = () => {
  listQuery.value.page = 1
  getList()
}
const getList = async () => {
  listLoading.value = true
  let ret = await getJobs(listQuery.value).catch(err => {
    console.log(err)
    if (typeof err.data?.code === "number") {
      ElNotification(err.data.info + "")
    }
  })
  listLoading.value = false
  if (!ret) {
    return
  }
  list.value = ret.spec
  total.value = ret.total || 0
}
onMounted(() => {
  getList()
})
const handleSizeChange = (val: number) => {
  listQuery.value.limit = val
  getList()
}
const handleCurrentChange = (val: number) => {
  listQuery.value.page = val
  getList()
}
const viewSpecJob = (row: jobMeta) => {
  if (router.hasRoute('result-' + row.app_name)) {
    router.push({ name: 'result-' + row.app_name, params: { uuid: row.uuid } })
  } else {
    router.push({ name: 'jobResult', params: { uuid: row.uuid } })
  }
}
</script>

<style rel="stylesheet/less" lang="less">
.job-list-container {

  // margin:20px;
  .same-width-chart {
    font-family: Consolas, Monaco, monospace;
  }
}

.span-monospace {
  display: inline-block;
  font-family: Consolas, Monaco, monospace;
}

.job-list-container {
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
  margin-right: 0px;
  box-sizing: content-box;

  .filter-tools {
    .filter-x {
      .el-input .el-selector {
        min-width: 120px;
      }

      display: inline-block;
      padding-right: 1em;
    }

    padding-bottom: 1em;
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

.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}
</style>