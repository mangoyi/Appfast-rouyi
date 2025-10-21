<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户名" prop="userId" v-hasPermi="['system:user:list']">
        <el-select v-model="queryParams.userId" placeholder="请输入或选择用户"
                  filterable
                  remote
                  :remote-method="handleUserSearch"
                  :loading="userListLoading"
                  clearable
                  :style="{width: '100%'}">
          <el-option v-for="item in userListOptions" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="appName">
        <el-input
          v-model="queryParams.appName"
          placeholder="请输入名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商店" prop="storeType">
        <el-select v-model="queryParams.storeType" placeholder="全部" clearable>
          <el-option
            v-for="dict in dict.type.store_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          >
          <!-- 在选项文本前添加图标 -->
          <span>
            <img :src="getStoreIcon(dict.value)" style="width: 16px; height: 16px; margin-right: 8px;">
            {{ dict.label }}
          </span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
      <el-form-item style="float: right; margin-left: auto;"> 
               <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['customer:app:add']"
        >新增</el-button>
         <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['customer:app:edit']"
        >修改</el-button>
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['customer:app:remove']"
        >删除</el-button>
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['customer:app:export']"
        >导出</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['customer:app:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['customer:app:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['customer:app:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['customer:app:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row> -->

    <el-table v-loading="loading" :data="appList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" v-if="false"/>

      <el-table-column label="图标" align="center" prop="iconImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.iconImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center" prop="appName" />
      <el-table-column label="用户id" align="center" prop="userId" v-if="false"/>
      <el-table-column label="应用ID" align="center" prop="appId" />
      <el-table-column prop="storeType" label="商店">
           <template slot-scope="scope">
          <div style="display: flex; align-items: center;">
            <img :src="getStoreIcon(scope.row.storeType)" style="width: 24px; height: 24px; margin-right: 8px;"/>
            <dict-tag :options="dict.type.store_type" :value="scope.row.storeType"/>
          </div>
        </template>
      </el-table-column>


        <!-- <el-table-column label="描述" align="center" prop="appDescription"> -->
      <!-- <template slot-scope="scope">
        <el-tooltip placement="top" effect="dark">
          <div slot="content" :style="{maxWidth: '100%', wordBreak: 'break-all', padding: '8px'}">
            {{ scope.row.appDescription || '' }}
          </div>
          <div class="text-overflow" style="max-width: 150px; word-break: break-all;">{{ scope.row.appDescription && scope.row.appDescription.length > 10 ? scope.row.appDescription.substring(0, 10) + '...' : scope.row.appDescription || '' }}</div>
        </el-tooltip>
      </template>
    </el-table-column>     -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['customer:app:edit']"
          >修改</el-button> -->
          <el-button
            type="info"
            icon="el-icon-plus"
            size="mini"
            @click="goToCreateOrder"
            class="create-order-btn"
            title="新建订单"
          ></el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['customer:app:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改客户APP记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="userId"  v-hasPermi="['system:user:list']">
            <el-select v-model="form.userId" placeholder="请输入或选择用户"
                filterable
                remote
                :remote-method="handleUserSearch"
                :loading="userListLoading"
                clearable
                :style="{width: '100%'}">
              <el-option v-for="item in userListOptions" :key="item.value" :label="item.label"
                  :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商店" prop="storeType">
          <el-select v-model="form.storeType" placeholder="请选择" clearable>
            <el-option
              v-for="dict in dict.type.store_type"
              :key="dict.value"
              :value="dict.value"
              :label="dict.label"
            >
              <span style="display: inline-flex; align-items: center;">
                <img :src="getStoreIcon(dict.value)" style="width: 16px; height: 16px; margin-right: 8px;">
                {{ dict.label }}
              </span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区" prop="area">
        <el-select v-model="form.area" clearable>
          <el-option
            v-for="dict in dict.type.country_area"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="应用ID" prop="appId">
          <el-input v-model="form.appId" :placeholder="getAppIdPlaceholder()" />
          <el-button type="primary" icon="el-icon-search" @click="searchAppInfo" style="margin-left: 10px">搜索</el-button>
        </el-form-item>
        <el-form-item label="名称" prop="appName">
          <el-input v-model="form.appName" placeholder="请输入名称" />
        </el-form-item>
        <!-- <el-form-item label="描述" prop="appDescription">
          <el-input v-model="form.appDescription" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
        <el-form-item label="图标" prop="iconImage">
          <image-upload v-model="form.iconImage"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listApp, getApp, delApp, addApp, updateApp, outerAppQuery } from "@/api/appkeyword/app"
import googleSrc from '@/assets/logo/gp.png'
import appleIcon from '@/assets/logo/as.png'

// 1. 导入获取用户列表的API
import { queryUserList } from "@/api/system/user"
import auth from '@/plugins/auth'

export default {
  name: "App",
  dicts: ['store_type', 'country_area'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 用户列表数据加载状态
      userListOptions: [],
      userListLoading: false,
      searchTimer: null,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户APP记录表格数据
      appList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        appId: null,
        storeType: null,
        appName: null,
        // appDescription: null,
        // iconImage: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: auth.hasPermi('system:user:list'), message: "用户id不能为空", trigger: "blur" }
        ],
        appId: [
          { required: true, message: "app.id or bundle.id can not be null", trigger: "blur" }
        ],
        storeType: [
          { required: true, message: "商店不能为空", trigger: "blur" }
        ],
        appName: [
          { required: true, message: "名称不能为空", trigger: "blur" }
        ]
        // appDescription: [
        //   { required: true, message: "描述不能为空", trigger: "blur" }
        // ]
      }
    }
  },
  created() {
    this.getList()
         // 组件创建时加载用户列表数据
    // 用户没有权限时，不执行获取用户列表数据
    if (auth.hasPermi('system:user:list')) {
    this.loadUserListOptions()
    }
  },
  methods: {

    getAppIdPlaceholder() {
      if (this.form.storeType === null || this.form.storeType === '') {
        return 'please select store type';
      }
      return this.form.storeType === '2' ? 'please input bundle.id' : 'please input app id';
    },
    // 处理用户搜索
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
  // 获取商店类型对应的图标
    getStoreIcon(value) {
      // 根据实际业务值调整图标映射关系
      const iconMap = {
        '1': appleIcon,         // 假设值1对应手机图标
        '2': googleSrc,           // 假设值2对应地球图标
        '3': appleIcon        // 假设值1对应手机图标

      }
      return iconMap[value] || 'el-icon-help'  // 默认图标
    },
     // 获取商店类型对应的标签文本
    getStoreLabel(value) {
      const dict = this.dict.type.store_type.find(item => item.value === value);
      return dict ? dict.label : '';
    },
    /** 查询客户APP记录列表 */
    getList() {
      this.loading = true
      listApp(this.queryParams).then(response => {
        this.appList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        appId: null,
        storeType: null,
        appName: null,
        appDescription: null,
        iconImage: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      }
      this.resetForm("form")
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = "添加客户APP记录"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getApp(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改客户APP记录"
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateApp(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addApp(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除客户APP记录编号为"' + ids + '"的数据项？').then(function() {
        return delApp(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('customer/app/export', {
        ...this.queryParams
      }, `app_${new Date().getTime()}.xlsx`)
    },
    searchAppInfo() {
      // 验证商店类型
      if (!this.form.storeType) {
        this.$modal.msgWarning("choose store");
        return;
      }

      // 验证app_id是否为空
      if (!this.form.appId) {
        this.$modal.msgWarning("请输入app_id");
        return;
      }

      const query = {
        id: this.form.appId,
        storeType: this.form.storeType,
        area: this.form.area
      };
      // 调用服务端接口查询应用信息
      outerAppQuery(query).then(response => {
      if (response.code == 200) {
        if(response.appinfo != null){
          const appInfo = response.appinfo;
          // 将查询结果填充到appName中
          this.form.appName = appInfo.appName;
          this.form.iconImage = appInfo.iconImageUrl;

          this.$modal.msgSuccess("search success. Auto fill app info.");
        } else {
          this.$modal.msgInfo(response.error);
          // 清空已有的名称，避免显示旧数据
          this.form.appName = '';
          this.form.iconImage = '';
        } 
      } 
      else {
          this.$modal.msgInfo(response.error);
        }
      }).catch(error => {
        this.$modal.msgError("query failed，please check appId or bundle.id");
      });
    },
      // 添加跳转到新建订单页面的方法
      goToCreateOrder() {
        //  alert('点击了卡片')
        this.$router.push('/promotion/createOrder')
      },
  }
}
</script>


<style>
/* 非scoped样式，用于覆盖Element UI的默认样式 */
.el-tooltip__popper {
  max-width: 50% !important; /* 限制最大宽度为父容器的90% */
  width: auto !important; /* 确保宽度自动适应内容 */
}
/* 非scoped样式，确保覆盖Element UI默认样式 */
.el-select-dropdown__item.selected {
  color: #303133 !important; /* 黑色字体 */
}

.el-select .el-input__inner {
  color: #303133; /* 确保输入框内文字为黑色 */
}

/* 非scoped样式，用于覆盖Element UI的默认样式 */
.el-select-dropdown__item.selected {
  color: #303133 !important;
}
.el-select .el-input__inner {
  color: #303133;
}
/* 修复可能的文字重影问题 */
.el-select .el-tag {
  background-color: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

/* 新建订单按钮样式 */
.create-order-btn {
  transition: all 0.3s ease;
  color: blue;
  background-color: white;
}

.create-order-btn:hover {
  transform: scale(1.1);
  background-color: lightblue;
}
</style>
