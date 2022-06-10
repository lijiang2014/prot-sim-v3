<template>
  <div class="view_region">
    <el-row class="panel_3d">
      <el-col>
        <el-row style="height: 100%;">
          <div class="view_3d" :id="boxId"></div>
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
import { useStore, UserType } from '@/store'

export default defineComponent({
  name: 'MolstarView',
  props: {
    src: String,
  },
  setup(props, ctx) {
    let boxId = ref('box' + Number(Math.random().toFixed(6)) * 1000000)
    const store = useStore()
    const ConvertToObjectUrl = (url: string, fileName: string) => {
      return new Promise<string>((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.open("GET", url, true)
        xhr.responseType = 'blob'
        if (store.state.user.type === UserType.StarlightUser) {
          xhr.setRequestHeader('Bihu-Token', store.state.user.token)
        } else if (store.state.user.type === UserType.EmailFreeUser) {
          xhr.setRequestHeader('Authorization', store.state.user.token)
        }
        xhr.onload = async function (res) {
          if (this.status === 200) {
            var type = xhr.getResponseHeader('Content-Type') || ""
            var blob = new Blob([this.response])
            console.log(blob)
            if (type === "application/json") {
              let txt = await blob.text().catch(err => {
                reject("下载文件失败" + err)
              })
              if (!txt) {
                return
              }
              try {
                let respData = JSON.parse(txt)
                if (respData && respData.code) {
                  reject("下载文件失败" + respData.info)
                  return
                }
              } catch (e) {
                console.log("Not Real Json File")
              }
            }
            var URL = window.URL || window.webkitURL
            var objectUrl = URL.createObjectURL(blob)
            resolve(objectUrl)
          }
        }
        xhr.send()
      })
    }

    const mountMolstar = async () => {
      let filename = props.src;
      filename = await ConvertToObjectUrl(props.src!, "test.pdb")
      // filename = "/ranked_0.pdb"
      console.log("new url", filename)
      var viewer = new molstar.Viewer(boxId.value, {
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
    onMounted(() => {
      nextTick(function () {
        setTimeout(() => mountMolstar())
      });
    })
    return {
      boxId
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

  :deep(.msp-plugin .msp-layout-expanded) {
    z-index: 9999
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
