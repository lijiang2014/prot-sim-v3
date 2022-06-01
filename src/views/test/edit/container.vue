<template>
    <el-row v-for="(value, key) in tree">
        <el-col :span="value.config.width" :offset="value.config.offset" :class="{box:true,root:key==='root'}">
            <p>{{ key }}</p>
            <container :tree="value.children"></container>
        </el-col>
    </el-row>
</template>

<script setup lang="ts">
let porps = defineProps<{
    tree: any
}>()

</script>


<style lang="less" scoped>
.box {
    border: 1px solid #87cefa;
    border-radius:4px;
    padding: 10px 20px;
    margin: 10px 0;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    min-height: 160px;
}
</style>