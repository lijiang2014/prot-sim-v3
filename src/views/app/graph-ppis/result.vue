<template>
  <!-- <template #jobmeta> -->
  <p>
  <div v-if="jobResult && jobResult.created_at">
    <span>ID:</span> <label>{{ jobResult.cluster_job_id }}</label><br />
    <span>App:</span> <label>{{ jobResult.app_name }}</label><br />
    <span>Job Name:</span> <label>{{ jobResult.name }}</label><br />
    <span>created_at:</span> <label>{{ jobResult.created_at }}</label><br />
    <span>started_at:</span> <label>{{ jobResult.started_at }}</label><br />
    <span>end_at:</span> <label>{{ jobResult.end_at }}</label><br />
    <span>status:</span> <label>{{ jobResult.status }}</label><br />
  </div>
  <div v-else>
    <h1>Job Name : {{ jobname }} , Index {{ jobIndex }}</h1>
    <h1>Graph PPIS result Example {{ store.state.count }} , init {{ count }}</h1>
    <p>Data is loading...</p>
  </div>
  <div v-if="jobResult?.outputs_raw">
    <div v-for="(item, index) in jobResult?.outputs_raw">
      Viewer of {{ index }} for {{ item }}
    </div>
  </div>
  </p>
  <!-- </template> -->
  <button @click="handleClick"> Add</button>
</template>
<script lang="ts" setup>
// JobID
import { ref, onMounted } from 'vue';
import { useStore } from '@/store';
import { useRoute } from "vue-router";
import { getJobResult } from "@/api/api";
import { result } from '@/app-model';
const $route = useRoute();
const store = useStore()
const count = ref(store.state.count)
const jobIndex = ref('example')
const jobname = ref('example')
const appname = ref('graph-ppis')
const jobResult = ref<result>()
if ($route.query.id) {
  jobIndex.value = $route.query.id as string
}
if ($route.query.app) {
  appname.value = $route.query.app as string
}

onMounted(async () => {
  const rest = await getJobResult(jobIndex.value).catch(err => {
    console.log(err)
  })
  if (!rest) {
    return
  }
  console.log(rest)
  jobResult.value = rest.spec
  if (rest.spec.outputs_raw) {
    // show datas
  }
  if (rest.spec.started_at) {
    // show job time infos
  }
})


const handleClick = () => {
  store.commit("increment")
  console.log(store.state.count)
}
</script>