<template>
  <div class="list-head">
    <el-row justify="space-between">
      <el-col :span='2' class="head-left">
        <div>
          <div class="line"></div>
        </div>
        <div class="title">{{ title }}</div>
      </el-col>
      <el-col :span='8' class="head-right">
        <el-row :gutter="20">
          <el-col :span="6">
            <div v-if="store.state.user.isAdmin" class="flex-right">
              <el-button round size='small' class="view-all" @click="router.push({ name: 'appManager' })">+</el-button>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="flex-right">
              <el-button round size='small' class="view-all">{{ $t('table.viewAll') }}</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="flex-right">
              <el-button size='small' @click="emit('btnClick', -1)" class="btn">
                <el-icon>
                  <arrow-left-bold />
                </el-icon>
              </el-button>
              <el-button size='small' @click="emit('btnClick', 1)" class="btn">
                <el-icon>
                  <arrow-right-bold />
                </el-icon>
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts' setup>
import { useStore } from '@/store'
import { useRouter } from 'vue-router'

let store = useStore()
const router = useRouter()

defineProps<{ title: string }>()
let emit = defineEmits<{
  (e: 'btnClick', num: number): void
}>()
</script>
<style lang='less' scoped>
.list-head {
  height: 35px;
  line-height: 35px;
  margin-bottom: 30px;
}

.line {
  width: 3px;
  height: 35px;
  background-color: rgb(85, 2, 85);
}

.head-left {
  display: flex;
}

.head-right {
  .view-all {
    width: 100px;
    padding-right: 10px;
  }
}

.flex-right {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

.title {
  font-size: 20px;
  white-space: nowrap;
  padding-left: 20px;
}

.btn {
  width: 80%;
}
</style>
