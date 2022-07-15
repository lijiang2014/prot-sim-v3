<template>
  <!-- <h1>Saguaro </h1> -->
  <div v-if="loading">Data is loading ...</div>
  <div id="pfv" class="pfv"></div>
  <!-- <button @click="handleClick"> Add</button> -->
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useStore } from '@/store';
import { RcsbFv, RcsbFvDisplayTypes, RcsbFvTrackDataElementInterface } from '@rcsb/rcsb-saguaro';
import type { RcsbFvRowConfigInterface } from '@rcsb/rcsb-saguaro';
import { downloadStream } from '@/api/api';

let props = withDefaults(defineProps<{
  url: string, // 文件源
  label: string, // 属性 
  threshold: number
}>(), {
  // url: "http://10.127.48.27:8000/storage/download?&sha1=d14e6aa72be80d75ebbd973786af584f7425156b&dir=output&ext=.txt",
  label: "PROB",
  threshold: 0.24
})
let loading = ref(false)
let errMsg = ref("")

const htmlElementId = "pfv"

const dataTxt = `The threshold of the predictive score to determine PPI sites is set to 0.24.
AA	Prob	Pred
E	0.3167	1
V	0.1452	0
Q	0.1845	0
L	0.0272	0
V	0.0974	0
Q	0.0555	0
S	0.0589	0
G	0.0525	0
A	0.039	0
E	0.0199	0
V	0.0318	0
K	0.0342	0
K	0.0576	0
P	0.0411	0
G	0.0235	0
S	0.0274	0
S	0.0287	0
V	0.0039	0
K	0.0503	0
V	0.0037	0
S	0.0383	0
C	0.0043	0
K	0.0989	0
A	0.0169	0
S	0.093	0
G	0.0655	0
G	0.1045	0
T	0.0905	0
F	0.0894	0
S	0.2877	1
S	0.5653	1
Y	0.4322	1
G	0.0424	0
I	0.0379	0
S	0.1069	0
W	0.027	0
V	0.0237	0
R	0.1015	0
Q	0.1917	0
A	0.08	0
P	0.2219	0
G	0.2399	0
L	0.2212	0
G	0.2884	1
L	0.3152	1
E	0.2246	0
W	0.4676	1
M	0.0462	0
G	0.0226	0
G	0.0409	0
V	0.0929	0
I	0.0557	0
P	0.3041	1
I	0.5872	1
L	0.6264	1
S	0.4612	1
A	0.5264	1
K	0.4892	1
H	0.4084	1
Y	0.3027	1
A	0.1972	0
Q	0.2602	1
R	0.3468	1
F	0.0735	0
Q	0.2651	1
G	0.1311	0
R	0.0814	0
V	0.0312	0
T	0.0728	0
I	0.0073	0
T	0.0839	0
A	0.1329	0
D	0.118	0
K	0.2246	0
S	0.1662	0
T	0.1083	0
G	0.0584	0
T	0.0488	0
A	0.0142	0
Y	0.0887	0
M	0.0112	0
E	0.0459	0
L	0.0043	0
S	0`

const resoveTxt = (dataTxt: string): [string, RcsbFvTrackDataElementInterface[], number] => {
  const commentLineCount = 1
  const titleLineCount = 1
  const lines = dataTxt.split('\n')
  if (lines.length <= commentLineCount + titleLineCount) {
    throw new Error("Not a excepted file format [C T D]")
  }
  const comment = lines.shift()
  let endWord = comment?.split(' ').pop()
  let threshold = endWord ? parseFloat(endWord) : props.threshold
  const titles = lines.shift()?.split('\t')
  let sequence = ''
  let probs: RcsbFvTrackDataElementInterface[] = []
  if (titles?.length === 3 && titles[0] === 'AA' && titles[1] === 'Prob') {
    lines.forEach((line, index) => {
      if (line === "") {
        return
      }
      let [AA, Prob, Pred] = line.split('\t')
      sequence += AA
      let value = parseFloat(Prob)
      probs.push({
        value,
        begin: index + 1,
        // color: value > threshold ? "#8484FF" : "#FF8484",
      })
    })
    return [sequence, probs, threshold]
  }
  throw new Error("Not a excepted file format [A P P]")
}

const render = async () => {
  loading.value = true
  let blob = await downloadStream(props.url).catch(err => {
    errMsg.value = "读取数据出错" + err
  })
  if (!blob) {
    loading.value = false
    return
  }
  let text = await blob.text().catch(err => {
    errMsg.value = "读取数据出错" + err
  })
  loading.value = false
  console.log("text", text)
  if (!text) {
    return
  }
  // let [seq, Dprops] = resoveTxt(dataTxt)
  let [seq, Dprops, threshold] = resoveTxt(text)
  console.log(Dprops)
  const sequenceTrack: RcsbFvRowConfigInterface = {
    trackId: "sequenceTrack",
    trackHeight: 20,
    trackColor: "#F9F9F9",
    displayType: "sequence" as RcsbFvDisplayTypes,
    // displayType: RcsbFvDisplayTypes.SEQUENCE,
    rowTitle: "SEQUENCE",
    trackData: [{
      begin: 1,
      // value: sequence
      value: seq
    }]
  }
  const ppisTrack: RcsbFvRowConfigInterface = {
    trackId: "ppisTrack",
    displayType: "area" as RcsbFvDisplayTypes,
    displayColor: {
      "thresholds": [threshold],
      "colors": ["#8484FF", "#FF8484"]
    },
    rowTitle: props.label,
    trackHeight: 80,
    // minRatio: 0.01,
    trackData: Dprops,
  }
  const boardConfig = {
    range: {
      min: 0,
      max: seq.length,
    },
    // trackWidth: 840,
    // rowTitleWidth: 120,
    includeAxis: true
  };

  const pfv = new RcsbFv({
    boardConfigData: boardConfig,
    // rowConfigData: [sequenceTrack, blockTrack],
    rowConfigData: [sequenceTrack, ppisTrack],
    elementId: htmlElementId,
  });
}
onMounted(() => {
  render();
});

</script>
<style lang="less" scoped>
.pfv {
  width: 1085px;
  overflow: scroll;
}
</style>