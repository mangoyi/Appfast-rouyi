<template>
  <div class="page-container">
    <!-- Basic Info Section with background color -->
    <el-form ref="elForm" :model="formData" size="medium" label-width="100px" class="basic-info-section">
      <el-row :gutter="15">
        <el-col :span="6">
          <el-form-item label="订单类型">
            <span>{{ orderTypeLabel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="应用商店">
            <span>{{ storeTypeLabel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用">
            <span>{{ formData.appName  }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="15">
        <el-col :span="24">
          <el-form-item label="订单时间">
            <template v-if="formData.orderType == 1">
              <span>{{ formData.orderDate }}</span>
            </template>
            <template v-else>
              <span>{{ formData.orderDate ? formData.orderDate.join(' 至 ') : '' }}</span>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 分割线 -->
    <el-divider></el-divider>
    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" size="medium" label-width="100px">
        <el-col :span="24" v-if="formData.orderType == 1">
          <el-form-item label="执行小时">
            <span>{{ executionHourLabel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!-- 关键词安装 -->
          <el-form-item label="地区关键词" v-if="formData.orderType == 1">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" class="area-card">
              <el-row :gutter="2">
                <el-col :span="24">
                  <el-form-item label="国家/地区">
                    <span>{{ getCountryLabel(areaConfig.area) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-table :data="areaConfig.keywordList" border class="keyword-table" :max-height="areaConfig.keywordList.length > 2 ? 200 : ''">
                <el-table-column prop="keyword" label="关键词" width="150">
                  <template slot-scope="scope">
                    <span>{{ scope.row.keyword }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="每日数量" width="100">
                  <template slot-scope="scope">
                    <span>{{ scope.row.count }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
           <!-- 下载量 -->
           <el-form-item label="地区下载量" v-if="formData.orderType == 2">
             <div v-for="(areaConfig, areaIndex) in formData.orderAreaDownloads" :key="areaIndex" class="area-card">
               <el-row :gutter="10">
                 <el-col :span="3">
                   <el-form-item label="国家/地区">
                     <span>{{ getCountryLabel(areaConfig.area) }}</span>
                   </el-form-item>
                 </el-col>
                 <el-col :span="6">
                   <el-form-item label="安装量">
                     <span>{{ areaConfig.downloadCount }}</span>
                   </el-form-item>
                 </el-col>
               </el-row>
             </div>
           </el-form-item>
          <!-- 评分 --> 
          <el-form-item label="地区评分" v-if="formData.orderType == 3">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaScores" :key="areaIndex" class="area-card">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="国家/地区">
                    <span>{{ getCountryLabel(areaConfig.area) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="5星评分">
                    <span>{{ areaConfig.star5Amount || 0 }}</span> 分
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="4星评分">
                    <span>{{ areaConfig.star4Amount || 0 }}</span> 分
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <!-- 评论 -->
          <el-form-item label="地区评论" v-if="formData.orderType == 4">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaScores" :key="areaIndex" class="area-card">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item label="国家/地区">
                    <span>{{ getCountryLabel(areaConfig.area) }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="5星评论">
                    <span>{{ areaConfig.star5Amount || 0 }}</span> 个
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="4星评论">
                    <span>{{ areaConfig.star4Amount || 0 }}</span> 个
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-form-item label="评论附件" v-if="areaConfig.fileName">
                    <span>{{ areaConfig.fileName }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
           <!-- 关键词保排名 -->
           <el-form-item label="关键词保排名服务" v-if="formData.orderType == 5">             
             <div v-for="(areaConfig, areaIndex) in formData.orderKeywordRanks" :key="areaIndex" class="area-card">
               <el-row :gutter="24">
                 <el-col :span="6">
                   <el-form-item label="国家/地区">
                     <span>{{ getCountryLabel(areaConfig.area) }}</span>
                   </el-form-item>
                 </el-col>
               </el-row>
               
               <el-table :data="areaConfig.keepRankList" border class="keyword-table" :max-height="areaConfig.keepRankList.length > 4 ? 200 : ''">
                 <el-table-column prop="keyword" label="关键词" width="150">
                   <template slot-scope="scope">
                     <span>{{ scope.row.keyword }}</span>
                   </template>
                 </el-table-column>
                 <el-table-column prop="targetRank" label="目标排名" width="100">
                   <template slot-scope="scope">
                     <span>{{ scope.row.targetRank }}</span>
                   </template>
                 </el-table-column>
               </el-table>
             </div>
           </el-form-item>
           <!-- 关键词覆盖服务 -->
           <el-form-item label="关键词覆盖服务" v-if="formData.orderType == 6">
             <div v-for="(areaConfig, areaIndex) in formData.orderKeywordRanks" :key="areaIndex" class="area-card">
               <el-row :gutter="24">
                 <el-col :span="6">
                   <el-form-item label="国家/地区">
                     <span>{{ getCountryLabel(areaConfig.area) }}</span>
                   </el-form-item>
                 </el-col>
               </el-row>
               
               <el-table :data="areaConfig.coverList" border class="keyword-table" :max-height="areaConfig.coverList.length > 4 ? 200 : ''">
                 <el-table-column prop="keyword" label="关键词" width="150">
                   <template slot-scope="scope">
                     <span>{{ scope.row.keyword }}</span>
                   </template>
                 </el-table-column>
                 <el-table-column prop="currentRank" label="当前排名" width="100">
                   <template slot-scope="scope">
                     <span>{{ scope.row.currentRank || '-' }}</span>
                   </template>
                 </el-table-column>
               </el-table>
             </div>
          </el-form-item>

          <!-- 联系方式配置 -->
          <el-row :gutter="24" style="margin-bottom: 20px;" v-if="formData.orderType === 5 || formData.orderType === 6">
            <el-col :span="24">
              <el-form-item label="联系方式">
                <span>{{ getCommunicateTypeLabel(formData.communicateType) }}: {{ formData.communicateNumber }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button @click="goBack">返回</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>

<script>

// 1. 导入获取用户列表的API
import { queryUserList } from "@/api/system/user"
// 2. 导入获取执行小时选项的API
import { getExecuteHourOptions } from "@/api/promotion/executeHour"
// 3. 导入应用列表API
import { listApp, getSimpleAppList  } from "@/api/appkeyword/app"
// 4. 导入订单API
import { getPromotionOrder } from "@/api/promotion/order"
// 5. 导入国家选项的API
import { getCountryOptions,getTime } from "@/api/promotion/country"

export default {
  components: {},
  props: [],
  dicts: ['execution_hours'],
  data() {
    return {
      // 用户列表数据加载状态
      userListOptions: [],
      userListLoading: false,
      searchTimer: null,
      // 执行小时数据加载状态
      executeHourOptions: [],
      executeHourLoading: false,
      // 应用列表数据加载状态
      appListOptions: [],
      appListLoading: false,
        // 用户下拉查询参数
      userQueryParams: {
        pageNum: 1,
        pageSize: 10,
        idOrName: null,
      },
      formData: {
        // API字段映射
        appId: undefined,
        appName: null,
        customerAppId: undefined,           // 应用ID
        beginDate: null,           // 订单开始日期
        endDate: null,             // 订单结束日期
        orderAreaKeywords: [],     // 关键词安装列表
        orderAreaDownloads: [],     // 下载列表
        orderAreaScores: [],     // 评分评论列表
        orderKeywordRanks: [],     // 关键词保排名列表
        orderType: 1,              // 订单类型
        storeType: 1,              // 应用商店
        executionHour: undefined,  // 可执行小时
        communicateNumber: '',     // 联系方式号码
        communicateType: 1,        // 联系方式类型
        
        // 内部使用字段（用于日期范围选择器）
        orderDate: null,
      },
      orderTypeOptions: [{
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
      storeTypeOptions: [{
        "label": "AppStore",
        "value": 1
      }, {
        "label": "Google Play",
        "value": 2
      }],
      countryOptions: [
        // { label: "美国", value: "US" },
        // { label: "中国", value: "cn" },
        // { label: "日本", value: "jp" },
        // { label: "韩国", value: "kr" },
        // { label: "英国", value: "gb" },
        // { label: "德国", value: "de" },
        // { label: "法国", value: "fr" },
        // { label: "加拿大", value: "ca" },
        // { label: "澳大利亚", value: "au" },
        // { label: "印度", value: "in" }
      ],
      // 联系方式类型选项
      communicateTypeOptions: [
        { label: '手机号', value: 1 },
        { label: '微信号', value: 2 },
        { label: 'QQ号', value: 3 },
        { label: '邮箱', value: 4 }
      ],
    }
  },
  computed: {
     selectedAppName() {
    if (!this.formData.customerAppId) return '未选择';
    const selectedApp = this.appListOptions.find(app => app.value === this.formData.customerAppId);
    return selectedApp ? selectedApp.label : '未选择';
    },
    // 计算订单时间的天数差值
    orderDaysDiff() {
      if (this.formData.orderType == 1) {
        // 单日选择，返回1天
        return 1
      } else if (this.formData.orderDate && this.formData.orderDate.length === 2) {
        // 日期范围，计算天数差值
        const startDate = new Date(this.formData.orderDate[0])
        const endDate = new Date(this.formData.orderDate[1])
        const diffTime = Math.abs(endDate - startDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // 加1是因为包含开始和结束日期
        return diffDays
      }
      return 1 // 默认返回1
    },
    // 订单类型标签
    orderTypeLabel() {
      const option = this.orderTypeOptions.find(opt => opt.value === this.formData.orderType)
      return option ? option.label : '未知'
    },
    // 应用商店标签
    storeTypeLabel() {
      const option = this.storeTypeOptions.find(opt => opt.value === this.formData.storeType)
      return option ? option.label : '未知'
    },
    // 执行小时标签
    executionHourLabel() {
      const sufixHour =  this.formData.executionHour === 1 ? ' hour' : ' hours'
      return this.formData.executionHour  + sufixHour|| '未设置'
    }
  },
  created() {
    // 获取路由参数中的ID
    const id = this.$route.params.id
    if (id) {
      this.loadOrderData(id)
    }
    // 组件创建时加载用户列表数据
    // this.loadUserListOptions()
    // 加载执行小时选项数据
    // this.loadExecuteHourOptions()
    // 加载应用列表数据
    this.loadAppListOptions()
    
    // 加载国家选项数据
    this.loadCountryOptions()
  },
  mounted() {},
  methods: {
    // 加载订单数据
    loadOrderData(id) {
      getPromotionOrder(id).then(response => {
        console.log('订单详情响应:', response)
        const orderData = response.data || response
        
        // 将API数据映射到表单数据
        this.formData = {
          appId: orderData.appId,
          appName: orderData.appName,
          customerAppId: orderData.customerAppId,
          beginDate: orderData.beginDate,
          endDate: orderData.endDate,
          orderType: orderData.orderType,
          storeType: orderData.storeType,
          executionHour: orderData.executionHour,
          communicateNumber: orderData.communicateNumber || '',
          communicateType: orderData.communicateType || 1,
          orderDate: orderData.orderType == 1 ? orderData.beginDate : [orderData.beginDate, orderData.endDate]
        }
        
        if (orderData.orderType === 1 &&orderData.orderAreaKeywords && orderData.orderAreaKeywords.length > 0) {
          this.formData.orderAreaKeywords = orderData.orderAreaKeywords.map(areaConfig => {
            // 关键词安装类型
              return {
                area: this.getCountryLabel(areaConfig.area),
                keywordList: areaConfig.keywordList || []
              }
          })
        } else if (orderData.orderType === 2 &&orderData.orderAreaDownloads && orderData.orderAreaDownloads.length > 0) {
          this.formData.orderAreaDownloads = orderData.orderAreaDownloads.map(areaConfig => {
            // 下载量类型
              return {
                area: areaConfig.area,
                downloadCount: areaConfig.downloadAmount || 0
              }
          })
         }
         else if (orderData.orderType === 3 &&orderData.orderAreaScores && orderData.orderAreaScores.length > 0) {
          this.formData.orderAreaScores = orderData.orderAreaScores.map(areaConfig => {
            // 评分评论类型
              return {
                area: areaConfig.area,
                star5Amount: areaConfig.star5Amount || 0,
                star4Amount: areaConfig.star4Amount || 0
              }
          })
         } else if (orderData.orderType === 4 &&orderData.orderAreaScores && orderData.orderAreaScores.length > 0) {
          this.formData.orderAreaScores = orderData.orderAreaScores.map(areaConfig => {
            // 评分评论类型
              return {
                area: areaConfig.area,
                star5Amount: areaConfig.star5Amount || 0,
                star4Amount: areaConfig.star4Amount || 0,
                fileName: areaConfig.fileName
              }
          })
          }
          else if (orderData.orderType === 5 &&orderData.orderKeywordRanks && orderData.orderKeywordRanks.length > 0) {
          this.formData.orderKeywordRanks = orderData.orderKeywordRanks.map(areaConfig => {
            // 关键词保排名
              return {
                area: areaConfig.area,
                coverList: areaConfig.keywordRankList || []
              }
          })
          } 
          else if (orderData.orderType === 6 &&orderData.orderKeywordRanks && orderData.orderKeywordRanks.length > 0) {
          this.formData.orderKeywordRanks = orderData.orderKeywordRanks.map(areaConfig => {
            // 关键词覆盖服务
              return {
                area: areaConfig.area,
                keepRankList: areaConfig.keywordRankList || []
              }
          })
          }
      }).catch(error => {
        console.error('获取订单详情失败:', error)
        this.$message.error('获取订单详情失败')
      })
    },
    
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    
    // 获取国家标签
    getCountryLabel(value) {
      const country = this.countryOptions.find(opt => opt.value === value)
      return country ? country.label : value
    },

        // 获取国家标签
    getAppName(value) {
      const appName = this.appListOptions.find(opt => opt.label === value)
      return appName ? appName.value : value
    },
    
    // 获取联系方式类型标签
    getCommunicateTypeLabel(value) {
      const type = this.communicateTypeOptions.find(opt => opt.value === value)
      return type ? type.label : '未知'
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
    
    // 加载执行小时选项
    loadExecuteHourOptions() {
      this.executeHourLoading = true;
      
      getExecuteHourOptions().then(response => {
        // console.log('执行小时选项响应:', response);
        // 假设服务端返回的数据格式为 { data: [{ value: '09:00', label: '09:00' }, ...] }
        const hours = response.data || response.rows || [];
        this.executeHourOptions = hours.map(hour => ({
          label: hour.label || hour.name || hour.value,
          value: hour.value || hour.id
        }));
      }).catch(error => {
        console.error('获取执行小时选项失败:', error);
        this.executeHourOptions = [];
        // 如果API调用失败，提供默认选项
        this.executeHourOptions = [
          { label: '09:00', value: '09:00' },
          { label: '10:00', value: '10:00' },
          { label: '11:00', value: '11:00' },
          { label: '14:00', value: '14:00' },
          { label: '15:00', value: '15:00' },
          { label: '16:00', value: '16:00' },
          { label: '17:00', value: '17:00' },
          { label: '18:00', value: '18:00' }
        ];
      }).finally(() => {
        this.executeHourLoading = false;
      });
    },
    
    // 加载应用列表选项
    loadAppListOptions() {
      this.appListLoading = true;
      const query = { page: 1, limit: 100, storeType: this.formData.storeType };
      getSimpleAppList(query).then(response => {
        // console.log('应用列表响应:', response);
        const apps = response.rows || response.data || [];
        this.appListOptions = apps.map(app => ({
          label: app.appName,
          value: app.customerAppId
        }));
      }).catch(error => {
        console.error('获取应用列表失败:', error);
        this.appListOptions = [];
      }).finally(() => {
        this.appListLoading = false;
      });
    },
    // 地区列表
    loadCountryOptions() {
      this.countryLoading = true;
      getCountryOptions().then(response => {
        const countries = response.rows || [];
        this.countryOptions = countries.map(country => ({
          label: country.areaName,
          value: country.areaCode,
          image: country.areaImage
        }));
      }).catch(error => {
        console.error('获取国家选项失败:', error);
        // 如果API调用失败，提供默认选项
        // this.countryOptions = [];
      }).finally(() => {
        this.countryLoading = false;
      });
    },
  }
}

</script>
<style scoped>
.basic-info-section {
  background-color: #f0f7ff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #dfefff;
  overflow: hidden;
}

.basic-info-section .el-form-item {
  margin-bottom: 0;
}

.basic-info-section .el-row {
  margin-bottom: 0;
}

.keyword-table {
  margin-top: 10px;
  border-radius: 4px;
  overflow: hidden;
}

.keyword-table ::v-deep .el-table__header th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #606266;
  padding: 6px 0 !important; /* 减小表头高度 */
}

.keyword-table ::v-deep .el-table__row td {
  padding: 4px 0 !important; /* 减小单元格垂直padding */
}

.keyword-table ::v-deep .el-table__header tr {
  background-color: #fafafa;
}

.keyword-table ::v-deep .el-table__body tr:hover > td {
  background-color: #f5f7fa;
}

.info-section {
  background-color: #f8f9fc;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.area-card {
  background-color: #ffffff;
  border: 1px solid #e6ebf5;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.area-card .el-form-item {
  margin-bottom: 12px;
}

.area-card .el-form-item:last-child {
  margin-bottom: 0;
}

.page-container {
  margin: 20px;
  min-height: calc(100vh - 40px);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding: 15px 0;
}

.total-amount {
  font-size: 16px;
  font-weight: bold;
  margin-right: 20px;
}

.total-amount .amount {
  color: #ff4949;
  font-size: 18px;
}

.buttons {
  display: flex;
  gap: 10px;
  margin-right: 50px;
}

/* Reduce spacing between form items */
.el-form-item {
  margin-bottom: 15px;
}

/* Compact table layouts */
.el-table {
  font-size: 13px;
}

/* Reduce table row height - corrected */
.el-table .el-table__row td {
  padding: 2px 0 !important;
  height: 25px !important;
}

/* For area configuration tables specifically */
.area-config-table .el-table__row td {
  padding: 1px 0 !important;
  height: 22px !important;
}

.area-config-table .el-table__row th {
  padding: 1px 0 !important;
  height: 22px !important;
}

/* Compact input fields in tables */
.area-config-table .el-input__inner {
  height: 22px !important;
  line-height: 22px !important;
  padding: 0 6px !important;
}

/* Compact buttons in tables */
.area-config-table .el-button--text {
  padding: 2px 6px !important;
  font-size: 12px !important;
}

/* Reduce table header height */
.el-table th {
  padding: 2px 0 !important;
  height: 25px !important;
}

/* For the area configuration tables specifically */
.area-config-table th {
  padding: 1px 0 !important;
  height: 22px !important;
  font-size: 12px !important;
}

/* Reduce font size in table cells */
.area-config-table td {
  font-size: 12px !important;
}

/* Reduce padding in table header cells */
.el-table th .cell {
  padding: 0 5px !important;
  white-space: nowrap;
}

/* Compact table header for area configurations */
.area-config-table th .cell {
  padding: 0 3px !important;
  font-weight: 500;
}

/* Override specific table header with multiple classes */
.el-table_1_column_1.is-leaf.el-table__cell {
  padding: 1px 0 !important;
  height: 22px !important;
  font-size: 12px !important;
}

/* More specific targeting for the cell content */
.el-table_1_column_1.is-leaf.el-table__cell .cell {
  padding: 0 3px !important;
  line-height: 22px !important;
}

/* Target other specific column classes as well */
.el-table_1_column_2.is-leaf.el-table__cell,
.el-table_1_column_3.is-leaf.el-table__cell {
  padding: 1px 0 !important;
  height: 22px !important;
  font-size: 12px !important;
}

.el-table_1_column_2.is-leaf.el-table__cell .cell,
.el-table_1_column_3.is-leaf.el-table__cell .cell {
  padding: 0 3px !important;
  line-height: 22px !important;
}

/* Reduce spacing in area configuration sections */
.area-config-section {
  margin-bottom: 12px;
  border: 1px solid #dcdfe6;
  padding: 8px;
  border-radius: 4px;
}

/* Compact area configuration tables */
.area-config-table {
  font-size: 12px;
  margin-top: 5px;
}

/* Compact form items within area configurations */
.area-config-section .el-form-item {
  margin-bottom: 8px;
}

/* Adjust button spacing */
.el-button--small {
  padding: 7px 12px;
}

/* Reduce divider margin */
.el-divider--horizontal {
  margin: 10px 0;
}

/* Optimize keyword list table */
.keyword-table {
  margin-top: 8px;
}

/* Compact form item labels */
.el-form-item__label {
  padding-bottom: 0;
}

/* Reduce spacing in form footer */
.form-footer {
  padding: 12px 0;
}

/* Adjust upload button spacing */
.el-upload {
  margin-left: 8px;
}

/* Reduce margin for action buttons */
.el-button[type="danger"] {
  margin-left: 5px;
}

/* Compact select and input fields */
.el-select .el-input__inner,
.el-input .el-input__inner {
  height: 32px;
  line-height: 32px;
}

/* Reduce margin for form rows */
.el-row {
  margin-bottom: 10px;
}

/* Override auto-generated styles with more specific selectors */
.el-table.el-table--medium td.el-table__cell,
.el-table.el-table--medium th.el-table__cell {
  padding: 2px 0 !important;
}

.area-config-table.el-table--medium td.el-table__cell,
.area-config-table.el-table--medium th.el-table__cell {
  padding: 1px 0 !important;
}

/* Adjust table column padding */
.el-table .cell {
  padding: 0 5px !important;
}

/* Compact action buttons */
.el-button--small {
  padding: 6px 10px;
}

/* Add this to your style section */
.el-table.el-table--medium .el-table__cell {
  padding: 2px 0 !important;
  height: 25px !important;
}

.area-config-table.el-table--medium .el-table__cell {
  padding: 1px 0 !important;
  height: 22px !important;
}

.el-row {
  height: 20px;
}

.el-col-2 {
  height: 30px;
}

.el-table--medium.el-table__cell {
  padding: 5px 0 !important;
  height: 25px !important;
}
</style>
