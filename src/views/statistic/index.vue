<template>
  <div class="bg">
    <div class="container">
      <h1>App executed Times </h1>
      <div class="filter" v-if="store.state.user.isAdmin">
        <el-input class="filter-x" v-model="state.query.field_lk_app_name" placeholder="App"></el-input>
        <el-date-picker v-model="(state.daterange as any)" type="datetimerange" :shortcuts="shortcuts"
          range-separator="To" start-placeholder="Start date" end-placeholder="End date" />
        <el-button type="primary" :icon="Search" :loading="state.loading" @click="getList"></el-button>
        <!-- {{ state }} -->
      </div>
      <div v-if="state.loading">Data is loading ...</div>
      <ol>
        <li class="list-item"> <span class="index"># </span> <a class="name" href="/apps">App Name </a>
          <span class="number"> Submited Times</span>
        </li>
        <li class="list-item" v-for="(item, index) in state.list"> <span class="index">{{ index + 1 }} </span> <a
            class="name" :href="'/app/' + item.appName">{{ item.appName }} </a>
          <span class="number"> {{ item.cnt
          }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  Search,
} from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue';
import { useStore } from '@/store';
import { getAppCounts } from '@/api/api';
import { AppCounts } from '@/app-model';
import { parseTime } from '@/utils';
const state = reactive<{
  list: AppCounts[],
  loading: boolean,
  daterange: null | [Date, Date],
  query: {
    field_lk_app_name: string,
    field_ge_created_at: string,
    field_le_created_at: string,
  },
}>({
  list: [],
  loading: false,
  daterange: null,
  query: {
    field_lk_app_name: '',
    field_ge_created_at: '',
    field_le_created_at: '',
  },
})
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
const store = useStore()
const count = ref(store.state.count)
const handleClick = () => {
  store.commit("increment")
  console.log(store.state.count)
}
const getList = async () => {
  state.loading = true
  if (state.daterange) {
    console.log(state.daterange)
    state.query.field_ge_created_at = parseTime(state.daterange[0].getTime())
    state.query.field_le_created_at = parseTime(state.daterange[1].getTime())
  }
  const ret = await getAppCounts(state.query)
  state.loading = false
  console.log("ret", ret)
  state.list = ret.spec
}
onMounted(() => {
  getList()
})
</script>


<style scoped lang="less">
.bg {
  width: 100%;
  display: flex;
  justify-content: center;
}

@media screen and (min-width:992px) {
  .container {
    width: 970px;
  }
}

@media screen and (min-width:768px) {
  .container {
    width: 750px;
  }
}



.container {
  padding: 1em;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
}

.filter {

  .filter-txt {
    margin-right: 1em;
  }

  .filter-x {
    min-width: 120px;
    max-width: 15em;
  }

  padding-bottom: 1em;
  display: flex;
  justify-content: space-evenly;
}

.list-item {
  margin-bottom: 0.2em;
  display: flex;

  .index {
    padding-right: 1em;

  }

  .number {
    margin-left: auto;
    padding-right: 2em;
  }
}
</style>