<template>
  <div class="container">
    <el-row
      :gutter="20"
      class="searchPageBar"
      justify="space-between"
    >
      <!-- 搜索框 -->
      <el-col :span="12">
        <el-row>
          <el-col :span="4">
            <div>
              <el-select
              v-model="state.searchType"
              slot="prepend"
              placeholder="select"
            >
              <el-option label="Job Name" value="job_name"></el-option>
              <el-option label="Email Address" value="email_addr"></el-option>
            </el-select>
            </div>
          </el-col>
          <el-col :span="18">
            <el-input
              :placeholder="'Search by your ' + searchType_show()"
              v-model="state.searchContent"
              class="input-with-select"
              @keyup.enter.native="searchJob"
              style="text-transform: uppercase"
            >
            </el-input>
          </el-col>

          <el-col :span="2">
            <el-button slot="append" @click="searchJob">
              <el-icon><search /></el-icon>
            </el-button>
          </el-col>
        </el-row>
      </el-col>

      <!-- 选择分类按钮 -->
      <el-col :span="11" :pull='1'>
        <el-row justify="end">
          <el-button plain @click="queue()">All</el-button>
          <el-button type="primary" plain @click="queryJob('running_date')"
            >Active</el-button
          >
          <el-button type="warning" plain @click="queryJob('pending')"
            >Pending</el-button
          >
          <el-button type="success" plain @click="queryJob('completed_date')"
            >Success</el-button
          >
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <!-- 表格 -->
        <el-table
          :data="
            state.tableData.slice(
              (state.currentPage - 1) * state.pagesize,
              state.currentPage * state.pagesize
            )
          "
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :stripe="true"
          @row-click="clickRow"
          v-loading="state.loading"
          element-loading-text="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          :key="state.tableKey"
        >
          <!-- 列 -->
          <el-table-column type="index"></el-table-column>
          <el-table-column sortable prop="fields.job_name" label="Job Name">
            <template #default="scope">
              <!-- 如果出现完completed_date就现实连接 -->
              <!-- 跳转链接 -->
              <el-link
                v-if="scope.row.fields.completed_date"
                type="success"
                @click="toResult(scope.row.fields.job_name)"
              >
                {{ scope.row.fields.proj_name }}
              </el-link>
              <!-- 否者现实弹框 -->
              <el-popover v-else trigger="click" placement="top">
                <p>
                  Job
                  <span style="color: red">{{
                    scope.row.fields.proj_name
                  }}</span>
                  is not completed
                </p>
                <div slot="reference" class="name-wrapper">
                  <el-link type="info" disabled>
                    {{ scope.row.fields.proj_name }}
                  </el-link>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="Tools">
            <template #default="scope">
              {{ scope.row.fields.tools.replace(",", ", ") }}
            </template>
          </el-table-column>
          <el-table-column label="Submitted Date">
            <template #default="scope">
              {{ format_date(scope.row.fields.upload_date) }}
            </template>
          </el-table-column>
          <el-table-column label="Started Date">
            <template #default="scope">
              {{ format_date(scope.row.fields.running_date, "pending") }}
            </template>
          </el-table-column>

          <el-table-column
            sortable
            prop="fields.completed_date"
            label="Completed Date"
          >
            <template #default="scope">
              {{ format_date(scope.row.fields.completed_date, "-") }}
            </template>
          </el-table-column>
          <el-table-column sortable prop="fields.run_status" label="Status">
            <template #default="scope">
              {{ scope.row.fields.run_status }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--分页条 -->
    <el-row justify="end">
      <!-- 分页 -->
      <el-col>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="state.currentPage"
            :page-sizes="[5, 10, 20, 50, 100]"
            :page-size="state.pagesize"
            layout="total, sizes, prev, pager, next"
            :total="state.tableData.length"
            prev-text="Prev"
            next-text="Next"
            background
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import http from "@/api/http";
import { reactive } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

let $router = useRouter();
let state = reactive({
  tableData: [],
  currentPage: 1, //默认显示页面为1
  pagesize: 10, //    每页的数据条数
  searchType: "job_name",
  searchContent: "",
  loading: false,
  tableKey: "tableStruc",
});
onMounted(() => {
  queue();
});

let searchType_show = () => {
  return state.searchType === "job_name" ? "Job Name" : "Email Address";
};

let queryJob = (searchType:string) => {
  state.loading = true;
  http
    .get("api/structure/search/", {
      params: {
        searchType: searchType,
      },
    })
    .then((res:any) => {
      state.tableKey = searchType;
      state.tableData = JSON.parse(res);
      state.loading = false;
    });
};

let searchJob = () => {
  if (!state.searchContent) {
    ElMessage({
      message: "Empty Input!",
      center: true,
      type: "error",
    });
    return;
  }
  http
    .get("api/structure/search/", {
      params: {
        searchType: state.searchType,
        searchContent: state.searchContent,
      },
    })
    .then((res:any) => {
      console.log(res)
      state.tableKey = state.searchType;
      state.tableData = JSON.parse(res);
    });
};

let clickRow = (row:any) => {
  console.log(row);
};
let toResult = (proj_name:string) => {
  $router.push({
    path: "/predict/structure/result/",
    query: { proj_name: proj_name },
  });
};
let queue = () => {
  state.loading = true;
  http.get("api/structure/queue/").then((response:any) => {
    state.tableData = JSON.parse(response);
    state.loading = false;
  });
};
let format_date = function (dat_str:any, return_str?:any) {
  if (dat_str) {
    return dat_str
      .toString()
      .replace("T", " ")
      .replace(/\.\d+$/, "");
  }
  return return_str;
};
let tableRowClassName = ({ row, rowIndex }:any) => {
  if (row.fields.running_date && !row.fields.completed_date) {
    return "warning-row";
  }
  return "";
};
//每页下拉显示数据
let handleSizeChange = function (size:number) {
  state.pagesize = size;
  /*console.log(state.pagesize) */
};
//点击第几页
let handleCurrentChange = function (currentPage:number) {
  state.currentPage = currentPage;
  /*console.log(state.currentPage) */
};
</script>

<style lang="less" scoped>
.searchPageBar {
  padding-top: 15px;
  padding-left: 10px;
}

.pagination {
  padding-top: 10px;
}
.el-select {
  width: 100%;
}

// .input-with-select .el-input-group__prepend {
//   background-color: #fff;
// }

.container {
  padding-bottom: 20px;
  padding-left: 10px;
  padding-right: 10px;
}
</style>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
