<template>
  <div class="page-container">
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="300px">
      <el-form-item label-width="100px" label="订单类型" prop="orderType">
        <el-radio-group v-model="formData.orderType" size="medium">
          <el-radio-button v-for="(item, index) in orderTypeOptions" :key="index" :label="item.value"
            :disabled="item.disabled" border>{{ item.label }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <el-row :gutter="15">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="20">
          <el-form-item label="应用商店" prop="storeType">
            <el-radio-group v-model="formData.storeType" size="medium" v-if="storeType === null">
              <el-radio-button v-for="(item, index) in storeTypeOptions" :key="index" :label="item.value"
                :disabled="item.disabled">{{ item.label }}</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="formData.storeType" size="medium" v-if="storeType === 1">
              <el-radio-button v-for="(item, index) in storeTypeOptions1" :key="index" :label="item.value"
                :disabled="item.disabled">{{ item.label }}</el-radio-button>
            </el-radio-group>
            <el-radio-group v-model="formData.storeType" size="medium" v-if="storeType === 2">
              <el-radio-button v-for="(item, index) in storeTypeOptions2" :key="index" :label="item.value"
                :disabled="item.disabled">{{ item.label }}</el-radio-button>
            </el-radio-group>
              <el-radio-group v-model="formData.storeType" size="medium" v-if="storeType === 3">
              <el-radio-button v-for="(item, index) in storeTypeOptions3" :key="index" :label="item.value"
                :disabled="item.disabled">{{ item.label }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="20" v-if="$auth.hasPermi('system:user:list')">
          <el-form-item label="用户名" prop="userId" style="width: 500px;">
              <el-select ref="dialogUserSelect" v-model="formData.userId" placeholder="请输入或选择用户"
                  filterable
                  remote
                  :remote-method="handleUserSearch"
                  :loading="userListLoading"
                  clearable
                  :style="{width: '100%'}"
                  :popper-append-to-body="true"
                  @visible-change="handleDialogUserSelectVisibleChange">
                <el-option v-for="item in userListOptions" :key="item.value" :label="item.label"
                    :value="item.value"></el-option>
              </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="应用" prop="customerAppId">
            <el-select 
              v-model="formData.customerAppId" 
              placeholder="请选择应用" 
              clearable
              :loading="appListLoading"
              :class="{'with-icon': formData.customerAppId}"
              :style="{ width: '30%' }">
              <el-option
                v-for="app in appListOptions"
                :key="app.value"
                :value="app.value"
                :label="app.label">
                <span style="display: inline-flex; align-items: center;">
                  <img :src="app.image" style="width: 16px; height: 16px; margin-right: 8px;">
                  {{ app.label }}
                </span>
              </el-option>
              <template slot="prefix" v-if="formData.customerAppId">
                <img 
                  :src="getAppIcon(formData.customerAppId)" 
                  style="width: 16px; height: 16px; vertical-align: middle; margin-top: -3px;"
                />
              </template>
            </el-select>
            <el-button 
              type="primary" 
              size="small"
              @click="goToAppPage" 
              style="margin-left: 10px;">
              添加应用 <i class="el-icon-external-link"></i>
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="订单时间" prop="orderDate">
            <template v-if="formData.orderType == 1">
              <el-date-picker :key="'date-single-' + formData.orderType" type="date" v-model="formData.orderDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                :style="{ width: '15%' }" :picker-options="datePickerOptions" placeholder="请选择日期" clearable></el-date-picker>
            </template>
            <template v-else>
              <el-date-picker :key="'date-range-' + formData.orderType" type="daterange" v-model="formData.orderDate" :picker-options="datePickerOptions" format="yyyy-MM-dd"
                value-format="yyyy-MM-dd" :style="{ width: '50%' }" start-placeholder="开始日期" end-placeholder="结束日期"
                range-separator="至" clearable></el-date-picker>
            </template> <span style="margin-left: 30px; color: blue;">System Time (UCT+8) :<span id="currentTime"
                style="margin-left: 10px;">{{ currentTime }}</span></span>
            <!-- 文本框，显示当前系统时间 -->
            <!-- <div class="time-display"> 
                  
                </div> -->
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-divider></el-divider>
        </el-col>
        <el-col :span="24" v-if="formData.orderType == 1">
          <el-form-item label="执行小时" prop="executionHour">
            <el-select v-model="formData.executionHour" placeholder="请选择执行小时" filterable clearable  popper-append-to-body>
              <el-option v-for="item in executeHourOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <!-- 关键词安装 -->
          <el-form-item label="地区关键词" prop="orderAreaKeywords" v-if="formData.orderType == 1">
            <div style="margin: 5px 0;">
              <el-button type="primary" size="small" icon="el-icon-download" @click="downloadTemplate">
                下载模版
              </el-button>

              <el-upload :action="uploadUrl" :headers="uploadHeaders" :show-file-list="false" accept=".xls,.xlsx,.csv"
                :on-success="handleImportSuccess" :on-error="handleImportError"
                style="display: inline-block; margin-left: 10px;">
                <el-button type="success" size="small" icon="el-icon-upload2">批量导入</el-button>
              </el-upload>
            </div>

            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex"
              style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
              <el-row :gutter="15">
                <el-col :span="6">
                  <el-form-item :label="`国家/地区`">
                     <el-select 
                        v-model="areaConfig.area" 
                        placeholder="请选择国家/地区" 
                        clearable
                        :class="{'with-icon': areaConfig.area}"
                        style="width: 220px">
                        <el-option
                          v-for="country in countryOptions"
                          :key="country.value"
                          :value="country.value"
                          :label="country.label">
                          <span style="display: inline-flex; align-items: center;">
                            <img :src="country.image" style="width: 16px; height: 16px; margin-right: 8px;">
                            {{ country.label }}
                          </span>
                        </el-option>
                        <template slot="prefix" v-if="areaConfig.area">
                          <img 
                            :src="getCountryIcon(areaConfig.area)" 
                            style="width: 16px; height: 16px; vertical-align: middle; margin-top: -3px;"
                          />
                        </template>
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
                    <el-input v-if="scope.$index === 0" v-model="scope.row.keyword" placeholder="请输入关键词"
                      @keyup.enter.native="handleKeywordEnter(scope.row, areaIndex)"></el-input>
                    <span v-else>{{ scope.row.keyword }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="每日数量" width="150">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.count" placeholder="请输入每日数量"
                      @keyup.enter.native="handleKeywordEnter(scope.row, areaIndex)"></el-input>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="ranking" label="排名" width="120">
                  <template slot-scope="scope">
                    <span>{{ scope.row.ranking || '-' }}</span>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button v-if="scope.$index > 0" type="text"
                      @click="removeKeywordRow(scope.$index, areaIndex)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div style="margin-top: 10px;">
              <el-button type="primary" size="small" @click="addAreaConfig">添加地区配置</el-button>
            </div>
          </el-form-item>
          <!-- 下载量 -->
          <el-form-item label="地区下载量" prop="orderAreaKeywords" v-if="formData.orderType == 2">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex"
              style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
              <el-row :gutter="15">
                <el-col :span="7">
                  <el-form-item :label="`国家/地区`">
                     <el-select 
                        v-model="areaConfig.area" 
                        placeholder="请选择国家/地区" 
                        clearable
                        :class="{'with-icon': areaConfig.area}"
                        style="width: 220px">
                        <el-option
                          v-for="country in countryOptions"
                          :key="country.value"
                          :value="country.value"
                          :label="country.label">
                          <span style="display: inline-flex; align-items: center;">
                            <img :src="country.image" style="width: 16px; height: 16px; margin-right: 8px;">
                            {{ country.label }}
                          </span>
                        </el-option>
                        <template slot="prefix" v-if="areaConfig.area">
                          <img 
                            :src="getCountryIcon(areaConfig.area)" 
                            style="width: 16px; height: 16px; vertical-align: middle; margin-top: -3px;"
                          />
                        </template>
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
          <el-form-item label="地区评分" prop="orderAreaKeywords" v-if="formData.orderType == 3">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex"
              style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item :label="`国家/地区`">
                     <el-select 
                        v-model="areaConfig.area" 
                        placeholder="请选择国家/地区" 
                        clearable
                        :class="{'with-icon': areaConfig.area}"
                        style="width: 220px">
                        <el-option
                          v-for="country in countryOptions"
                          :key="country.value"
                          :value="country.value"
                          :label="country.label">
                          <span style="display: inline-flex; align-items: center;">
                            <img :src="country.image" style="width: 16px; height: 16px; margin-right: 8px;">
                            {{ country.label }}
                          </span>
                        </el-option>
                        <template slot="prefix" v-if="areaConfig.area">
                          <img 
                            :src="getCountryIcon(areaConfig.area)" 
                            style="width: 16px; height: 16px; vertical-align: middle; margin-top: -3px;"
                          />
                        </template>
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
                    <el-input :value="areaConfig.star5Amount * orderDaysDiff" placeholder="总数" style="width: 100px"
                      disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="4星评分">
                    <el-input v-model="areaConfig.star4Amount" placeholder="评分数" style="width: 150px"></el-input>
                    <el-input :value="areaConfig.star4Amount * orderDaysDiff" placeholder="总数" style="width: 100px"
                      disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div style="margin-top: 10px;">
              <el-button type="primary" size="small" @click="addAreaConfig">添加地区配置</el-button>
            </div>
          </el-form-item>
          <!-- 评论 -->
          <el-form-item label="地区评论" prop="orderAreaKeywords" v-if="formData.orderType == 4">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex"
              style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item :label="`国家/地区`">
                     <el-select 
                        v-model="areaConfig.area" 
                        placeholder="请选择国家/地区" 
                        clearable
                        :class="{'with-icon': areaConfig.area}"
                        style="width: 220px">
                        <el-option
                          v-for="country in countryOptions"
                          :key="country.value"
                          :value="country.value"
                          :label="country.label">
                          <span style="display: inline-flex; align-items: center;">
                            <img :src="country.image" style="width: 16px; height: 16px; margin-right: 8px;">
                            {{ country.label }}
                          </span>
                        </el-option>
                        <template slot="prefix" v-if="areaConfig.area">
                          <img 
                            :src="getCountryIcon(areaConfig.area)" 
                            style="width: 16px; height: 16px; vertical-align: middle; margin-top: -3px;"
                          />
                        </template>
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
                  <el-form-item label="5星评论">
                    <el-input v-model="areaConfig.star5Amount" placeholder="评论数" style="width: 150px"></el-input>
                    <el-input :value="areaConfig.star5Amount * orderDaysDiff" placeholder="总数" style="width: 100px"
                      disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="4星评论">
                    <el-input v-model="areaConfig.star4Amount" placeholder="评论数" style="width: 150px"></el-input>
                    <el-input :value="areaConfig.star4Amount * orderDaysDiff" placeholder="总数" style="width: 100px"
                      disabled></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <div style="margin-top: 10px;">
              <el-button type="primary" size="small" @click="addAreaConfig">添加地区配置</el-button>
            </div>
          </el-form-item>
          <!-- 关键词保排名 -->
          <el-form-item label="关键词保排名服务" prop="orderAreaKeywords" v-if="formData.orderType == 5">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex"
              style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item :label="`国家/地区`">
                     <el-select 
                        v-model="areaConfig.area" 
                        placeholder="请选择国家/地区" 
                        clearable
                        :class="{'with-icon': areaConfig.area}"
                        style="width: 220px">
                        <el-option
                          v-for="country in countryOptions"
                          :key="country.value"
                          :value="country.value"
                          :label="country.label">
                          <span style="display: inline-flex; align-items: center;">
                            <img :src="country.image" style="width: 16px; height: 16px; margin-right: 8px;">
                            {{ country.label }}
                          </span>
                        </el-option>
                        <template slot="prefix" v-if="areaConfig.area">
                          <img 
                            :src="getCountryIcon(areaConfig.area)" 
                            style="width: 16px; height: 16px; vertical-align: middle; margin-top: -3px;"
                          />
                        </template>
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
                    <el-input v-if="scope.$index === 0" v-model="scope.row.keyword" placeholder="请输入关键词"
                      @keyup.enter.native="handleKeepRankEnter(scope.row, areaIndex)"></el-input>
                    <span v-else>{{ scope.row.keyword }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="targetRank" label="目标排名" width="180">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.targetRank" placeholder="目标排名" style="width: 120px">
                      <el-option v-for="opt in targetRankOptions" :key="opt.value" :label="opt.label"
                        :value="opt.value"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button v-if="scope.$index > 0" type="text"
                      @click="removeKeepRankRow(scope.$index, areaIndex)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div style="margin-top: 10px;">
              <el-button type="primary" size="small" @click="addAreaConfig">添加地区配置</el-button>
            </div>
          </el-form-item>
          <!-- 关键词覆盖服务 -->
          <el-form-item label="关键词覆盖服务" prop="orderAreaKeywords" v-if="formData.orderType == 6">
            <div v-for="(areaConfig, areaIndex) in formData.orderAreaKeywords" :key="areaIndex"
              style="margin-bottom: 20px; border: 1px solid #dcdfe6; padding: 15px; border-radius: 4px;">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item :label="`国家/地区`">
                     <el-select 
                        v-model="areaConfig.area" 
                        placeholder="请选择国家/地区" 
                        clearable
                        :class="{'with-icon': areaConfig.area}"
                        style="width: 220px">
                        <el-option
                          v-for="country in countryOptions"
                          :key="country.value"
                          :value="country.value"
                          :label="country.label">
                          <span style="display: inline-flex; align-items: center;">
                            <img :src="country.image" style="width: 16px; height: 16px; margin-right: 8px;">
                            {{ country.label }}
                          </span>
                        </el-option>
                        <template slot="prefix" v-if="areaConfig.area">
                          <img 
                            :src="getCountryIcon(areaConfig.area)" 
                            style="width: 16px; height: 16px; vertical-align: middle; margin-top: -3px;"
                          />
                        </template>
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
                    <el-input v-if="scope.$index === 0" v-model="scope.row.keyword" placeholder="请输入关键词"
                      @keyup.enter.native="handleCoverEnter(scope.row, areaIndex)"></el-input>
                    <span v-else>{{ scope.row.keyword }}</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="currentRank" label="当前排名" width="180">
                  <template slot-scope="scope">
                    <span>{{ scope.row.currentRank || '-' }}</span>
                  </template>
                </el-table-column> -->
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button v-if="scope.$index > 0" type="text"
                      @click="removeCoverRow(scope.$index, areaIndex)">删除</el-button>
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
                    <el-option v-for="type in communicateTypeOptions" :key="type.value" :label="type.label"
                      :value="type.value"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-input v-model="formData.communicateNumber" placeholder="请输入联系方式号码"
                    style="width: 200px"></el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-form-item size="large">
            <div class="form-footer">
              <div class="total-amount">
                合计: <span class="amount">${{ totalAmount }}</span>
              </div>
              <!-- With this code -->
              <div class="total-amount detail-popover" style="margin-right: 20px;" v-if="formData.orderType === 1 || formData.orderType === 2 || formData.orderType === 3 || formData.orderType === 4">
                <el-popover placement="top" width="150" trigger="hover">
                  <div class="popover-content">
                    <div class="item">
                      <span class="label">单价：</span>
                      <span class="value">${{ unitPrice.toFixed(2) }}</span>
                    </div>
                    <div class="item">
                      <span class="label">日量：</span>
                      <span class="value">{{ dayQuantity }}</span>
                    </div>
                    <div class="item">
                      <span class="label">天数：</span>
                      <span class="value">{{ orderDaysDiff }} 天</span>
                    </div>
                    <div class="item">
                      <span class="label">总量：</span>
                      <span class="value">{{ totalQuantity }} </span>
                    </div>
                  </div>
                  <div slot="reference" class="detail-trigger">
                    明细
                  </div>
                </el-popover>
              </div>
              <div class="buttons">
                <el-button type="primary" @click="submitForm">提交</el-button>
              </div>
            </div>
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
import { listApp, getSimpleAppList } from "@/api/appkeyword/app"
// 4. 导入订单API
import { createPromotionOrder } from "@/api/promotion/order"
import { getToken } from '@/utils/auth'
import auth from '@/plugins/auth'
// 5. 导入国家选项的API
import { getCountryOptions, getTime } from "@/api/promotion/country"
import { time } from "echarts"

export default {
  components: {},
  props: [],
  dicts: ['execution_hours', 'unit_price'],
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
      storeType: null,
      // 用户下拉查询参数
      userQueryParams: {
        pageNum: 1,
        pageSize: 10,
        idOrName: null,
      },
      currentTime: null,
      serverTimestamp: null,
      timer: null,
      formData: {
        // API字段映射
        customerAppId: undefined,           // 应用ID
        userId: undefined,                // 用户ID（管理员可选）
        beginDate: null,           // 订单开始日期
        endDate: null,             // 订单结束日期
        orderAreaKeywords: [],     // 地区和关键词安装列表
        orderKeywordRanks: [],     // 关键词保排名列表
        orderType: null,              // 关键词安装类型
        storeType: null,              // 应用商店
        executionHour: undefined,  // 可执行小时
        communicateNumber: '',     // 联系方式号码
        communicateType: 1,        // 联系方式类型
        orderPrice: 0.00,             // 订单价格

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
      }, {
        "label": "iPad",
        "value": 3
      }],
      storeTypeOptions1: [{
        "label": "AppStore",
        "value": 1
      }],
      storeTypeOptions2: [{
        "label": "Google Play",
        "value": 2
      }],
      storeTypeOptions3: [{
        "label": "iPad",
        "value": 3
      }],
      countryOptions: [
        // { label: "美国", value: "us" },
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
      countryLoading: false,
      // 关键词保排名的目标排名选项
      targetRankOptions: [
        { label: 'top1', value: 'top1' },
        { label: 'top2', value: 'top2' },
        { label: 'top3', value: 'top3' },
        { label: 'top5', value: 'top5' },
        { label: 'top10', value: 'top10' }
      ],
      // 联系方式类型选项
      communicateTypeOptions: [
        { label: 'WeChat', value: 1 },
        { label: 'Telegram', value: 2 },
        { label: 'WhatsApp', value: 3 }
      ],
      uploadUrl: process.env.VUE_APP_BASE_API + '/normal/order/import/keyword  ',
      uploadHeaders: { Authorization: 'Bearer ' + getToken() },
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        }
      }
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
    getUnitPriceByType() {
      // Access the dictionary data
      const dictData = this.dict.type.unit_price || [];
      // alert(dictData);
      // Return a function that accepts orderType parameter
      return (orderType) => {
        if (!dictData.length) return 0;

        // Find the matching dictionary entry
        const dictEntry = dictData.find(item =>
          item.value === orderType.toString()
        );

        // Return the price value or 0 if not found
        return dictEntry ? parseFloat(dictEntry.label) || 0 : 0;
      };
    },
    // 计算总金额
    totalAmount() {
      // 这里只是一个示例计算逻辑，你需要根据实际业务需求调整
      let total = 0;
      const unitPrice = this.getUnitPriceByType(this.formData.orderType);
      // 根据不同的订单类型计算总金额
      if (this.formData.orderType === 1) {

        // 关键词安装
        this.formData.orderAreaKeywords.forEach(areaConfig => {
          if (areaConfig.keywordList) {
            areaConfig.keywordList.forEach(keyword => {
              if (keyword.count) {
                // 示例：每个关键词每天1元
                total += parseInt(keyword.count) * unitPrice || 0;
              }
            });
          }
        });
      } else if (this.formData.orderType === 2) {
        // 下载量
        this.formData.orderAreaKeywords.forEach(areaConfig => {
          if (areaConfig.downloadCount) {
            // 示例：每个下载量1元
            total += parseInt(areaConfig.downloadCount) * unitPrice || 0;
          }
        });
      } else if (this.formData.orderType === 3 || this.formData.orderType === 4) {
        // 评分或评论
        this.formData.orderAreaKeywords.forEach(areaConfig => {
          if (areaConfig.star5Amount) {
            // 示例：每个5星评分2元
            total += (parseInt(areaConfig.star5Amount) || 0) * unitPrice;
          }
          if (areaConfig.star4Amount) {
            // 示例：每个4星评分1.5元
            total += (parseInt(areaConfig.star4Amount) || 0) * unitPrice;
          }
        });
      } else if (this.formData.orderType === 5) {
        // 关键词保排名
        this.formData.orderAreaKeywords.forEach(areaConfig => {
          if (areaConfig.keepRankList) {
            areaConfig.keepRankList.forEach(rank => {
              // 示例：每个保排名关键词5元
              total += 500;
            });
          }
        });
      } else if (this.formData.orderType === 6) {
        // 关键词覆盖服务
        this.formData.orderAreaKeywords.forEach(areaConfig => {
          if (areaConfig.coverList) {
            areaConfig.coverList.forEach(cover => {
              // 示例：每个覆盖关键词3元
              total += 300;
            });
          }
        });
      }

      // 乘以天数
      if (this.formData.orderType !== 1) {
        total *= this.orderDaysDiff;
      }

      return total.toFixed(2);
    },
    unitPrice() {
      return this.getUnitPriceByType(this.formData.orderType);
    },

    dayQuantity() {
      let total = 0;

      // Calculate total quantity based on order type
      if (this.formData.orderType === 1) {
        // 关键词安装
        this.formData.orderAreaKeywords.forEach(areaConfig => {
          if (areaConfig.keywordList) {
            areaConfig.keywordList.forEach(keyword => {
              if (keyword.count) {
                total += parseInt(keyword.count) || 0;
              }
            });
          }
        });
      } else if (this.formData.orderType === 2) {
        // 下载量
        this.formData.orderAreaKeywords.forEach(areaConfig => {
          if (areaConfig.downloadCount) {
            total += parseInt(areaConfig.downloadCount) || 0;
          }
        });
      } else if (this.formData.orderType === 3 || this.formData.orderType === 4) {
        // 评分或评论
        this.formData.orderAreaKeywords.forEach(areaConfig => {
          if (areaConfig.star5Amount) {
            total += parseInt(areaConfig.star5Amount) || 0;
          }
          if (areaConfig.star4Amount) {
            total += parseInt(areaConfig.star4Amount) || 0;
          }
        });
      } else if (this.formData.orderType === 5) {
        // 关键词保排名
        this.formData.orderAreaKeywords.forEach(areaConfig => {
          if (areaConfig.keepRankList) {
            total += areaConfig.keepRankList.length || 0;
          }
        });
      } else if (this.formData.orderType === 6) {
        // 关键词覆盖服务
        this.formData.orderAreaKeywords.forEach(areaConfig => {
          if (areaConfig.coverList) {
            total += areaConfig.coverList.length || 0;
          }
        });
      }

      return total;
    },
    totalQuantity() { 
      return this.dayQuantity * this.orderDaysDiff
    },
    
  },
  watch: {
    // 监听订单类型变化，重新初始化地区配置
    'formData.orderType'(newType, oldType) {
      if (newType !== oldType) {
        // 清空现有配置
        this.formData.orderAreaKeywords = []
        // 重新初始化
        this.initFirstAreaConfig()
        // 重置订单日期
        this.formData.orderDate = null

          // 延迟更新日期选择器，防止定位错误
      this.$nextTick(() => {
        // 强制刷新页面以修复日期选择器定位
        if (this.$refs.elForm) {
          this.$refs.elForm.clearValidate(['orderDate'])
        }
      })
      }
    },
    // 监听订单类型变化，重新初始化地区配置
    'formData.storeType'(newType, oldType) {
      if (newType !== oldType) {
        // 清空现有配置
        this.formData.appListOptions = []
        // 重新初始化
        this.loadAppListOptions()
      }
    },
    'formData.userId'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.formData.appListOptions = [];
        this.loadAppListOptions();
      }
    },
  },
  created() {
    // 从路由query初始化订单类型（默认1）
    const qType = this.$route && this.$route.query ? parseInt(this.$route.query.type) : NaN
    this.formData.orderType = Number.isNaN(qType) ? 1 : qType
    // 从路由query初始化商店类型（默认1）
    const sType = this.$route && this.$route.query ? parseInt(this.$route.query.storeType) : NaN
    if (!Number.isNaN(sType)) {
      this.storeType = sType
      this.formData.storeType = sType
    }

    // 用户没有权限时，不执行获取用户列表数据
    if (auth.hasPermi('system:user:list')) {
      this.loadUserListOptions()
    }


    // 组件创建时加载用户列表数据
    // this.loadUserListOptions()
    // 加载执行小时选项数据
    this.loadExecuteHourOptions()
    // 加载应用列表数据
    this.loadAppListOptions()
    // 初始化第一个地区配置
    this.initFirstAreaConfig()
    // 加载国家选项数据
    this.loadCountryOptions()
  },
  mounted() {
    // Fetch initial time
    this.fetchSystemTime();
    // Update time every second
    this.timer = setInterval(this.updateLocalTime, 1000);
  },
  methods: {
    resetStoreTypeOptions(selectedStoreType) {
      // 根据路由参数禁用其他选项，只保留选中的选项可用
      this.storeTypeOptions = this.storeTypeOptions.map(option => {
        return {
          disabled: option.value !== selectedStoreType
        }
      })
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
    // Add to methods section
goToAppPage() {
  // Pass a query parameter to indicate that the modal should be opened
  this.$router.push({
    path: '/appkeyword/app',
    query: { openAdd: 'true' }
  });
},
// Fetch server time only once
fetchSystemTime() {
  try {
    getTime().then(response => {
      this.currentTime = response.msg;
      // Store the server timestamp for local calculation
      this.serverTimestamp = Date.now();
    });
  } catch (error) {
    console.error('Failed to fetch system time:', error);
    // Fallback to client time if API fails
    this.currentTime = new Date().toLocaleString();
    this.serverTimestamp = Date.now();
  }
},
// Update time locally without API calls
updateLocalTime() {
  if (this.serverTimestamp) {
    // Calculate current time based on initial server timestamp
    const now = new Date();
    this.currentTime = now.toLocaleString();
  } else {
    // Fallback if server time was never fetched
    this.currentTime = new Date().toLocaleString();
  }
},
    downloadTemplate() {
      this.download('/normal/order/keyword/importTemplate', {}, '订单导入模板.xlsx')
    },
    // 获取国家图标
    getCountryIcon(code) {
      // 根据国家代码查找对应的图标
      const country = this.countryOptions.find(c => c.value === code);
      return country ? country.image : null;
    },
      // 获取app图标
    getAppIcon(id) {
      // 根据国家代码查找对应的图标
      const app = this.appListOptions.find(c => c.id === id);
      return app ? app.image : null;
    },
    handleImportSuccess(response) {
  // 如需刷新数据/回显，可在此处追加逻辑
  if (response.code === 200) {
    this.$message.success('导入成功')

    try {
      // Clear existing data before importing new data
      this.formData.orderAreaKeywords = [];

      // rows的数据结构 [{area: 'us', keyword: '20', amount: 30},{area: 'cn', keyword: '20', amount: 30}]
      const rows = response.rows;
      // console.log('rows');
      // 根据订单类型，按地区归并数据并填充到表单
      if (!Array.isArray(rows)) return;

      // 先将已有的按地区的映射建立，便于合并
      const areaToConfig = new Map();
      (this.formData.orderAreaKeywords || []).forEach(cfg => {
        if (cfg && cfg.area) areaToConfig.set(cfg.area, cfg);
      });

      // 逐行处理导入数据
      rows.forEach(item => {
        const area = item.area;
        if (!area) return;

        // 取/建对应的地区配置
        let areaCfg = areaToConfig.get(area);
        if (!areaCfg) {
          areaCfg = { area };
          // 针对不同类型初始化不同结构
          if (this.formData.orderType === 1) {
            areaCfg.keywordList = [];
          } else if (this.formData.orderType === 2) {
            areaCfg.downloadCount = 0;
          }
          areaToConfig.set(area, areaCfg);
        }

        // 不同订单类型下的填充逻辑
        if (this.formData.orderType === 1) {
          // 关键词安装：累计 keywordList（keyword/count）
          const keyword = (item.keyword || '').toString().trim();
          const count = Number(item.amount) || 0;
          if (!Array.isArray(areaCfg.keywordList)) areaCfg.keywordList = [];
          if (keyword && count > 0) {
            areaCfg.keywordList.push({ keyword, count });
          }
        } else if (this.formData.orderType === 2) {
          // 下载量：按地区汇总 downloadCount
          const add = Number(item.amount) || 0;
          areaCfg.downloadCount = (Number(areaCfg.downloadCount) || 0) + add;
        }
      });

      // 生成新的数组（保持原有顺序基础上追加新地区）
      const merged = [];
      areaToConfig.forEach(cfg => {
        // 清理空数据：类型1要求有 keywordList；类型2 需要正数下载量
        if (this.formData.orderType === 1) {
          if (Array.isArray(cfg.keywordList) && cfg.keywordList.length > 0) {
            merged.push(cfg);
          }
        } else if (this.formData.orderType === 2) {
          if ((Number(cfg.downloadCount) || 0) > 0) {
            merged.push(cfg);
          }
        } else {
          // 其他类型暂不处理导入，直接忽略
        }
      });

      this.formData.orderAreaKeywords = merged;
    } catch (err) {
      console.log(err)
    }
  }
},
    handleImportError(err) {
      this.$message.error('导入失败，请重试')
      // 可按需查看 err 定位具体问题
    },
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return

        // 处理表单数据，转换为API需要的格式
        const submitData = this.processFormData()
        // console.log('提交数据:', submitData)

        // 调用创建订单API
        this.createOrder(submitData)
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
        executionHour: this.formData.executionHour,
        orderPrice: this.totalAmount,
        userId: this.formData.userId
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

      return apiData
    },
    // 创建订单
    createOrder(data) {
      this.$confirm('确认提交订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 显示加载状态
        const loading = this.$loading({
          lock: true,
          text: '正在提交订单...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })

        createPromotionOrder(data).then(response => {
          loading.close()
         
          if (!response.data.paid) {
            
            // 显示模态框而不是简单的消息提示
            this.$confirm('账户余额不足，请联系客服进行充值！', '余额不足', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'warning'
            }).then(() => {
                if (this.formData.storeType === 1) {
                  this.$router.push('/order/apple?storeType=1')
                } else if (this.formData.storeType === 2) {
                  this.$router.push('/order/google?storeType=2')
                } else {
                  this.$router.push('/order/ipad?storeType=3')
                }
            })
          } else {
            this.$message.success('订单提交成功！')
            if (this.formData.storeType === 1) {
              this.$router.push('/order/apple?storeType=1')
            } else if (this.formData.storeType === 2) {
              this.$router.push('/order/google?storeType=2')
            } else {
              this.$router.push('/order/ipad?storeType=3')
            }
          }

          // 重置表单
          this.resetForm()
        }).catch(error => {
          loading.close()
          console.error('订单创建失败:', error)
          this.$message.error('订单创建失败，请重试')
        })
      }).catch(() => {
        // 用户取消操作
      })
    },
    resetForm() {
      this.$refs['elForm'].resetFields()
      // 重新初始化第一个地区配置
      this.formData.orderAreaKeywords = []
      this.formData.orderType = null
      this.initFirstAreaConfig()
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
    beforeDestroy() {
  // Clear the timer to prevent memory leaks
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
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
    // 初始化第一个地区配置
    initFirstAreaConfig() {
      if (this.formData.orderAreaKeywords.length === 0) {
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
            star4Amount: '',
          });
        } else if (this.formData.orderType === 4) {
          // 评论类型
          this.formData.orderAreaKeywords.push({
            area: '',
            star5Amount: '',
            star4Amount: '',
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
      // console.log('执行力')
      getExecuteHourOptions().then(response => {
        // console.log('执行小时选项响应:', response);
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

      // Clear the currently selected application
      this.formData.customerAppId = undefined;

      const query = { 
        page: 1, 
        limit: 100, 
        storeType: this.formData.storeType,
        userId: this.formData.userId 
      };
      getSimpleAppList(query).then(response => {
        // console.log('应用列表响应:', response);
        const apps = response.rows || response.data || [];
        this.appListOptions = apps.map(app => ({
          id: app.customerAppId,
          label: app.appName || app.name || app.customerAppId,
          value: app.customerAppId,
          image: app.iconImage
        }));
      }).catch(error => {
        console.error('获取应用列表失败:', error);
        this.appListOptions = [];
      }).finally(() => {
        this.appListLoading = false;
      });
    },

    // 加载国家选项数据
    loadCountryOptions() {
      this.countryLoading = true;
      getCountryOptions().then(response => {
        // console.log('国家选项响应:', response);
        const countries = response.rows || response.data || [];
        this.countryOptions = countries.map(country => ({
          label: country.name,
          value: country.code,
          image: country.flagImage
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
    // 处理用户选择下拉框的可见性变化
    handleUserSelectVisibleChange(visible) {
      this.handleSelectVisibleChange(visible, 'userSelect');
    },
    // 处理商店类型下拉框的可见性变化
    handleStoreTypeSelectVisibleChange(visible) {
      this.handleSelectVisibleChange(visible, 'storeTypeSelect');
    },
    // 处理对话框中用户下拉框的可见性变化
    handleDialogUserSelectVisibleChange(visible) {
      this.handleSelectVisibleChange(visible, 'dialogUserSelect');
    },
    // 处理对话框中商店类型下拉框的可见性变化
    handleDialogStoreTypeSelectVisibleChange(visible) {
      this.handleSelectVisibleChange(visible, 'dialogStoreTypeSelect');
    },
    // 处理对话框中地区下拉框的可见性变化
    handleDialogAreaSelectVisibleChange(visible) {
      this.handleSelectVisibleChange(visible, 'dialogAreaSelect');
    },
    // 统一处理下拉框的可见性变化
    handleSelectVisibleChange(visible, selectRef) {
      if (visible) {
        // 下拉框打开时，绑定全局点击事件监听器
        this.bindOutsideClickHandler(selectRef);
      } else {
        // 下拉框关闭时，解绑全局点击事件监听器
        this.unbindOutsideClickHandler();
      }
    },
    // 绑定外部点击处理器
    bindOutsideClickHandler(currentSelectRef) {
      // 防止重复绑定
      if (!this.outsideClickListener) {
        this.outsideClickListener = (event) => {
          const target = event.target;
          
          // 检查点击的元素是否是当前下拉框或其子元素
          const currentSelect = this.$refs[currentSelectRef];
          if (currentSelect && currentSelect.$el.contains(target)) {
            return;
          }
          
          // 检查是否点击了其他下拉框
          const allSelectRefs = ['userSelect', 'storeTypeSelect', 'dialogUserSelect', 'dialogStoreTypeSelect', 'dialogAreaSelect'];
          for (const selectRef of allSelectRefs) {
            const select = this.$refs[selectRef];
            if (select && select.$el.contains(target)) {
              return;
            }
          }
          
          // 如果点击的是空白区域，关闭当前下拉框
          this.$nextTick(() => {
            if (this.$refs[currentSelectRef]) {
              this.$refs[currentSelectRef].$refs.reference.focus();
              this.$refs[currentSelectRef].visible = false;
            }
          });
        };
        
        document.addEventListener('click', this.outsideClickListener, true);
      }
    },
    // 解绑外部点击处理器
    unbindOutsideClickHandler() {
      if (this.outsideClickListener) {
        document.removeEventListener('click', this.outsideClickListener, true);
        this.outsideClickListener = null;
      }
    },
  }
}

</script>
<style scoped>
.page-container {
  margin: 20px;
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

/* Detail popover styles */
.detail-popover {
  position: relative;
}

.detail-trigger {
  cursor: pointer;
  border-bottom: 1px dashed #409EFF;
  display: inline-block;
}

.detail-trigger:hover {
  color: #409EFF;
}

/* Popover content styling */
.el-popover {
  padding: 12px !important;
}

.popover-content {
  font-size: 14px;
  line-height: 1.5;
}

.popover-content .item {
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.popover-content .item:last-child { 
  margin-bottom: 0;
}

.popover-content .label {
  font-weight: bold;
  color: #606266;
}

.popover-content .value {
  color: #333;
  text-align: right;
}

.el-table--medium .el-table__cell{padding:5px 0 !important}
</style>