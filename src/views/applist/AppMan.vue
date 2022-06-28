<template>
  <div class="filter-container">
    <div class="filter-tools">
      <el-input v-model="listQuery.field_lk_app__name" class="filter-x" clearable style="width: 150px;"
        placeholder="Name" />
      <el-input v-model="listQuery.field_lk_app__title" class="filter-x" clearable style="width: 150px;"
        placeholder="Title" />
      <el-input v-model="listQuery.label" class="filter-x" clearable style="width: 150px;" placeholder="平台分类" />
      <el-button :loading="loading" :icon="Search" @click="getList" circle />
    </div>
  </div>
  <el-table v-loading="loading" :data="listStar">
    <el-table-column min-width="170px" label="name" align="center"><template #default="scope"><span>
          {{ scope.row.name }}
        </span></template></el-table-column>
    <el-table-column min-width="170px" label="title" align="center"><template #default="scope"><span>
          {{ scope.row.title }}
        </span></template></el-table-column>
    <el-table-column min-width="170px" label="type" align="center"><template #default="scope"><span>
          {{ scope.row.type }}
        </span></template></el-table-column>
    <el-table-column min-width="170px" label="region" align="center"><template #default="scope"><span>
          {{ scope.row.region }}
        </span></template></el-table-column>
    <el-table-column min-width="170px" label="action" align="center"><template #default="scope">
        <div v-if="itemInPlatfrom(scope.row)">
          <!-- in platform App 已经在平台中，可以执行 删除/修改 -->

          <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" :icon="InfoFilled" icon-color="#626AEF"
            title="Are you sure to delete this?" @confirm="deleteAppHandler(scope.row)">
            <template #reference>
              <el-button type="danger" :icon="Delete"></el-button>
            </template>
          </el-popconfirm>
          <el-button type="primary" @click="updateAppHandler(scope.row)" :icon="Edit" />
        </div>
        <div v-else>
          <el-button :disabled="[1, 10].indexOf(scope.row.type) == -1" type="success" @click="addApp(scope.row)">+
          </el-button>
        </div>
      </template></el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination background :current-page="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit"
      layout="total, sizes, prev, pager, next, jumper" :total="total" :loading="loading" @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
  <el-dialog v-model="displayDialog" :title="dialogMode" width="29%" center draggable top="30vh" append-to-body>
    <div v-if="!appMetaForm">
      无应用信息
    </div>
    <div v-else>
      <el-input v-model="appMetaForm.region" class="filter-x" clearable style="width: 150px;" placeholder="region" />
      <el-input v-model="appMetaForm.path" class="filter-x" clearable style="width: 150px;" placeholder="path" />
    </div>
    <template #footer>
      <span class="footer">
        <el-button @click="displayDialog = false">{{ $t('login.cancel') }}</el-button>
        <el-button type="primary" @click="confirmAdd">{{ $t('login.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>

</template>
<script lang="ts" setup>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  InfoFilled,
} from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';
import { useStore } from '@/store';
import { getApps, getAppSpec, createApp, deleteApp } from '@/api/api';
import { AppMeta } from '@/app-model';
import { ElNotification } from 'element-plus';
const store = useStore()
const loading = ref(false)
const total = ref(0)
const listStar = ref<AppMeta[]>([])
const listPlatform = ref<AppMeta[]>([])
const listQuery = ref({
  page: 1,
  offset: 0,
  limit: 10,
  field_lk_app__name: '',
  field_lk_app__title: '',
  order_by: 'id',
  // field_eq_app__published
  label: "生物医药",
})
const appMetaForm = ref<AppMeta>()
const displayDialog = ref(false)
const dialogMode = ref<'Add' | 'Edit'>()
const getList = async () => {
  loading.value = true
  let ret = await getApps({ direct: true, ...listQuery.value })
  loading.value = false
  console.log(ret)
  if (!ret) {
    return
  }
  total.value = ret.total || 0
  listStar.value = ret.spec
  listStar.value.forEach((item, index) => {
    let pIndex = listPlatform.value.findIndex((appi) => appi.name === item.name)
    if (pIndex !== -1) {
      listStar.value[index] = listPlatform.value[pIndex]
    }
  })
}
const handleSizeChange = (val: number) => {
  listQuery.value.limit = val
  getList()
}
const handleCurrentChange = (val: number) => {
  listQuery.value.page = val
  getList()
}

const getPlatformApps = async () => {
  loading.value = true
  let ret = await getApps()
  loading.value = false
  console.log(ret)
  if (!ret) {
    return
  }
  listPlatform.value = ret.spec
}
const handleClick = () => {
  store.commit("increment")
  console.log(store.state.count)
}
const itemInPlatfrom = (item: AppMeta) => {
  return listPlatform.value.findIndex((appi) => appi.name === item.name) !== -1
}
const addApp = (item: AppMeta) => {
  appMetaForm.value = item
  dialogMode.value = 'Add'
  displayDialog.value = true
}
const confirmDialog = () => {
  if (dialogMode.value === 'Add') {
    confirmAdd()
  } else if (dialogMode.value === 'Edit') {
    confirmUpdateApp()
  }
}
const confirmAdd = async () => {
  // get App Verbose
  if (!appMetaForm.value) {
    throw new Error("no app data!")
  }
  loading.value = true
  let retApp = await getAppSpec(appMetaForm.value.name).catch(err => {
    ElNotification.error(err)
  })
  loading.value = false
  if (!retApp) {
    return
  }
  let retApp2 = await createApp(retApp).catch(err => {
    console.log(err)
    ElNotification.error(err.data?.info || err)
  })
  console.log(retApp2)
  if (!retApp2) {
    return
  }
  ElNotification.success("添加成功")
  // 成功添加
  listPlatform.value.push(appMetaForm.value)
  displayDialog.value = false
}
const deleteAppHandler = async (item: AppMeta) => {
  if (!item.id) {
    console.log('No App Id')
    return
  }
  const ret = await deleteApp(item.id)
  console.log(ret)
}

const updateAppHandler = (item: AppMeta) => {
  appMetaForm.value = item
  dialogMode.value = 'Edit'
  displayDialog.value = true
}

const confirmUpdateApp = async () => {
  // get App Verbose
  if (!appMetaForm.value) {
    throw new Error("no app data!")
  }
  loading.value = true
  let retApp = await getAppSpec(appMetaForm.value.name).catch(err => {
    ElNotification.error(err)
  })
  loading.value = false
  if (!retApp) {
    return
  }
  let retApp2 = await createApp(retApp).catch(err => {
    console.log(err)
    ElNotification.error(err.data?.info || err)
  })
  console.log(retApp2)
  if (!retApp2) {
    return
  }
  ElNotification.success("添加成功")
  // 成功添加
  listPlatform.value.push(appMetaForm.value)
  displayDialog.value = false
}

onMounted(async () => {
  await getPlatformApps()
  getList()
})
</script>