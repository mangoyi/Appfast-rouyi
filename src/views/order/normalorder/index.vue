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
      <el-form-item label="应用" prop="customerAppId">
        <el-input
          v-model="queryParams.customerAppId"
          placeholder="请输入订单关联的应用"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="国家地区" prop="area">
        <el-input
          v-model="queryParams.area"
          placeholder="请输入国家地区"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单开始日期" prop="beginDate">
        <el-date-picker clearable
          v-model="queryParams.beginDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择订单开始日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单结束日期" prop="endDate">
        <el-date-picker clearable
          v-model="queryParams.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择订单结束日期">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="订单总天数" prop="orderTotalDays">
        <el-input
          v-model="queryParams.orderTotalDays"
          placeholder="请输入订单总天数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="订单状态" prop="score">
        <el-input
          v-model="queryParams.score"
          placeholder="请输入订单状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['normal:order:add']"
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
          v-hasPermi="['normal:order:edit']"
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
          v-hasPermi="['normal:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['normal:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键 id" align="center" prop="id"  v-if="false"/>
      <el-table-column label="用户id" align="center" prop="userId" v-if="$auth.hasPermi('system:user:list')"/>
      <!-- <el-table-column label="应用id" align="center" prop="customerAppId" /> -->
      <el-table-column label="应用名称" align="center" prop="appName" />
      <el-table-column label="应用id" align="center" prop="appId" />
      <el-table-column label="订单类型" align="center" prop="orderType" > 
        <template slot-scope="scope">
          <dict-tag :options="dict.type.order_type" :value="scope.row.orderType"/>
        </template>
      </el-table-column >
      <!-- <el-table-column label="商店类型" align="center" prop="storeType" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.store_type" :value="scope.row.storeType"/>
        </template>
      </el-table-column > -->

      <el-table-column label="下单时间" align="center" prop="beginDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d} {hh}-{mm}-{s} ') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="国家地区" align="center" prop="area" /> -->
      <el-table-column label="订单开始日期" align="center" prop="beginDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.beginDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单结束日期" align="center" prop="endDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="订单总天数" align="center" prop="orderTotalDays" /> -->
      <el-table-column label="订单状态" align="center" prop="orderStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.order_status" :value="scope.row.orderStatus"/>
        </template>
      </el-table-column >
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['normal:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['normal:order:remove']"
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

    <!-- 添加或修改客户普通订单记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
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
        <el-form-item label="应用id" prop="customerAppId">
          <el-input v-model="form.customerAppId" placeholder="请输入订单关联的应用id" />
        </el-form-item>
        <el-form-item label="任务类型" prop="orderType">
          <el-select v-model="queryParams.orderType" placeholder="全部" clearable>
            <el-option
              v-for="dict in dict.type.normal_order_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用id" prop="appId">
          <el-input v-model="form.appId" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="国家地区" prop="area">
          <el-input v-model="form.area" placeholder="请输入国家地区" />
        </el-form-item>
        <el-form-item label="订单开始日期" prop="beginDate">
          <el-date-picker clearable
            v-model="form.beginDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择订单开始日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单结束日期" prop="endDate">
          <el-date-picker clearable
            v-model="form.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择订单结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单总天数" prop="orderTotalDays">
          <el-input v-model="form.orderTotalDays" placeholder="请输入订单总天数" />
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-input v-model="form.orderStatus" placeholder="请输入订单状态" />
        </el-form-item>
        <el-form-item label="删除标志" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入删除标志" />
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
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/order/normalorder"
import googleSrc from '@/assets/logo/gp.png'
import appleIcon from '@/assets/logo/as.png'

// 1. 导入获取用户列表的API
import { queryUserList } from "@/api/system/user"
import auth from '@/plugins/auth'

export default {
  name: "Order",
  dicts: ['store_type','normal_order_type','order_status','order_type'],
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
      // 客户普通订单记录表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        customerAppId: null,
        orderType: null,
        storeType: null,
        appId: null,
        area: null,
        beginDate: null,
        endDate: null,
        orderTotalDays: null,
        orderStatus: null,
        score: null,
      },
      // 用户下拉查询参数
      userQueryParams: {
        pageNum: 1,
        pageSize: 10,
        idOrName: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderType: [
          { required: true, message: "订单类型不能为空", trigger: "blur" }
        ],
        storeType: [
          { required: true, message: "商店类型不能为空", trigger: "blur" }
        ],
        appId: [
          { required: true, message: "app_id/bundle_id不能为空", trigger: "blur" }
        ],
        beginDate: [
          { required: true, message: "开始日期不能为空", trigger: "blur" }
        ],
        endDate: [
          { required: true, message: "结束日期不能为空", trigger: "blur" }
        ],
        orderTotalDays: [
          { required: true, message: "总天数不能为空", trigger: "blur" }
        ],
        orderStatus: [
          { required: true, message: "订单状态不能为空", trigger: "change" }
        ],
        score: [
          { required: true, message: "订单状态不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getList()
     // 组件创建时加载用户列表数据
    if (auth.hasPermi('system:user:list')) {
      this.loadUserListOptions()
    }
  },
  methods: {
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
        '2': googleSrc          // 假设值2对应地球图标
      }
      return iconMap[value] || 'el-icon-help'  // 默认图标
    },
    // 获取商店类型对应的标签文本
    getStoreLabel(value) {
      const dict = this.dict.type.store_type.find(item => item.value === value);
      return dict ? dict.label : '';
    },
    /** 查询客户普通订单记录列表 */
    getList() {
      this.loading = true
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows
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
        customerAppId: null,
        orderType: null,
        storeType: null,
        appId: null,
        area: null,
        beginDate: null,
        endDate: null,
        orderTotalDays: null,
        orderStatus: null,
        score: null,
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
      this.title = "添加客户普通订单记录"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getOrder(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改客户普通订单记录"
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getList()
            })
          } else {
            addOrder(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除客户普通订单记录编号为"' + ids + '"的数据项？').then(function() {
        return delOrder(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('normal/order/export', {
        ...this.queryParams
      }, `order_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
