<template>
  <div style="padding-top: 40px">
    <el-row id="app_form_predict">
      <el-col :span="10" :offset="6">
        <h2 class="title">Protein Structure Similarity Search</h2>
        <!-- 提交 -->
        <el-form
          :model="state.ruleForm"
          :rules="state.rules"
          :ref="ruleFormRef"
          label-width="120px"
          class="demo-ruleForm"
          label-position="right"
        >
          <!-- 文件 -->
          <el-form-item label="Upload Files" prop="upload_file">
            <el-upload
              class="upload-demo"
              :ref="uploadRef"
              action="string"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :file-list="state.fileList"
              :auto-upload="false"
              :multiple="state.multiple"
              :limit="state.limit"
              :accept="state.accept"
            >
              <el-button
                slot="trigger"
                size="small"
                type="primary"
                @click="selectPdbFiles"
                >Select Files</el-button
              >

              <el-button
                style="margin-left: 10px"
                size="small"
                type="success"
                slot="trigger"
                @click="selectZip"
                >Select File (.zip)</el-button
              >
              <div slot="tip" class="el-upload__tip" style="line-height: 1.3">
                Protein structure files in
                <span class="p_em">.bcif, .pdb, .cif</span> format ( compression
                in <span class="p_em">.gz</span> is also supported ) <br />
                or packaging in a single <span class="p_em">.zip</span> file.
              </div>
            </el-upload>
          </el-form-item>
          <!-- 程序选择 -->
          <el-form-item>
            <!-- <div style="margin: 15px 0"></div> -->
            <el-checkbox
              :indeterminate="state.isIndeterminate"
              v-model="state.checkAll"
              @change="handleCheckAllChange"
              >All</el-checkbox
            >
            <el-checkbox-group
              v-model="state.checkedCities"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                v-for="city in state.cities"
                :label="city"
                :key="city"
                border
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <!-- 项目名 -->
          <el-form-item label="Job Name">
            <el-input v-model="state.ruleForm.job_name"></el-input>
          </el-form-item>
          <!-- email -->
          <!-- <el-form-item label="Email" prop="email">
            <el-input
              v-model="ruleForm.email"
              type="email"
              auto-complete="on"
            ></el-input>
          </el-form-item> -->

          <el-form-item>
            <el-button v-if="store.state.isLogin" type="primary" @click="submitForm('ruleForm')"
              >Submit</el-button
            >
            <el-button v-if="!store.state.isLogin" type="primary" disabled
              >Login To Use</el-button
            >
            <el-button @click="resetForm('ruleForm')">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang='ts' setup>
const cityOptions = ['TMalign']
import {useStore} from '@/store'
import { reactive, ref } from '@vue/reactivity'
let ruleFormRef=ref()
let uploadRef=ref()
let store=useStore()
let state= reactive({
      checkAll: false,
      checkedCities: ['TMalign'],
      cities: cityOptions,
      isIndeterminate: true,
      accept: '.pdb,.cif,.bcif,.pdb.gz,.cif.gz,.bcif.gz,',
      limit: 100,
      multiple: true,
      fileList: [],
      // children: similarityTable
      tableData: [],

      // children: ngl
      input: '',
      target: '',
      input_file: '',
      target_file: '', // PDB: 'data/pdb/','AlphaFold 2': 'alphafold',

      showResult: false,
      ruleForm: {
        job_name: 'test-SC',
        email: '',
      },
      rules: {
        job_name: [
          {
            // required: true,
            message: 'Please input a job name!',
            trigger: 'blur',
          },
          {
            min: 2,
            max: 20,
            message: 'length 2 to 20 characters',
            trigger: 'blur',
          },
          //   { validator: state.checkProName, trigger: 'blur' },
        ],

        email: [
          {
            type: 'email',
            message: 'please input valid email address!',
            trigger: 'change',
          },
        ],
      },
    })


  
  let  handleCheckAllChange=(val)=> {
      state.checkedCities = val ? cityOptions : []
      state.isIndeterminate = false
    }
   let handleCheckedCitiesChange=(value)=> {
      let checkedCount = value.length
      state.checkAll = checkedCount === state.cities.length
      state.isIndeterminate =
        checkedCount > 0 && checkedCount < state.cities.length
    }
    // 文件
    let handleRemove=(file, fileList) =>{
      console.log(file, fileList)
      state.fileList = fileList
    }
    let handlePreview=(file) =>{
      console.log(file)
    }

    let handleChange=(file, fileList) =>{
      state.fileList = fileList
    }

    // 自定义上传开关
    let submitForm= (formName) =>{
      let cur
      if(formName=='upload'){
        cur=uploadRef
      }else if(formName=='ruleForm'){
        cur=ruleFormRef
      }
      cur.value.validate((valid) => {
        if (valid) {
          state.upload_pdb()
        } else {
          state.$message.error('error input!')
          return false
        }
      })
    }

    let handleSuccess=(response, file, fileList) =>{
      console.log(response.msg)
      console.log(file)
      console.log(fileList)
    }

    //table发生改变
   let clickTableRow=(row)=> {
      state.input = row.input
      state.input_file = row.input_file
      state.target = row.target
      state.target_file = row.target_file
    }

    // 自定义上传方法
    let upload_pdb=()=> {
      console.log(state.fileList)
      if (state.fileList.length === 0) {
        return state.$message.error('Please select at least one file!')
      }
      const formData = new FormData()
      // 添加文件
      state.fileList.forEach((file) => {
        formData.append('file', file.raw)
      })
      // 添加自定义参数
      formData.append('job_name', state.ruleForm.job_name)
      formData.append('email', state.ruleForm.email)

      state.$http({
        url: 'api/similarity/upload_pdb/',
        method: 'POST',
        data: formData,
      }).then((res) => {
        // console.log(res)
        if (res.status == 200) {
          state.$message.success('Uploads Success!')
          state.tableData = res.data.data
          state.showResult = true

          state.input = state.tableData[0].input
          state.target = state.tableData[0].target
          state.input_file = state.tableData[0].input_file
          state.target_file = state.tableData[0].target_file

          if (state.tableData[0].source == 'PDB') {
            state.target_source = 'data/pdb/'
          } else {
            state.target_source = 'alphafold/'
          }

          console.log(state.tableData[0].input)
        } else {
          state.$message.error('Upload failed!')
        }
        state.fileList = []
      })
    }

    let resetForm=(formName) =>{
      if(formName=='upload'){
        uploadRef.value.resetFields()
      }else if(formName=='ruleForm'){
        ruleFormRef.value.resetFields()
      }
      uploadRef.value.clearFiles()
      state.tableData = []
      state.showResult = false
    }

    let selectZip=()=> {
      state.limit = 1
      state.multiple = false
      uploadRef.value.clearFiles()
      state.accept = '.zip'
    }
    let selectPdbFiles=()=> {
      state.multiple = true
      state.limit = 100
      state.accept = '.pdb,.cif,.bcif,.pdb.gz,.cif.gz,.bcif.gz,'
    }
    let checkProName= async (rule, value, callback) =>{
      const { data: res } = await state.$http.get('/predict/structure/check/', {
        params: { job_name: value },
      })

      if (res.isExist == 1) {
        return callback(new Error('Job name exists !'))
      } else {
        return callback()
      }
    }

    let get_token = async() =>{
      const { data: res } = await state.$http.get('get_token')

      window.sessionStorage.setItem('X-CSRFToken', res.token)
    }
  

</script>

<style lang="less" scoped>
.toggle_box {
  border: 1px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
}
.on_bottom {
  display: flex;
  align-items: flex-end;
}

.title {
  text-align: center;
}
.p_em {
  font-weight: bold;
}
</style>
