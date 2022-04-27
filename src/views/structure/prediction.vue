<template>
<div style="padding-top: 40px">
    <el-row id="app_form_predict">
      <el-col :span="12" :offset="6">
        <h2 class="title">Structure Prediction</h2>
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="formRef"
          label-width="120px"
          class="demo-ruleForm"
          label-position="right"
        >
          <el-form-item prop="protein_seq">
            <span slot="label">
              <span class="span-box">
                <span>Input Sequence</span>
              </span>
            </span>

            <el-input
              type="textarea"
              v-model="ruleForm.protein_seq"
              :autosize="{ minRows: 4, maxRows: 20 }"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="Platform" prop="platform">
            <el-checkbox-group v-model="ruleForm.platform">
              <el-checkbox label="AlphaFold 2" checked></el-checkbox>
              <el-checkbox v-show="false" label="RoseTTAFold"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            class="toggle_box"
            label-width="180px"
            label="RoseTTAFold Mode:"
            prop="RoseTTAFold_mode"
            v-show="ruleForm.platform?.indexOf('RoseTTAFold') !== -1"
          >
            <el-radio v-model="ruleForm.RoseTTAFold_mode" label="pyrosetta"
              >pyrosetta</el-radio
            >
            <el-radio v-model="ruleForm.RoseTTAFold_mode" label="e2e"
              >End-to-End</el-radio
            >
          </el-form-item>

          <el-form-item label="Job Name" prop="proj_name">
            <el-input v-model="ruleForm.proj_name"></el-input>
          </el-form-item>

          <el-form-item label="Email" prop="email">
            <el-input
              v-model="ruleForm.email"
              type="email"
              auto-complete="on"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()" v-if="store.state.isLogin"
              >Submit</el-button
            >
            <el-button type="primary" disabled v-if="!store.state.isLogin"
              >login to use</el-button
            >
            <el-button @click="resetForm()">Reset</el-button>
            <el-button @click="ExampleFrom()">Example</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <el-dialog
      title="Warning: input sequence contain non-standard residues! Predition process may failed!"
      v-model="dialogVisible"
      width="40%"
    >
      <span v-html="newSeq"></span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, } from 'vue'
import { FormRules,ElMessage, FormInstance } from 'element-plus'
// import type { FormRules, FormInstance } from 'element-plus'
import { checkPredictStructureProjectName, submitPredictStruct } from '@/api/api'
import { colorSeq, structurePredictRequest  } from '@/app-model/structure'
import { useRouter } from 'vue-router'
import {useStore} from '@/store'
let store = useStore()
const $router = useRouter()
const dialogVisible = ref(false)
const newSeq = ref('')
const formRef = ref<FormInstance>()
const ruleForm = ref({
  proj_name: '',
  email: '',
  platform: [],
  protein_seq: '',
  RoseTTAFold_mode: 'pyrosetta',
} as structurePredictRequest )
const checkProName =  async (rule: any, value: string, callback: any) => {
  const res = await checkPredictStructureProjectName(value)
  console.log("res", res)
  if (!res) {
    return
  }
  if (res.isExist == 1) {
    return callback(new Error('Job name exists !'))
  } else {
    return callback()
  }
}
const checkStar = (rule: any, value: string, callback: any) => {
  const starMatch = /\*/
  if (starMatch.test(value)) {
      return callback(
        new Error("' * ' is not allowed in the input sequence!")
      )
    } else {
      let residues = value.split('')
      let res = colorSeq(value)
      if (res.count > 0) {
        console.log('odd residues:' + res.count)
        console.log(res.newseq)
        dialogVisible.value = true
        newSeq.value = res.newseq
      }
      return callback()
    }
}
const rules = ref({
  proj_name: [
    { required: true, message: 'Please input a job name!',trigger: 'blur',},
    { min: 3, max: 20,message: 'length 3 to 20 characters', trigger: 'blur',},
    { validator: checkProName, trigger: 'blur' },
  ],

  protein_seq: [
    { required: true, message: 'Please input protein sequence!',trigger: 'blur',},
    { validator: checkStar, trigger: 'blur' },
  ],
  // email: [ { type: 'email', message: 'please input valid email address!', trigger: 'change',},],
  platform: [ { type: 'array', required: true, message: 'Please select at least one platform', trigger: 'blur',},],
} as FormRules )
const getFormResponse = async () => {
  const res = await submitPredictStruct(ruleForm.value).catch(err => {
    console.log(err)
  })
  console.log(res)
  if (!res) {
    return
  }
  if (res.data.uploadOk) {
    $router.push('/predict/structure/queue/')
  } else {
    ElMessage.error( 'Your input Sequence may be wrong, please try check and try again!')
  }
}
const submitForm = () => {
  ruleForm.value.protein_seq = ruleForm.value.protein_seq.toString().trim()
  ruleForm.value.proj_name = ruleForm.value.proj_name.toString().trim()
  formRef.value?.validate((valid) => {
    if (valid) {
      getFormResponse()
    } else {
      return false
    }
  })
}
const resetForm = () => {
}
const ExampleFrom = () => {
}
</script>