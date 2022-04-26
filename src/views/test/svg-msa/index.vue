<template>
  <div>
    <div id="molstar_large"></div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted } from "@vue/runtime-core";
import { Viewer } from "molstar/build/viewer/molstar";
import "molstar/build/viewer/molstar.css";
let pdb = "http://222.200.186.47/outputs/testPDB/model_1.pdb";
let molstar = () => {
  nextTick(function () {
    let viewer = new Viewer("molstar_large", {
      layoutIsExpanded: false,
      layoutShowControls: true,
      layoutShowRemoteState: false,
      layoutShowSequence: true,
      layoutShowLog: false,
      layoutShowLeftPanel: true,

      viewportShowExpand: false,
      viewportShowSelectionMode: false,
      viewportShowAnimation: true,
    });
    console.log(viewer);
    // window.viewer = Viewer;
    // window.dizhi = pdb;
    console.log(viewer.loadStructureFromUrl, pdb);
    viewer.loadStructureFromUrl("/model_1.pdb", "pdb");
    // viewer.loadPdb("7bv2");
  });
};

onMounted(() => {
  molstar();
});
</script>

<style scoped>
#molstar_large {
  width: 100%;
  height: 100%;
}
#molstar_large>div{
    top:0
}
</style>
