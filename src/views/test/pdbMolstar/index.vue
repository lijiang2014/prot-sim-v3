<template>
  <div>
    <h1>pdbe Molstar</h1>
    <h4>PDBe Mol* AlphaFold Demo</h4>
    <div class="viewerSection">
      <!-- Molstar container -->
      <el-row class="row">
        <el-col :span="12">
          <div id="myViewer"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "pdbe-molstar/build/pdbe-molstar-plugin-1.2.1";
import "molstar/build/viewer/molstar.css";
import { onMounted } from "@vue/runtime-core";

let pdbe = () => {
  //Create plugin instance
  let viewerInstance = new PDBeMolstarPlugin();

  //Set options (Checkout available options list in the documentation)
  let options = {
    customData: {
      url: "/AF-O15552-F1-model_v1.cif",
      format: "cif",
    },
    alphafoldView: true,
    bgColor: { r: 255, g: 255, b: 255 },
    hideCanvasControls: [
    //   "selection",
    //   "animation",
    //   "controlToggle",
    //   "controlInfo",
    ],
  };

  //Get element from HTML/Template to place the viewer
  let viewerContainer = document.getElementById("myViewer");

  //Call render method to display the 3D view
  viewerInstance.render(viewerContainer, options);
};

onMounted(() => {
  pdbe();
});
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
#myViewer {
  float: left;
  width: 100%;
  height: 100%;
  /* width: 500px; */
  /* height: 500px; */
  position: relative;
}
.row {
  height: 500px;
}
</style>
