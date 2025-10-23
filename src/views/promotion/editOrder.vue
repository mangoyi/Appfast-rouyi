<template>
  <div>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="300px">
      <el-form-item label-width="100px" label="订单类型" prop="orderType">
        <el-radio-group v-model="formData.orderType" size="medium">
          <el-radio-button v-for="(item, index) in orderTypeOptions" :key="index" :label="item.value"
            :disabled="item.disabled" border>{{item.label}}</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="20">
          <el-form-item label="应用商店" prop="storeType">
            <el-radio-group v-model="formData.storeType" size="medium">
              <el-radio-button v-for="(item, index) in storeTypeOptions" :key="index" :label="item.value"
                :disabled="item.disabled">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应用" prop="customerAppId">
            <el-select v-model="formData.customerAppId" filterable placeholder="请选择应用" :style="{width: '30%'}" :loading="appListLoading">
              <el-option v-for="app in appListOptions" :key="app.value" :label="app.label" :value="app.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="订单时间" prop="orderDate">
            <template v-if="formData.orderType == 1">
              <el-date-picker type="date" v-model="formData.orderDate" format="yyyy-MM-dd"
                value-format="yyyy-MM-dd" :style="{width: '30%'}" placeholder="请选择日期" clearable></el-date-picker>
            </template>
            <template v-else>
            <el-date-picker type="daterange" v-model="formData.orderDate" format="yyyy-MM-dd"
              value-format="yyyy-MM-dd" :style="{width: '50%'}" start-placeholder="开始日期"
              end-placeholder="结束日期" range-separator="至" clearable></el-date-picker>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="24" v-if="formData.orderType == 1">
          <el-form-item label="执行小时" prop="executionHour">
          <el-select v-model="formData.executionHour" placeholder="请选择执行小时" filterable clearable>
            <el-option
              v-for="item in executeHourOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        </el-col>
        <el-col :span="24">
          <!-- 关键词安装 -->
          <el-form-item label="地区关键字配置" prop="orderAreaKeywords" v-if="formData.orderType == 1">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
              <el-row :gutter="15">
                <el-col :span="6">
                  <el-form-item :label="`国家/地区`">
                    <el-select v-model="areaConfig.area" placeholder="请选择国家/地区" filterable clearable style="width: 100px">
                      <el-option v-for="country in countryOptions" :key="country.value" :label="country.label" :value="country.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label="操作">
                    <el-button type="danger" size="small" @click="removeAreaConfig(areaIndex)">删除地区</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-table :data="areaConfig.keywordList" border style="width: 100%; margin-top: 10px;">
                <el-table-column prop="keyword" label="关键词" width="200">
                  <template slot-scope="scope">
                    <el-input v-if="scope.$index === 0" v-model="scope.row.keyword" placeholder="请输入关键词" @keyup.enter.native="handleKeywordEnter(scope.row, areaIndex)"></el-input>
                    <span v-else>{{ scope.row.keyword }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="每日数量" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.count" placeholder="请输入每日数量" @keyup.enter.native="handleKeywordEnter(scope.row, areaIndex)"></el-input>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="ranking" label="排名" width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.ranking || '-' }}</span>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button v-if="scope.$index > 0" type="text" @click="removeKeywordRow(scope.$index, areaIndex)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <div style="margin-top: 10px;">
              <el-button type="primary" size="small" @click="addAreaConfig">添加地区配置</el-button>
            </div>
          </el-form-item>
           <!-- 下载量 -->
           <el-form-item label="地区下载量配置" prop="orderAreaKeywords" v-if="formData.orderType == 2">
             <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
               <el-row :gutter="15">
                 <el-col :span="6">
                   <el-form-item :label="`国家/地区`">
                     <el-select v-model="areaConfig.area" placeholder="国家/地区" filterable clearable style="width: 100px">
                       <el-option v-for="country in countryOptions" :key="country.value" :label="country.label" :value="country.value"></el-option>
                     </el-select>
                   </el-form-item>
                 </el-col>
                 <el-col :span="6">
                   <el-form-item label="安装量">
                     <el-input v-model="areaConfig.downloadCount" placeholder="安装量" style="width: 100px"></el-input>
                   </el-form-item>
                 </el-col>
                 <el-col :span="2">
                   <el-form-item label="操作">
                     <el-button type="danger" size="small" @click="removeAreaConfig(areaIndex)">删除地区</el-button>
                   </el-form-item>
                 </el-col>
               </el-row>
             </div>
             
             <div style="margin-top: 10px;">
               <el-button type="primary" size="small" @click="addAreaConfig">添加地区配置</el-button>
             </div>
           </el-form-item>
          <!-- 评分 --> 
          <el-form-item label="地区评分配置" prop="orderAreaKeywords" v-if="formData.orderType == 3">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item :label="`国家/地区`">
                    <el-select v-model="areaConfig.area" placeholder="国家/地区" filterable clearable style="width: 100px">
                      <el-option v-for="country in countryOptions" :key="country.value" :label="country.label" :value="country.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label="操作">
                    <el-button type="danger" size="small" @click="removeAreaConfig(areaIndex)">删除地区</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="5星评分">
                    <el-input v-model="areaConfig.star5Amount" placeholder="评分数" style="width: 150px"></el-input>
                    <el-input :value="areaConfig.star5Amount * orderDaysDiff" placeholder="总分" style="width: 100px" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="4星评分">
                    <el-input v-model="areaConfig.star4Amount" placeholder="评分数" style="width: 150px"></el-input>
                    <el-input :value="areaConfig.star4Amount * orderDaysDiff" placeholder="总分" style="width: 100px" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            
            <div style="margin-top: 10px;">
              <el-button type="primary" size="small" @click="addAreaConfig">添加地区配置</el-button>
            </div>
          </el-form-item>
          <!-- 评论 -->
          <el-form-item label="地区评分配置" prop="orderAreaKeywords" v-if="formData.orderType == 4">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item :label="`国家/地区`">
                    <el-select v-model="areaConfig.area" placeholder="国家/地区" filterable clearable style="width: 100px">
                      <el-option v-for="country in countryOptions" :key="country.value" :label="country.label" :value="country.value"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label="操作">
                    <el-button type="danger" size="small" @click="removeAreaConfig(areaIndex)">删除地区</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="24">
                <el-col :span="8">
                  <el-form-item label="5星评分">
                    <el-input v-model="areaConfig.star5Amount" placeholder="评分数" style="width: 150px"></el-input>
                    <el-input :value="areaConfig.star5Amount * orderDaysDiff" placeholder="总分" style="width: 100px" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="4星评分">
                    <el-input v-model="areaConfig.star4Amount" placeholder="评分数" style="width: 150px"></el-input>
                    <el-input :value="areaConfig.star4Amount * orderDaysDiff" placeholder="总分" style="width: 100px" disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            
            <div style="margin-top: 10px;">
              <el-button type="primary" size="small" @click="addAreaConfig">添加地区配置</el-button>
            </div>
          </el-form-item>
           <!-- 关键词保排名 -->
           <el-form-item label="关键词保排名配置" prop="orderAreaKeywords" v-if="formData.orderType == 5">             
             <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
               <el-row :gutter="24">
                 <el-col :span="6">
                   <el-form-item :label="`国家/地区`">
                     <el-select v-model="areaConfig.area" placeholder="国家/地区" filterable clearable style="width: 100px">
                       <el-option v-for="country in countryOptions" :key="country.value" :label="country.label" :value="country.value"></el-option>
                     </el-select>
                   </el-form-item>
                 </el-col>
                 <el-col :span="2">
                   <el-form-item label="操作">
                     <el-button type="danger" size="small" @click="removeAreaConfig(areaIndex)">删除地区</el-button>
                   </el-form-item>
                 </el-col>
               </el-row>
               
               <el-table :data="areaConfig.keepRankList" border style="width: 100%; margin-top: 10px;">
                 <el-table-column prop="keyword" label="关键词" width="200">
                   <template slot-scope="scope">
                     <el-input v-if="scope.$index === 0" v-model="scope.row.keyword" placeholder="请输入关键词" @keyup.enter.native="handleKeepRankEnter(scope.row, areaIndex)"></el-input>
                     <span v-else>{{ scope.row.keyword }}</span>
                   </template>
                 </el-table-column>
                 <el-table-column prop="targetRank" label="目标排名" width="180">
                   <template slot-scope="scope">
                     <el-select v-model="scope.row.targetRank" placeholder="目标排名" style="width: 120px">
                       <el-option v-for="opt in targetRankOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                     </el-select>
                   </template>
                 </el-table-column>
                 <el-table-column label="操作" width="120">
                   <template slot-scope="scope">
                     <el-button v-if="scope.$index > 0" type="text" @click="removeKeepRankRow(scope.$index, areaIndex)">删除</el-button>
                   </template>
                 </el-table-column>
               </el-table>
             </div>
             
             <div style="margin-top: 10px;">
               <el-button type="primary" size="small" @click="addAreaConfig">添加地区配置</el-button>
             </div>
           </el-form-item>
           <!-- 关键词覆盖服务 -->
           <el-form-item label="关键词覆盖服务配置" prop="orderAreaKeywords" v-if="formData.orderType == 6">
             <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex" style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
               <el-row :gutter="24">
                 <el-col :span="6">
                   <el-form-item :label="`国家/地区`">
                     <el-select v-model="areaConfig.area" placeholder="国家/地区" filterable clearable style="width: 100px">
                       <el-option v-for="country in countryOptions" :key="country.value" :label="country.label" :value="country.value"></el-option>
                     </el-select>
                   </el-form-item>
                 </el-col>
                 <el-col :span="2">
                   <el-form-item label="操作">
                     <el-button type="danger" size="small" @click="removeAreaConfig(areaIndex)">删除地区</el-button>
                   </el-form-item>
                 </el-col>
               </el-row>
               
               <el-table :data="areaConfig.coverList" border style="width: 100%; margin-top: 10px;">
                 <el-table-column prop="keyword" label="关键词" width="200">
                   <template slot-scope="scope">
                     <el-input v-if="scope.$index === 0" v-model="scope.row.keyword" placeholder="请输入关键词" @keyup.enter.native="handleCoverEnter(scope.row, areaIndex)"></el-input>
                     <span v-else>{{ scope.row.keyword }}</span>
                   </template>
                 </el-table-column>
                 <el-table-column prop="currentRank" label="当前排名" width="180">
                   <template slot-scope="scope">
                     <span>{{ scope.row.currentRank || '-' }}</span>
                   </template>
                 </el-table-column>
                 <el-table-column label="操作" width="120">
                   <template slot-scope="scope">
                     <el-button v-if="scope.$index > 0" type="text" @click="removeCoverRow(scope.$index, areaIndex)">删除</el-button>
                   </template>
                 </el-table-column>
               </el-table>
             </div>
             
             <div style="margin-top: 10px;">
               <el-button type="primary" size="small" @click="addAreaConfig">添加地区配置</el-button>
             </div>
          </el-form-item>

          <!-- 联系方式配置 -->
          <el-row :gutter="24" style="margin-bottom: 20px;" v-if="formData.orderType === 5 || formData.orderType === 6">
            <el-col :span="24">
              <el-form-item label="联系方式">
                <el-col :span="4">
                  <el-select v-model="formData.communicateType" placeholder="请选择联系方式类型" style="width: 120px">
                    <el-option v-for="type in communicateTypeOptions" :key="type.value" :label="type.label" :value="type.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="formData.communicateNumber" placeholder="请输入联系方式号码" style="width: 200px"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">保存</el-button>
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
import { getPromotionOrder, updatePromotionOrder } from "@/api/promotion/order"

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
      rules: {
        customerAppId: [{
          required: true,
          message: '应用不能为空',
          trigger: 'change'
        }],
        storeType: [{
          required: true,
          message: '应用商店不能为空',
          trigger: 'change'
        }],
        orderDate: [{
          required: true,
          message: '订单时间不能为空',
          trigger: 'change'
        }],
        executionHour: [{
          required: true,
          message: '执行小时不能为空',
          trigger: 'change'
        }],
        orderType: [{
          required: true,
          message: '订单类型不能为空',
          trigger: 'change'
        }],
        orderAreaKeywords: [{
          required: true,
          type: 'array',
          message: '请至少添加一个地区关键字配置',
          trigger: 'change'
        }],
        orderKeywordRanks: [{
          required: true,
          type: 'array',
          message: '请至少添加一个地区关键字配置',
          trigger: 'change'
        }],
        communicateNumber: [{
          required: true,
          message: '联系方式号码不能为空',
          trigger: 'blur'
        }],
        communicateType: [{
          required: true,
          message: '联系方式类型不能为空',
          trigger: 'change'
        }]
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
      // 关键词保排名的目标排名选项
      targetRankOptions: [
        { label: 'top1', value: 'top1' },
        { label: 'top2', value: 'top2' },
        { label: 'top3', value: 'top3' },
        { label: 'top4', value: 'top4' }
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
    }
  },
  watch: {
    // 监听订单类型变化，重新初始化地区配置
    'formData.orderType'(newType, oldType) {
      if (newType !== oldType) {
        // 清空现有配置
        this.formData.orderAreaKeywords = []
      }
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
    this.loadExecuteHourOptions()
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
          id: orderData.id,
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
                star5Amount: areaConfig.star5Amount || '',
                star4Amount: areaConfig.star4Amount || ''
              }
            } else if (orderData.orderType === 4) {
              // 评论类型
              return {
                area: areaConfig.area,
                star5Amount: areaConfig.star5Amount || '',
                star4Amount: areaConfig.star4Amount || ''
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
    
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        
        // 处理表单数据，转换为API需要的格式
        const submitData = this.processFormData()
        console.log('提交数据:', submitData)
        
        // 调用更新订单API
        this.updateOrder(submitData)
      })
    },
    // 处理表单数据，转换为API格式
    processFormData() {
      // 处理日期（orderType==1: 单日；其他: 日期范围）
      let beginDate = null
      let endDate = null
      if (this.formData.orderType == 1) {
        if (this.formData.orderDate) {
          beginDate = this.formData.orderDate
          endDate = this.formData.orderDate
        }
      } else {
        if (this.formData.orderDate && this.formData.orderDate.length === 2) {
          beginDate = this.formData.orderDate[0]
          endDate = this.formData.orderDate[1]
        }
      }
      
      // 处理地区配置数据，根据订单类型构建不同的数据结构
      const areaData = this.formData.orderAreaKeywords.map(areaConfig => {
        // 过滤掉空的地区配置
        if (!areaConfig.area) return null
        
        if (this.formData.orderType === 1) {
          // 关键词安装类型 - orderAreaKeywords
          const keywordList = areaConfig.keywordList
            .filter(keyword => keyword.keyword && keyword.keyword.trim())
            .map(keyword => ({
              keyword: keyword.keyword.trim(),
              count: parseInt(keyword.count) || 0
            }))
          
          return {
            area: areaConfig.area,
            keywordList: keywordList
          }
        } else if (this.formData.orderType === 2) {
          // 下载量类型 - orderAreaDownloads
          return {
            area: areaConfig.area,
            downloadAmount: parseInt(areaConfig.downloadCount) || 0
          }
        } else if (this.formData.orderType === 3) {
          // 评分类型 - orderAreaScores
          return {
            area: areaConfig.area,
            star5Amount: parseInt(areaConfig.star5Amount) || 0,
            star4Amount: parseInt(areaConfig.star4Amount) || 0
          }
        } else if (this.formData.orderType === 4) {
          // 评论类型 - orderAreaScores
          return {
            area: areaConfig.area,
            star5Amount: parseInt(areaConfig.star5Amount) || 0,
            star4Amount: parseInt(areaConfig.star4Amount) || 0
          }
        } else if (this.formData.orderType === 5) {
          // 关键词保排名 - orderKeywordRanks
          const keywordRankList = (areaConfig.keepRankList || [])
            .filter(item => item.keyword && item.keyword.trim())
            .map(item => ({
              keyword: item.keyword.trim(),
              targetRank: parseInt(item.targetRank) || 1
            }))
          
          return {
            area: areaConfig.area,
            keywordRankList: keywordRankList
          }
        } else if (this.formData.orderType === 6) {
          // 关键词覆盖服务 - orderKeywordRanks
          const keywordRankList = (areaConfig.coverList || [])
            .filter(item => item.keyword && item.keyword.trim())
            .map(item => ({
              keyword: item.keyword.trim()
            }))
          
          return {
            area: areaConfig.area,
            keywordRankList: keywordRankList
          }
        }
        
        return null
      }).filter(item => {
        if (item === null) return false
        if (this.formData.orderType === 1) {
          return item.keywordList && item.keywordList.length > 0
        } else if (this.formData.orderType === 2) {
          return item.downloadAmount > 0
        } else if (this.formData.orderType === 3) {
          return item.star5Amount > 0 || item.star4Amount > 0
        } else if (this.formData.orderType === 4) {
          return item.star5Amount > 0 || item.star4Amount > 0
        } else if (this.formData.orderType === 5) {
          return item.keywordRankList && item.keywordRankList.length > 0
        } else if (this.formData.orderType === 6) {
          return item.keywordRankList && item.keywordRankList.length > 0
        }
        return false
      })
      
      // 构建API数据格式
      const apiData = {
        customerAppId: this.formData.customerAppId,
        beginDate: beginDate,
        endDate: endDate,
        orderType: this.formData.orderType,
        storeType: this.formData.storeType,
        executionHour: this.formData.executionHour
      }
      
      // 根据订单类型添加对应的数据字段
      if (this.formData.orderType === 1) {
        apiData.orderAreaKeywords = areaData
      } else if (this.formData.orderType === 2) {
        apiData.orderAreaDownloads = areaData
      } else if (this.formData.orderType === 3) {
        apiData.orderAreaScores = areaData
      } else if (this.formData.orderType === 4) {
        apiData.orderAreaScores = areaData
      } else if (this.formData.orderType === 5 || this.formData.orderType === 6) {
        apiData.orderKeywordRanks = areaData
      }
      
      // 如果是关键词保排名，添加联系方式字段
      if (this.formData.orderType === 5 || this.formData.orderType === 6) {
        apiData.communicateNumber = this.formData.communicateNumber
        apiData.communicateType = this.formData.communicateType
      }

      apiData.id = this.formData.id
      
      return apiData
    },
    // 更新订单
    updateOrder(data) {
      this.$confirm('确认保存订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 显示加载状态
        const loading = this.$loading({
          lock: true,
          text: '正在保存订单...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        
        updatePromotionOrder(data).then(response => {
          loading.close()
          this.$message.success('订单保存成功！')
          console.log('订单保存响应:', response)
          
          // 保存成功后跳转回列表页面
          this.$router.push('/promotion/orderList')
        }).catch(error => {
          loading.close()
          console.error('订单保存失败:', error)
          this.$message.error('订单保存失败，请重试')
        })
      }).catch(() => {
        // 用户取消操作
      })
    },
    // 返回上一页
    goBack() {
      this.$router.go(-1)
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
      // 重新初始化第一个地区配置
      this.formData.orderAreaKeywords = []
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
    // 添加地区配置
    addAreaConfig() {
      if (this.formData.orderType === 1) {
        // 关键词安装类型
        this.formData.orderAreaKeywords.push({
          area: '',
          keywordList: [{
            keyword: '',
            count: '',
            totalQuantity: 0,
            ranking: '-'
          }]
        });
      } else if (this.formData.orderType === 2) {
        // 下载量类型
        this.formData.orderAreaKeywords.push({
          area: '',
          downloadCount: ''
        });
      } else if (this.formData.orderType === 3) {
        // 评分类型
        this.formData.orderAreaKeywords.push({
          area: '',
          star5Amount: '',
          star4Amount: ''
        });
      } else if (this.formData.orderType === 4) {
        // 评论类型
        this.formData.orderAreaKeywords.push({
          area: '',
          star5Amount: '',
          star4Amount: ''
        });
      } else if (this.formData.orderType === 5) {
        // 关键词保排名
        this.formData.orderAreaKeywords.push({
          area: '',
          keepRankList: [{
            keyword: '',
            targetRank: 'top1'
          }]
        });
      } else if (this.formData.orderType === 6) {
        // 关键词覆盖服务
        this.formData.orderAreaKeywords.push({
          area: '',
          coverList: [{
            keyword: '',
            currentRank: '-'
          }]
        });
      }
    },
    // 删除地区配置
    removeAreaConfig(areaIndex) {
      this.formData.orderAreaKeywords.splice(areaIndex, 1);
    },
    // 删除关键词行
    removeKeywordRow(keywordIndex, areaIndex) {
      // 防止删除第一行
      if (keywordIndex > 0) {
        this.formData.orderAreaKeywords[areaIndex].keywordList.splice(keywordIndex, 1);
      }
    },
    // 处理关键词输入框回车事件
    handleKeywordEnter(row, areaIndex) {
      console.log('handleKeywordEnter', row, areaIndex);
      if (row.keyword.trim()) {
        // 将第一行的内容添加到新行
        this.formData.orderAreaKeywords[areaIndex].keywordList.push({
          keyword: row.keyword,
          count: row.count,
          totalQuantity: row.totalQuantity,
          ranking: row.ranking
        });
        
        // 清空第一行的输入内容，保持第一行作为输入项
        row.keyword = '';
        row.count = '';
        row.totalQuantity = 0;
        row.ranking = '-';
      }
    },
    // 处理关键词保排名输入框回车事件
    handleKeepRankEnter(row, areaIndex) {
      console.log('handleKeepRankEnter', row, areaIndex);
      if (row.keyword.trim()) {
        // 将第一行的内容添加到新行
        this.formData.orderAreaKeywords[areaIndex].keepRankList.push({
          keyword: row.keyword,
          targetRank: row.targetRank || 'top1'
        });
        
        // 清空第一行的输入内容，保持第一行作为输入项
        row.keyword = '';
        row.targetRank = 'top1';
      }
    },
    // 处理关键词覆盖服务输入框回车事件
    handleCoverEnter(row, areaIndex) {
      console.log('handleCoverEnter', row, areaIndex);
      if (row.keyword.trim()) {
        // 将第一行的内容添加到新行
        this.formData.orderAreaKeywords[areaIndex].coverList.push({
          keyword: row.keyword,
          currentRank: row.currentRank || '-'
        });
        
        // 清空第一行的输入内容，保持第一行作为输入项
        row.keyword = '';
        row.currentRank = '-';
      }
    },
    // 删除关键词保排名行
    removeKeepRankRow(keywordIndex, areaIndex) {
      // 防止删除第一行
      if (keywordIndex > 0) {
        this.formData.orderAreaKeywords[areaIndex].keepRankList.splice(keywordIndex, 1);
      }
    },
    // 删除关键词覆盖服务行
    removeCoverRow(keywordIndex, areaIndex) {
      // 防止删除第一行
      if (keywordIndex > 0) {
        this.formData.orderAreaKeywords[areaIndex].coverList.splice(keywordIndex, 1);
      }
    },
    // 加载执行小时选项
    loadExecuteHourOptions() {
      this.executeHourLoading = true;
      
      getExecuteHourOptions().then(response => {
        console.log('执行小时选项响应:', response);
        // 假设服务端返回的数据格式为 { data: [{ value: '09:00', label: '09:00' }, ...] }
        const hours = response.data || response.rows || [];
        this.executeHourOptions = hours.map(hour => ({
          label: hour.dictLabel,
          value: hour.dictValue
        }));
      }).catch(error => {
        console.error('获取执行小时选项失败:', error);
        this.executeHourOptions = [];
        // 如果API调用失败，提供默认选项
        this.executeHourOptions = [
        { label: '1 hour', value: 1 },
        { label: '2 hours', value: 2 },
        { label: '3 hours', value: 3 },
        { label: '4 hours', value: 4 },
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
