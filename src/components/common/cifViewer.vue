<template>
  <div class="viewerSection">
    <div id="myViewer"></div>
  </div>
</template>

<script lang="ts" setup>
import { ConvertToObjectUrl } from "@/api/api";
import { onMounted } from "vue";
let props = withDefaults(defineProps<{
  url: string,
  format: string,
  innerRes: boolean,
}>(), {
  url: "/AF-O15552-F1-model_v1.cif",
  format: "cif",
  innerRes: false,
})

let pdbe = async () => {
  //Create plugin instance
  let viewerInstance = new PDBeMolstarPlugin();
  let url = props.url
  if (props.innerRes) {
    url = await ConvertToObjectUrl(url, "test.cif")
  }
  //Set options (Checkout available options list in the documentation)
  let options = {
    customData: {
      url: url,
      format: props.format,
    },
    alphafoldView: true,
    bgColor: { r: 255, g: 255, b: 255 },
    hideCanvasControls: [
      "selection",
      "animation",
      "controlToggle",
      "controlInfo",
    ],
  };

  //Get element from HTML/Template to place the viewer
  let viewerContainer = document.getElementById("myViewer");
  console.log("props", props)
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
  height: 500px;

  ::v-deep(.msp-image-preview img) {
    width: 100%;
    height: 100%;
  }
}

#myViewer {
  float: left;
  width: 100%;
  height: 100%;
  // width: 500px;
  // height: 500px;
  position: relative;
}
</style>
