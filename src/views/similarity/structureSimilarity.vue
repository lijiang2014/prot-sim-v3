<template>
  <div style="padding-top: 40px">
    <el-row id="app_form_predict">
      <el-col :span="10" :offset="6">
        <h2 class="title">Protein Structure Similarity Search</h2>
        <!-- 提交 -->
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef" label-width="120px" class="demo-ruleForm"
          label-position="right">
          <!-- 文件 -->
          <el-form-item label="Upload Files" prop="upload_file">
            <el-upload class="upload-demo" ref="uploadRef" action="#" :on-remove="handleRemove"
              :on-change="handleChange" :file-list="fileObj.fileList" :auto-upload="false" :multiple="fileObj.multiple"
              :limit="fileObj.limit" :accept="fileObj.accept">
              <template #trigger>
                <div class="upload_btn">
                  <el-button size="small" type="primary" @click="selectPdbFiles">
                    Select Files
                  </el-button>
                  <div class="white_content" @click.stop></div>
                  <el-button size="small" type="primary" @click="selectZip">
                    Select File (.zip)
                  </el-button>
                </div>
              </template>
              <template #tip>
                <div class="el-upload__tip">
                  Protein structure files in
                  <span class="p_em">.bcif, .pdb, .cif</span> format ( compression
                  in <span class="p_em">.gz</span> is also supported ) <br />
                  or packaging in a single <span class="p_em">.zip</span> file.
                </div>
              </template>
            </el-upload>
          </el-form-item>
          <!-- 程序选择 -->
          <el-form-item>
            <div>
              <el-checkbox :indeterminate="processObj.isIndeterminate" v-model="processObj.checkAll"
                @change="handleCheckAllChange">All</el-checkbox>
              <el-checkbox-group v-model="processObj.checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="city in processObj.cities" :label="city" :key="city" border>{{ city }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <!-- 项目名 -->
          <el-form-item label="Job Name" prop="job_name">
            <el-input v-model="ruleForm.job_name"></el-input>
          </el-form-item>
          <!-- email -->
          <el-form-item label="Email" prop="email">
            <el-input v-model="ruleForm.email" type="email"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button v-if="$store.state.isLogin" type="primary" @click="submitForm()">Summit</el-button>
            <el-button v-else type="primary" disabled>Login To Use</el-button>
            <el-button @click="resetForm()">Reset</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from "@/store"
import { reactive, ref } from "@vue/reactivity"
import http from '../../api/http'
import { ElMessage } from 'element-plus'
import { checkPredictStructureProjectName } from '@/api/api'
import type { UploadInstance, UploadFile, UploadFiles, FormInstance, FormRules } from 'element-plus'

let ruleFormRef = ref<FormInstance>();
let uploadRef = ref<UploadInstance>();
let $store = useStore();



//表单数据
let ruleForm = reactive({
  job_name: "test-SC",
  email: "",
})


//规则检查
let checkProName = async (rule: any, value: any, callback: any) => {
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
};
//规则检查
let rules = reactive({
  job_name: [
    {
      required: true,
      message: "Please input a job name!",
      trigger: "blur",
    },
    {
      min: 2,
      max: 20,
      message: "length 2 to 20 characters",
      trigger: "blur",
    },
    { validator: checkProName, trigger: 'blur' },
  ],
  email: [
    {
      required: true,
      message: "Please input email!",
      trigger: "blur",
    },
    {
      type: "email",
      message: "please input valid email address!",
      trigger: "blur",
    },
  ],
} as FormRules)

// 文件
let fileObj = reactive<{
  fileList: UploadFiles,
  multiple: boolean,
  limit: number,
  accept: string
}>({
  fileList: [],
  multiple: true,
  limit: 100,
  accept: ".pdb,.cif,.bcif,.pdb.gz,.cif.gz,.bcif.gz,",
})
let handleRemove = (file: UploadFile, fileList: UploadFiles) => {
  fileObj.fileList = fileList;
};

let handleChange = (file: UploadFile, fileList: UploadFiles) => {
  fileObj.fileList = fileList;
};

let selectZip = () => {
  fileObj.limit = 1;
  fileObj.multiple = false;
  uploadRef.value!.clearFiles();
  fileObj.accept = ".zip";
};
let selectPdbFiles = () => {
  fileObj.multiple = true;
  fileObj.limit = 100;
  fileObj.accept = ".pdb,.cif,.bcif,.pdb.gz,.cif.gz,.bcif.gz,";
};

//程序选择

let processObj = reactive({
  isIndeterminate: true,
  checkedCities: ["TMalign"],
  checkAll: false,
  cities: ["TMalign", 'test'],
})
let handleCheckAllChange = (val: boolean) => {
  processObj.checkedCities = val ? processObj.cities : [];
  processObj.isIndeterminate = false;
};
let handleCheckedCitiesChange = (value: string[]) => {
  let checkedCount = value.length;
  processObj.checkAll = checkedCount === processObj.cities.length;
  processObj.isIndeterminate =
    checkedCount > 0 && checkedCount < processObj.cities.length;
}


// 自定义上传开关
let submitForm = () => {
  ruleFormRef.value!.validate((isValid: boolean) => {
    if (isValid) {
      upload_pdb()
    } else {
      ElMessage.error("error input!")
    }
  })
}


// 自定义上传方法
let uploadObj = reactive({
  // children: similarityTable
  tableData: [],
  // children: ngl
  input: "",
  target: "",
  input_file: "",
  target_file: "", // PDB: 'data/pdb/','AlphaFold 2': 'alphafold',
  showResult: false,
});

let upload_pdb = () => {
  if (fileObj.fileList.length === 0) {
    return ElMessage.error("Please select at least one file!");
  }
  const formData = new FormData();
  // 添加文件
  fileObj.fileList.forEach((file) => {
    formData.append("file", file.raw!);
  });
  // 添加自定义参数
  formData.append("job_name", ruleForm.job_name);
  formData.append("email", ruleForm.email);
  fileObj.fileList = []
  uploadRef.value!.clearFiles();
  ElMessage.success("Uploads Success!");
  // http({
  //   url: "api/similarity/upload_pdb/",
  //   method: "POST",
  //   data: formData,
  // })
  //   .then((res: any) => {
  //     if (res.status == 200) {
  // ElMessage.success("Uploads Success!");
  // uploadObj.tableData = res.data.data;
  // uploadObj.showResult = true;

  // uploadObj.input = (uploadObj.tableData[0] as any).input;
  // uploadObj.target = (uploadObj.tableData[0] as any).target;
  // uploadObj.input_file = (uploadObj.tableData[0] as any).input_file;
  // uploadObj.target_file = (uploadObj.tableData[0] as any).target_file;

  // if ((uploadObj.tableData[0] as any).source == "PDB") {
  //   (uploadObj as any).target_source = "data/pdb/";
  // } else {
  //   (uploadObj as any).target_source = "alphafold/";
  // }
  //   } else {
  //     ElMessage.error("Upload failed!");
  //   }
  //   fileObj.fileList = [];
  // });
};

let resetForm = () => {
  uploadRef.value!.clearFiles();
  ruleFormRef.value!.resetFields();
  uploadObj.tableData = [];
  uploadObj.showResult = false;
};

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

.upload_btn {
  display: flex;
  justify-content: space-between;

  ::v-deep(.el-button) {
    margin-left: 0;
  }

  .white_content {
    width: 30px;
    cursor: default;
  }
}
</style>
