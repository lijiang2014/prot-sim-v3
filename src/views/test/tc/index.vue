<template>
  <div>
    <Dan-view
      :src='`/public/model_1.pdb`'
      boxId='id1'
    ></Dan-view>
  </div>
</template>

<script lang="ts" setup>
import DanView from "@/components/common/danView.vue";
import { useRoute } from "vue-router";
let $route=useRoute()
let proj_name = $route.query.proj_name
      ? $route.query.proj_name
      : 'Example'
let model_af = [
  "/ranked_0.pdb",
  "/ranked_1.pdb",
  "/ranked_2.pdb",
  "/ranked_3.pdb",
  "/ranked_4.pdb",
];
let af_link = {
  baseURL:
    "http://222.200.186.47/outputs/results/alphafold/" +
    proj_name +
    "/" +
    proj_name,
  outBase: "alphafold/",
  tar_suffix: "_alphafold.tar.gz",
};
</script>

<style></style>
