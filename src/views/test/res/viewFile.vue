<template>
    <div>
        <div class="text">
            {{ textData }}
        </div>
        <el-pagination v-model:currentPage="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper"
            :total="total" @current-change="handleCurrentChange" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { getText } from '@/api/api'
let props = defineProps<{
    url: string
}>()
let currentPage = ref(1)
let textData = ref('')
let pageSize = ref(500)
let total = ref(0)
let getContent = async () => {
    let res = await getText(props.url, pageSize.value, currentPage.value).catch(err => console.log(err))
    console.log(res)
    if (!res) return
    textData.value = res.text
    total.value = res.total
}
onMounted(() => {
    currentPage.value = 1
    getContent()
})
watch(()=>props.url,()=>{
    currentPage.value = 1
    getContent()
})
let handleCurrentChange = (page: number) => {
    currentPage.value = page
    getContent()
}
</script>

<style lang="less" scoped>
.text {
    padding: 10px;
}
</style>