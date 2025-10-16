<template>
  <div>
    <el-form ref="elForm" :model="formData" size="medium" label-width="300px">
      <el-form-item label-width="100px" label="订单类型">
        <span>{{ orderTypeLabel }}</span>
      </el-form-item>
    </el-form>

    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" size="medium" label-width="100px">
        <el-col :span="20">
          <el-form-item label="应用商店">
            <span>{{ storeTypeLabel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应用">
            <span>{{ formData.customerAppId || '未选择' }}</span>
          </el-form-item>
        </el-col>
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
        <el-col :span="24">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="24" v-if="formData.orderType == 1">
          <el-form-item label="执行小时">
            <span>{{ executionHourLabel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!-- 关键词安装 -->
          <el-form-item label="地区关键字配置" v-if="formData.orderType == 1">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
              <el-row :gutter="15">
                <el-col :span="6">
                  <el-form-item label="国家/地区">
                    <span>{{ getCountryLabel(areaConfig.area) }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-table :data="areaConfig.keywordList" border style="width: 100%; margin-top: 10px;">
                <el-table-column prop="keyword" label="关键词" width="200">
                  <template slot-scope="scope">
                    <span>{{ scope.row.keyword }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="每日数量" width="150">
                  <template slot-scope="scope">
                    <span>{{ scope.row.count }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="ranking" label="排名" width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.ranking || '-' }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
           <!-- 下载量 -->
           <el-form-item label="地区下载量配置" v-if="formData.orderType == 2">
             <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
               <el-row :gutter="15">
                 <el-col :span="6">
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
          <el-form-item label="地区评分配置" v-if="formData.orderType == 3">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
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
          <el-form-item label="地区评分配置" v-if="formData.orderType == 4">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
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
           <!-- 关键词保排名 -->
           <el-form-item label="关键词保排名配置" v-if="formData.orderType == 5">             
             <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
               <el-row :gutter="24">
                 <el-col :span="6">
                   <el-form-item label="国家/地区">
                     <span>{{ getCountryLabel(areaConfig.area) }}</span>
                   </el-form-item>
                 </el-col>
               </el-row>
               
               <el-table :data="areaConfig.keepRankList" border style="width: 100%; margin-top: 10px;">
                 <el-table-column prop="keyword" label="关键词" width="200">
                   <template slot-scope="scope">
                     <span>{{ scope.row.keyword }}</span>
                   </template>
                 </el-table-column>
                 <el-table-column prop="targetRank" label="目标排名" width="180">
                   <template slot-scope="scope">
                     <span>{{ scope.row.targetRank }}</span>
                   </template>
                 </el-table-column>
               </el-table>
             </div>
           </el-form-item>
           <!-- 关键词覆盖服务 -->
           <el-form-item label="关键词覆盖服务配置" v-if="formData.orderType == 6">
             <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
               <el-row :gutter="24">
                 <el-col :span="6">
                   <el-form-item label="国家/地区">
                     <span>{{ getCountryLabel(areaConfig.area) }}</span>
                   </el-form-item>
                 </el-col>
               </el-row>
               
               <el-table :data="areaConfig.coverList" border style="width: 100%; margin-top: 10px;">
                 <el-table-column prop="keyword" label="关键词" width="200">
                   <template slot-scope="scope">
                     <span>{{ scope.row.keyword }}</span>
                   </template>
                 </el-table-column>
                 <el-table-column prop="currentRank" label="当前排名" width="180">
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
        customerAppId: undefined,           // 应用ID
        beginDate: null,           // 订单开始日期
        endDate: null,             // 订单结束日期
        orderAreaKeywords: [],     // 地区和关键词安装列表
        orderKeywordRanks: [],     // 关键词保排名列表
        orderType: 1,              // 关键词安装类型
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
        { label: "美国", value: "us" },
        { label: "中国", value: "cn" },
        { label: "日本", value: "jp" },
        { label: "韩国", value: "kr" },
        { label: "英国", value: "gb" },
        { label: "德国", value: "de" },
        { label: "法国", value: "fr" },
        { label: "加拿大", value: "ca" },
        { label: "澳大利亚", value: "au" },
        { label: "印度", value: "in" }
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
      return this.formData.executionHour || '未设置'
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
        
        // 根据订单类型处理地区配置数据
        if (orderData.orderAreaKeywords && orderData.orderAreaKeywords.length > 0) {
          this.formData.orderAreaKeywords = orderData.orderAreaKeywords.map(areaConfig => {
            if (orderData.orderType === 1) {
              // 关键词安装类型
              return {
                area: areaConfig.area,
                keywordList: areaConfig.keywordList || []
              }
            } else if (orderData.orderType === 2) {
              // 下载量类型
              return {
                area: areaConfig.area,
                downloadCount: areaConfig.downloadAmount || 0
              }
            } else if (orderData.orderType === 3) {
              // 评分类型
              return {
                area: areaConfig.area,
                star5Amount: areaConfig.star5Amount || 0,
                star4Amount: areaConfig.star4Amount || 0
              }
            } else if (orderData.orderType === 4) {
              // 评论类型
              return {
                area: areaConfig.area,
                star5Amount: areaConfig.star5Amount || 0,
                star4Amount: areaConfig.star4Amount || 0
              }
            } else if (orderData.orderType === 5) {
              // 关键词保排名
              return {
                area: areaConfig.area,
                keepRankList: areaConfig.keywordRankList || []
              }
            } else if (orderData.orderType === 6) {
              // 关键词覆盖服务
              return {
                area: areaConfig.area,
                coverList: areaConfig.keywordRankList || []
              }
            }
            return areaConfig
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
        console.log('执行小时选项响应:', response);
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
      
      getSimpleAppList({ storeType: 1 }).then(response => {
        console.log('应用列表响应:', response);
        const apps = response.rows || response.data || [];
        this.appListOptions = apps.map(app => ({
          label: app.appName || app.name || app.customerAppId,
          value: app.customerAppId
        }));
      }).catch(error => {
        console.error('获取应用列表失败:', error);
        this.appListOptions = [];
      }).finally(() => {
        this.appListLoading = false;
      });
    },
  }
}

</script>
<style>
</style>
