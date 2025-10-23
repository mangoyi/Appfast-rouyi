<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <!-- <h3>账户首页</h3> -->
      </el-col>
    </el-row>
    <!-- <el-divider /> -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="6" :lg="6">
        <el-card class="update-log" style="background-color: lightgoldenrodyellow; border-radius: 10px; ">
          <div slot="header" class="clearfix">
            <span style="font-size: 12px;">今日消费</span>
          </div>
          <div class="text-item-small">
            <!-- Replace optional chaining with safer syntax -->
            <span style="font-size: 24px; color: #ff6b6b; font-weight: bold;">${{ financialSummary && financialSummary.todayConsumption ? financialSummary.todayConsumption : '0.00' }}</span>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="6" :lg="6">
        <el-card class="update-log" style="background-color: lightgoldenrodyellow; border-radius: 10px;">
          <div slot="header" class="clearfix">
            <span>昨日消费</span>
          </div>
          <div class="text-item-small">
            <!-- Replace optional chaining with safer syntax -->
            <span style="font-size: 24px; color: #4ecdc4; font-weight: bold;">${{ financialSummary && financialSummary.yesterdayConsumption ? financialSummary.yesterdayConsumption : '0.00' }}</span>
          </div>
        </el-card>
      </el-col>

    </el-row>
    <el-divider />
    <el-row>
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="应用" prop="appId">
            <el-select v-model="queryParams.appId" placeholder="请输入或选择应用"
              filterable
              remote
              :remote-method="handleAppSearch"
              :loading="userAppListLoading"
              clearable
              @change="fetchDailyConsumptionData"
              :style="{width: '100%'}">
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
    </el-row>
    <el-row>
    <!-- 添加折线图容器 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" style="margin-top: 10px;">
        <el-card>
          <div slot="header" class="clearfix" style="text-align: center;">
            <span>每日消费趋势图</span>
          </div>
          <div id="consumptionChart" style="width: 100%; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>

import * as echarts from 'echarts'
import { getUserFinancialSummary, getUserDailyConsumptionList } from '@/api/income/income'
import { listApp } from "@/api/appkeyword/app"

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
.home {

   .text-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80px;
  }

   .text-item-small {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  }
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

