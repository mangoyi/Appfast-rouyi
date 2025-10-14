<template>
  <div class="app-container">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
      <h2>消费记录</h2>
      <el-button
        type="warning"
        plain
        icon="el-icon-download"
        size="mini"
        @click="handleExport"
        v-hasPermi="['income:export']"
      >导出</el-button>
    </div>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="类型" prop="incomeType">
        <el-select
          v-model="queryParams.incomeType"
          placeholder="全部"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="dict in dict.type.income_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="queryParams.dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="costList" @selection-change="handleSelectionChange">

      <el-table-column label="订单编号 " align="center" prop="orderNo" width="200"/>
      <el-table-column label="应用名称 " align="center" prop="appName" />
      <el-table-column label="订单类型" align="center" prop="orderType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.order_type" :value="scope.row.orderType"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="商店类型" align="center" prop="storeType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.store_type" :value="scope.row.storeType"/>
        </template>
      </el-table-column> -->
      
      <el-table-column label="消费前金额" align="center" prop="oldBalance" />
      <el-table-column label="订单金额" align="center" prop="orderPrice" />
      <el-table-column label="消费后金额" align="center" prop="newBalance" />
      <!-- <el-table-column label="余额" align="center" prop="balance" /> -->
      <el-table-column label="支付时间" align="center" prop="payTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.payTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改收入支出记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入金额" />
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-input v-model="form.balance" placeholder="请输入余额" />
        </el-form-item>
        <el-form-item label="类型" prop="incomeType">
          <el-input v-model="form.incomeType" placeholder="请选择类型" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listIncome, getIncome } from "@/api/income/income"
import { costListOrder } from "@/api/order/normalorder"

export default {
  name: "Income",
  dicts: [ 'income_type', 'order_type', 'store_type'],

  data() {
    return {
      // 遮罩层
      loading: true,
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
      // 收入支出记录表格数据
      costList: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        amount: null,
        balance: null,
        incomeType: null,
        dateRange: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        amount: [
          { required: true, message: "金额不能为空", trigger: "blur" }
        ],
        balance: [
          { required: true, message: "余额不能为空", trigger: "blur" }
        ],
        incomeType: [
          { required: true, message: "类型 1充值 2支付 3退款不能为空", trigger: "change" }
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" }
        ],
        updateTime: [
          { required: true, message: "更新时间不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.getCostList()
  },
  methods: {
    /** 查询收入支出记录列表 */
    getCostList() {
      this.loading = true
      costListOrder(this.queryParams).then(response => {
        this.costList = response.rows
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
        amount: null,
        balance: null,
        incomeType: null,
        remark: null,
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
      this.getCostList()
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
      this.title = "添加收入支出记录"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getIncome(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "修改收入支出记录"
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateIncome(this.form).then(response => {
              this.$modal.msgSuccess("修改成功")
              this.open = false
              this.getCostList()
            })
          } else {
            addIncome(this.form).then(response => {
              this.$modal.msgSuccess("新增成功")
              this.open = false
              this.getCostList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除收入支出记录编号为"' + ids + '"的数据项？').then(function() {
        return delIncome(ids)
      }).then(() => {
        this.getCostList()
        this.$modal.msgSuccess("删除成功")
      }).catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('income/export', {
        ...this.queryParams
      }, `income_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
