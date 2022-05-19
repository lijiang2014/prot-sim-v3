<template>
  <div class="view_region" @click="viewClick" ref="viewRef">
    <el-row class="panel_3d">
      <el-col>
        <el-row style="height: 100%;">
          <div :key="boxId" class="view_3d" :id="boxId"></div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" >
// import { Viewer } from "molstar";
// import { Viewer } from "molstar/build/viewer/molstar";
// import "molstar/build/viewer/molstar.css";
import { nextTick, defineComponent, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'MolstarView',
  props: {
    src: String,
    boxId: String,
  },
  setup(props, ctx) {
    let viewRef=ref()
    const mountMolstar = () => {
      let filename = props.src;
      var viewer = new molstar.Viewer(props.boxId, {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: false,
        layoutShowLog: false,
        layoutShowLeftPanel: false,

        // viewportShowExpand: false,
        viewportShowSettings: false,
        ViewportShowControl: false,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,
      });
      viewer.loadStructureFromUrl(filename, "pdb");
    }
    const viewClick = (e:any) => {
      // window.e = e
      for (let item of e.path) {
        if (item.tagName === 'BUTTON') {
          if (item.title === 'Toggle Expanded Viewport') {
            console.log('-0-0-0-0-', 'item.class')
            item.className.indexOf('msp-btn-link-toggle-off') !== -1 ?
              document.exitFullscreen() : viewRef.value.requestFullscreen()
          }
          break
        }
      }

    }
    onMounted(() => {
      nextTick(function () {
        mountMolstar();
      });
    })
    return {
      viewClick,viewRef
    }
  }
})
</script>

<style lang="less" scoped>
.view_region {
  height: 100%;

  .title {
    display: flex;
    text-align: center;
    justify-content: left;
  }
}

.panel_3d {
  padding-top: 0px;
  margin-top: 0px;
  height: 100%;
}

.el-tabs--border-card>.el-tabs__content {
  padding: 0px;
}

.el-tabs {
  padding: 0px;

  .content {
    height: 100%;
    width: 100%;
    padding: 0px;
  }
}

.view_3d {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 0;
  margin: 0;
}

.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
