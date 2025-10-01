
<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="300px">
      <el-form-item label-width="100px" label="单选框组" prop="field101">
        <el-radio-group v-model="formData.field101" size="medium">
          <el-radio-button v-for="(item, index) in field101Options" :key="index" :label="item.value"
            :disabled="item.disabled" border>{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="20">
          <el-form-item label="应用商店" prop="appType">
            <el-radio-group v-model="formData.appType" size="medium">
              <el-radio-button v-for="(item, index) in appTypeOptions" :key="index" :label="item.value"
                :disabled="item.disabled">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应用" prop="appName">
            <el-select v-model="formData.appName" filterable :style="{width: '30%'}"></el-select>
          </el-form-item>
          <el-form-item label="用户名" prop="userId">
            <el-select v-model="formData.userId" placeholder="请输入或选择用户" 
                  filterable 
                  remote 
                  :remote-method="handleUserSearch"
                  :loading="userListLoading"
                  clearable
                  :style="{width: '30%'}">
            <el-option v-for="item in userListOptions" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="国家/地区" prop="country">
            <el-select v-model="formData.country" placeholder="请选择国家/地区" multiple filterable clearable
              :style="{width: '30%'}"></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="订单时间" prop="orderDate">
            <el-date-picker type="daterange" v-model="formData.orderDate" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" :style="{width: '50%'}" start-placeholder="开始日期"
              end-placeholder="结束日期" range-separator="至" clearable></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>

// 1. 导入获取用户列表的API
import { queryUserList } from "@/api/system/user"

export default {
  components: {},
  props: [],
  data() {
    return {
      // 用户列表数据加载状态
      userListOptions: [],
      userListLoading: false,
      searchTimer: null,
        // 用户下拉查询参数
      userQueryParams: {
        pageNum: 1,
        pageSize: 10,
        idOrName: null,
      },
      formData: {
        appType: 1,
        appName: undefined,
        country: [],
        orderDate: null,
        field101: 1,
      },
      rules: {
        appType: [{
          required: true,
          message: '应用商店不能为空',
          trigger: 'change'
        }],
        appName: [{
          required: true,
          message: '',
          trigger: 'change'
        }],
        country: [{
          required: true,
          type: 'array',
          message: '请至少选择一个country',
          trigger: 'change'
        }],
        orderDate: [{
          required: true,
          message: '订单时间不能为空',
          trigger: 'change'
        }],
        field101: [{
          required: true,
          message: '单选框组不能为空',
          trigger: 'change'
        }],
      },
      field101Options: [{
        "label": "关键词安装",
        "value": 1
      }, {
        "label": "下载量",
        "value": 2
      }, {
        "label": "评分",
        "value": 3
      }, {
        "label": "评论",
        "value": 4
      }, {
        "label": "关键词保排名服务",
        "value": 5
      }, {
        "label": "关键词覆盖服务",
        "value": 6
      }],
      appTypeOptions: [{
        "label": "AppStore",
        "value": 1
      }, {
        "label": "Google Play",
        "value": 2
      }],
    }
  },
  computed: {},
  watch: {},
  created() {
    // 组件创建时加载用户列表数据
    this.loadUserListOptions()
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        // TODO 提交表单
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
    },
        handleUserSearch(query) {
      // console.log('用户搜索...',query);
      // 清除之前的定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }
      
      // 设置防抖，300毫秒后执行搜索
      this.searchTimer = setTimeout(() => {
        this.loadUserListOptions(query);
      }, 300);
    },
    // 加载用户列表选项
    loadUserListOptions(inputParam) {
      // console.log('加载用户列表选项...',inputParam);
      this.userListLoading = true;
      
      // 构建查询参数，根据是否有输入值决定传参
      const queryParams = {};
      if (inputParam) {
        // 有输入值时，传递搜索参数（根据实际API调整字段名）
        queryParams.idOrName = inputParam;
        queryParams.pageNum = 1;
        queryParams.pageSize = 100; // 一次获取足够多的选项
      }
      
      // 调用用户列表API
      queryUserList(queryParams).then(response => {
        // console.log('用户列表参数:', queryParams);
        // console.log('用户列表响应:', response); // 添加日志以便调试
        const users = response.rows || response.data || [];
        // 转换为select组件需要的格式
        this.userListOptions = users.map(user => ({
          label: user.nickName || user.userName || user.userId,
          value: user.userId
        }));
      }).catch(error => {
        console.error('获取用户列表失败:', error);
        this.userListOptions = [];
      }).finally(() => {
        this.userListLoading = false;
      });
    },
  }
}

</script>
<style>
</style>
