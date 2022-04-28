<template>
  <div class="view_region">
    <el-row class="panel_3d">
      <el-col :span="8">
        <el-row>
          <div :key="boxId" class="view_3d" :id="boxId"></div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import { Viewer } from "molstar";
// import { Viewer } from "molstar/build/viewer/molstar";
// import "molstar/build/viewer/molstar.css";

export default {
  props: [ "src", "boxId"],

  mounted() {
    this.$nextTick(function () {
      this.molstar();
    });
  },

  methods: {
    molstar() {
      let filename = this.src;
      var viewer = new molstar.Viewer(this.boxId, {
        layoutIsExpanded: false,
        layoutShowControls: false,
        layoutShowRemoteState: false,
        layoutShowSequence: false,
        layoutShowLog: false,
        layoutShowLeftPanel: false,

        viewportShowExpand: false,
        viewportShowSettings: false,
        // ViewportShowControl: false,
        viewportShowSelectionMode: false,
        viewportShowAnimation: false,
      });
      viewer.loadStructureFromUrl(filename, "pdb");
    },
  },
};
</script>

<style lang="less" scoped>
.view_region {
  padding-top: 20px;
  .title {
    display: flex;
    text-align: center;
    justify-content: left;
  }
}
.panel_3d {
  padding-top: 0px;
  margin-top: 0px;
}

.el-tabs--border-card > .el-tabs__content {
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
  height: 450px;
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
