<template>
  <div class="dashboard-container app-container home">
    <ChildComponent v-if="$auth.hasRole('admin')"></ChildComponent>
    <div v-if="!$auth.hasRole('admin')">
      <!-- Page Header -->
      <div class="page-header">
        <h1 class="title">账户概览</h1>
        <div class="header-actions">
           <el-button type="primary" icon="el-icon-refresh" size="small" @click="fetchFinancialSummary">刷新数据</el-button>
        </div>
      </div>

      <!-- Panel Group / Summary Cards -->
      <el-row :gutter="20" class="card-container panel-group">
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              <i class="el-icon-s-finance card-panel-icon"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">今日消费</div>
              <span class="card-panel-num text-red">${{ financialSummary && financialSummary.todayConsumption ? financialSummary.todayConsumption : '0.00' }}</span>
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6" :lg="6">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-shopping">
              <i class="el-icon-shopping-cart-full card-panel-icon"></i>
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">昨日消费</div>
              <span class="card-panel-num text-green">${{ financialSummary && financialSummary.yesterdayConsumption ? financialSummary.yesterdayConsumption : '0.00' }}</span>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- Filters Section -->
      <div class="card-container filter-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
          <el-form-item label="应用" prop="appId">
            <el-select v-model="queryParams.appId" placeholder="请输入或选择应用"
              filterable
              remote
              :remote-method="handleAppSearch"
              :loading="userAppListLoading"
              clearable
              @change="fetchDailyConsumptionData"
              style="width: 200px">
              <el-option v-for="item in userAppListOptions" :key="item.value" :label="item.label"
                :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="queryParams.dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="datePickerOptions"
              @change="fetchDailyConsumptionData"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <!-- Charts Section -->
      <div class="card-container chart-container">
        <h3 class="box-title">每日消费趋势图</h3>
        <div id="consumptionChart" style="width: 100%; height: 400px;"></div>
      </div>
    </div>
  </div>
</template>

<script>

import * as echarts from 'echarts'
import { getUserFinancialSummary, getUserDailyConsumptionList } from '@/api/income/income'
import { listApp } from "@/api/appkeyword/app"

import ChildComponent from '@/views/order/normalorder/tobeConfirm.vue';

// 计算当前一周的日期范围
function getWeekDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 6) // 减去6天，得到一周前的日期（包含今天共7天）

  // 格式化日期为YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return [formatDate(start), formatDate(end)]
}


export default {
  name: "Index",
  components: {
    ChildComponent
  },
    dicts: [ 'income_type'],
  data() {
    let maxDate = null;
    return {
          // 显示搜索条件
      showSearch: true,
      // 版本号
      version: "3.9.0",
            // 用户列表数据加载状态
      userAppListOptions: [],
      userAppListLoading: false,
      searchTimer: null,
      formData: {
        appType: 1,
        appName: undefined,
        country: [],
        orderDate: null,
        field101: 1,
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        appId: null,
        balance: null,
        incomeType: null,
        dateRange: getWeekDateRange(),
      },
       financialSummary: null,
      // 图表实例
      chartInstance: null,
      // 日期选择器配置
      datePickerOptions: {
        // Use a regular function for disabledDate but don't reference 'this'
        disabledDate: function(time) {
          // Get today's date with time set to end of day
          const today = new Date();
          today.setHours(23, 59, 59, 999);

          // If maxDate is set (after selecting a start date), apply both constraints
          if (maxDate) {
            return time.getTime() > Math.min(today.getTime(), maxDate.getTime());
          }

          // Default: disable future dates only
          return time.getTime() > today.getTime();
        },

        // Use arrow function for onPick to maintain Vue instance context
        onPick: ({ maxDate: selectedMaxDate, minDate: selectedMinDate }) => {
          if (selectedMinDate && !selectedMaxDate) {
            // When start date is selected, calculate exact 6 months later
            const sixMonthsLater = new Date(selectedMinDate);
            sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

            // Get today's date with time set to end of day
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            // Ensure max date doesn't exceed today
            maxDate = sixMonthsLater > today ? today : sixMonthsLater;
          }
          // Reset maxDate when selection is cleared
          else if (!selectedMinDate) {
            maxDate = null;
          }
        }
      }
    }
  },
  methods: {
  fetchFinancialSummary() {
      getUserFinancialSummary().then(res => {
        if (res.code === 200) {
          this.financialSummary = res.data
          // console.log('财务汇总数据：', res.data)
        }
      })
    },// 获取每日消费数据
    fetchDailyConsumptionData() {
      // 构建请求参数
      const params = {
        appId: this.queryParams.appId || 0,
        startDate: this.queryParams.dateRange[0],
        endDate: this.queryParams.dateRange[1]

      }

      getUserDailyConsumptionList(params).then(res => {
        if (res.code === 200 && res.data && res.data.length > 0) {
          // 处理返回的数据，转换为图表需要的格式
          this.chartData = {
            dates: res.data.map(item => item.date),
            consumptionData: res.data.map(item => item.amount)
          }
          // 初始化或更新图表
          this.initChart()
        } else {
          // 无数据时显示空图表
          this.chartData = { dates: [], consumptionData: [] }
          this.initChart()
        }
      }).catch(error => {
        console.error('获取每日消费数据失败:', error)
        // 错误处理
        this.chartData = { dates: [], consumptionData: [] }
        this.initChart()
      })
    },
    // 2. 添加初始化图表方法
    initChart() {
       // 获取图表容器
      const chartDom = document.getElementById('consumptionChart')
      if (!chartDom) return

      // 创建图表实例
      this.chartInstance = echarts.init(chartDom)

      // 图表配置
      const option = {
        title: {
          text: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            const date = params[0].name
            const value = params[0].value
            return `${date}<br/>消费金额: $${value.toFixed(2)}`
          }
        },
        legend: {
          data: [''],
          // bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chartData.dates.length > 0 ? this.chartData.dates : ['暂无数据'],
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '¥{value}'
          }
        },
        series: [
          {
            name: '每日消费',
            type: 'line',
            data: this.chartData.consumptionData.length > 0 ? this.chartData.consumptionData : [0],
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#45b7d1'
            },
            itemStyle: {
              color: '#45b7d1'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(69, 183, 209, 0.5)'
                },
                {
                  offset: 1,
                  color: 'rgba(69, 183, 209, 0.1)'
                }
              ])
            }
          }
        ]
      }

      // 设置图表配置
      this.chartInstance.setOption(option)

      // 添加窗口大小变化时的图表自适应
      window.addEventListener('resize', this.handleResize)
    },

    // 图表自适应方法
    handleResize() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    },// 处理用户搜索
    handleAppSearch(query) {
      // console.log('用户搜索...',query);
      // 清除之前的定时器
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      // 设置防抖，300毫秒后执行搜索
      this.searchTimer = setTimeout(() => {
        this.loadUserAppListOptions(query);
      }, 300);
    },

    // 加载用户列表选项
    loadUserAppListOptions(inputParam) {
      // console.log('加载用户列表选项...',inputParam);
      this.userAppListLoading = true;

      // 构建查询参数，根据是否有输入值决定传参
      const queryParams = {};
      if (inputParam) {
        // 有输入值时，传递搜索参数（根据实际API调整字段名）
        queryParams.appName = inputParam;
        queryParams.pageNum = 1;
        queryParams.pageSize = 100; // 一次获取足够多的选项
      }

      // 调用用户列表API
      listApp(queryParams).then(response => {
        // console.log('用户列表参数:', queryParams);
        // console.log('用户列表响应:', response); // 添加日志以便调试
        const userApps = response.rows || response.data || [];
        // 转换为select组件需要的格式
        this.userAppListOptions = userApps.map(app => ({
          label: app.appName + " " + app.appId,
          value: app.id
        }));
      }).catch(error => {
        console.error('获取用户应用列表失败:', error);
        this.userAppListOptions = [];
      }).finally(() => {
        this.userAppListLoading = false;
      });
    },
  },

  // 组件挂载时初始化
  mounted() {
    this.fetchDailyConsumptionData()

     this.loadUserAppListOptions()
  },

  created() {
    this.fetchFinancialSummary()
  },

  // 组件销毁时清理资源
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped lang="scss">
.dashboard-container {
  padding: 20px;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #eee;
    
    .title {
      margin: 0;
      font-size: 24px;
      font-weight: 500;
      color: #303133;
    }
    
    .header-actions {
      .el-button {
        margin-left: 10px;
      }
    }
  }
  
  .card-container {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    margin-bottom: 20px;
  }

  .panel-group {
    margin-top: 18px;
    
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0,21,41,.08);
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 0 20px;

      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-money {
          background: #40c9c6;
        }
        .icon-shopping {
          background: #36a3f7;
        }
      }

      .icon-money {
        color: #40c9c6;
      }
      
      .icon-shopping {
        color: #36a3f7;
      }

      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }

      .card-panel-icon {
        float: left;
        font-size: 48px;
      }

      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;

        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 12px;
        }

        .card-panel-num {
          font-size: 24px;
          font-weight: bold;
        }
        
        .text-red {
          color: #ff6b6b;
        }
        
        .text-green {
          color: #4ecdc4;
        }
      }
    }
  }

  .filter-container {
    padding-bottom: 0;
  }

  .chart-container {
    position: relative;
    
    .box-title {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 500;
      color: #303133;
      text-align: center;
    }
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    
    .header-actions {
      margin-top: 16px;
    }
  }
  
  .panel-group .card-panel {
     .card-panel-description {
        margin: 10px;
     }
  }
}
</style>

