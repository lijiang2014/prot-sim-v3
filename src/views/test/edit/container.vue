<template>
    <el-row>
        <el-col v-for="(value, key) in tree" :span="value.config.width" :offset="value.config.offset" class="box" @click.stop="boxClick(key)">
            <p>{{ value.config.label }}</p>
            <container :tree="value.children" @active-box-change="(id)=>emit('activeBoxChange',id)"></container>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
let porps = defineProps<{
    tree: any
}>()
let emit= defineEmits<{
    (e:'activeBoxChange',age1:any):void
}>()
let boxClick=(id:any)=>{
    emit('activeBoxChange',id)
}
</script>


<style lang="less" scoped>
.box {
    border: 1px solid #87cefa;
    border-radius:4px;
    padding: 10px 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 15px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    min-height: 160px;
}
</style>