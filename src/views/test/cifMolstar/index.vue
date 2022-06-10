<template>
  <div>
    <div class="viewerSection">
      <!-- Molstar container -->
      <el-row class="row">
        <el-col :span="12">
          <cif-viewer class="box"></cif-viewer>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.msp-plugin ::-webkit-scrollbar-thumb {
  background-color: #474748 !important;
}

.viewerSection {
  margin: 120px 0 0 50px;

  ::v-deep(.msp-image-preview img) {
    width: 100%;
    height: 100%;
  }
}

.box {
  // float: left;
  // width: 100%;
  // height: 100%;
  width: 500px;
  height: 500px;
  // position: relative;
}

.row {
  height: 500px;
}
</style>
