<template>
  <div class="app-container">
    <div class="app-container">
      <!-- 促销服务卡片网格布局 - 每行三个卡片，共两行 -->
      <div class="promotion-grid">
        <!-- 第一行卡片 -->
        <!-- <div class="keyword-install-card card dd-flex dd-align-center" @click="handleCardClick">
          <img :src="p1Pic" alt="关键词安装" class="img" />
          <div class="content">
            <div class="dd-flex dd-align-center">
              <div class="title">关键词安装</div>
              <div class="half-bg">
                5折
              </div>
            </div>
            <el-tooltip class="txt dd-omit-2" effect="dark" placement="top" content="您获得的安装次数越多，关键字排名越高，您获得的自然流量就越多。">
              <div class="description">
                您获得的安装次数越多，关键字排名越高，您获得的自然流量就越多。
              </div>
            </el-tooltip>
            <el-button type="default" size="small" class="btn" @click.stop="handleCardClick">
              新建订单
            </el-button>
          </div>
        </div> -->
        <a href="" class="keyword-install-card card dd-flex dd-align-center"
          @click="handleCardClick(1)">
          <img :src="p1Pic" alt="关键词安装" class="img" />
          <div class="content">
            <div class="dd-flex dd-align-center">
              <div class="title">关键词安装</div>
              <div class="half-bg">
                5折
              </div>
            </div>
            <el-tooltip class="txt dd-omit-2" effect="dark" placement="top" content="提升应用下载量，增强应用市场排名，获得更多曝光机会。">
              <div class="description">
                您获得的安装次数越多，关键字排名越高，您获得的自然流量就越多。
              </div>
            </el-tooltip>
            <el-button type="default" size="small" class="btn" @click.stop="handleCardClick(1)">
              新建订单
            </el-button>
          </div>
        </a>

        <a href="" class="keyword-install-card card dd-flex dd-align-center"
          @click="handleCardClick(2)">
          <img :src="p2Pic" alt="下载量" class="img" />
          <div class="content">
            <div class="dd-flex dd-align-center">
              <div class="title">下载量</div>
              <div class="half-bg">
                5折
              </div>
            </div>
            <el-tooltip class="txt dd-omit-2" effect="dark" placement="top" content="提升应用下载量，增强应用市场排名，获得更多曝光机会。">
              <div class="description">
                提升应用下载量，增强应用市场排名，获得更多曝光机会。
              </div>
            </el-tooltip>
            <el-button type="default" size="small" class="btn" @click.stop="handleCardClick(2)">
              新建订单
            </el-button>
          </div>
        </a>

        <a href="" class="keyword-install-card card dd-flex dd-align-center"
          @click="handleCardClick(3)">
          <img :src="p3Pic" alt="用户评价" class="img" />
          <div class="content">
            <div class="dd-flex dd-align-center">
              <div class="title">用户评价</div>
              <div class="half-bg">
                6折
              </div>
            </div>
            <el-tooltip class="txt dd-omit-2" effect="dark" placement="top" content="高质量用户评价可以提升应用可信度，增加下载转化率。">
              <div class="description">
                高质量用户评价可以提升应用可信度，增加下载转化率。
              </div>
            </el-tooltip>
            <el-button type="default" size="small" class="btn" @click.stop="handleCardClick(3)">
              新建订单
            </el-button>
          </div>
        </a>

        <!-- 第二行卡片 -->
        <a href="" class="keyword-install-card card dd-flex dd-align-center"
          @click="handleCardClick(4)">
          <img :src="p4Pic" alt="星级评分" class="img" />
          <div class="content">
            <div class="dd-flex dd-align-center">
              <div class="title">星级评分</div>
              <div class="half-bg">
                7折
              </div>
            </div>
            <el-tooltip class="txt dd-omit-2" effect="dark" placement="top" content="提升应用星级评分，改善应用在市场中的整体形象。">
              <div class="description">
                提升应用星级评分，改善应用在市场中的整体形象。
              </div>
            </el-tooltip>
            <el-button type="default" size="small" class="btn" @click.stop="handleCardClick(4)">
              新建订单
            </el-button>
          </div>
        </a>

        <a href="" class="keyword-install-card card dd-flex dd-align-center"
          @click="handleCardClick(5)">
          <img :src="p5Pic" alt="推荐位" class="img" />
          <div class="content">
            <div class="dd-flex dd-align-center">
              <div class="title">推荐位</div>
              <div class="half-bg">
                8折
              </div>
            </div>
            <el-tooltip class="txt dd-omit-2" effect="dark" placement="top" content="获得应用商店推荐位，大幅提升应用曝光度和下载量。">
              <div class="description">
                获得应用商店推荐位，大幅提升应用曝光度和下载量。
              </div>
            </el-tooltip>
            <el-button type="default" size="small" class="btn" @click.stop="handleCardClick(5)">
              新建订单
            </el-button>
          </div>
        </a>

        <a href="" class="keyword-install-card card dd-flex dd-align-center" @click="handleCardClick(6)">
          <img :src="p6Pic" alt="ASO优化" class="img" />
          <div class="content">
            <div class="dd-flex dd-align-center">
              <div class="title">ASO优化</div>
              <div class="half-bg">
                6折
              </div>
            </div>
            <el-tooltip class="txt dd-omit-2" effect="dark" placement="top" content="专业ASO优化服务，提升应用在搜索结果中的排名。">
              <div class="description">
                专业ASO优化服务，提升应用在搜索结果中的排名。
              </div>
            </el-tooltip>
            <el-button type="default" size="small" class="btn" @click.stop="handleCardClick(6)">
              新建订单
            </el-button>
          </div>
        </a>
      </div>

      <!-- 促销服务列表 - 适配RuoYi-Vue框架 -->
      <!-- <div v-loading="loading" class="service-list">
      <div v-for="service in services" :key="service.id" class="service-card">
          <div class="card-header">
              <h3>{{ service.title }}</h3>
              <span v-if="service.discount" class="discount-badge">{{ service.discount }}</span>
          </div>
          <div class="card-content">
              <p>{{ service.description }}</p>
          </div>
          <div class="card-footer">
              <span class="price">{{ service.price }}</span>
              <el-button type="primary" size="small" @click="addToCart(service)">
                  <i class="el-icon-shopping-cart"></i> 订购
              </el-button>
          </div>
      </div>
    </div> -->
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import p1Pic from '@/assets/promo/p1.png'
import p2Pic from '@/assets/promo/p2.png'
import p3Pic from '@/assets/promo/p3.png'
import p4Pic from '@/assets/promo/p4.png'
import p5Pic from '@/assets/promo/p5.png'
import p6Pic from '@/assets/promo/p6.png'


// 组件适配为RuoYi-Vue标准格式
export default {
  name: 'Promotion',
  data() {
    return {
      // 遮罩层 - 标准加载状态
      loading: false,
      //图片资源
      p1Pic: p1Pic,
      p2Pic: p2Pic,
      p3Pic: p3Pic,
      p4Pic: p4Pic,
      p5Pic: p5Pic,
      p6Pic: p6Pic,
      // 促销服务列表数据
      services: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  // 组件创建时自动加载数据
  created() {
    // this.getList()
  },
  methods: {
    /** 查询促销服务列表 - 从服务端获取数据 */
    getList() {
      this.loading = true
      request({
        url: '/promotion/service/list',
        method: 'get',
        params: this.queryParams
      }).then(response => {
        this.services = response.rows || []
        this.loading = false
      }).catch(error => {
        console.error('获取促销服务列表失败:', error)
        this.loading = false
        this.$message.error('获取促销服务列表失败，请稍后重试')
      })
    },

    /** 处理卡片点击事件 - 适配Vue路由 */
    handleCardClick(type) {
      // 阻止默认行为以使用Vue路由
      // alert('点击了卡片') 
      // e.preventDefault()
      this.$router.push(`/promotion/createOrder?type=${type}`)
    },

    /** 订购促销服务 - 适配框架的对话框和消息提示 */
    // addToCart(service) {
    //   this.$modal.confirm(`确认订购 ${service.title} 服务吗？`).then(() => {
    //     // 调用订购服务的API
    //     request({
    //       url: '/promotion/service/order',
    //       method: 'post',
    //       data: {
    //         serviceId: service.id,
    //         serviceName: service.title,
    //         price: service.price
    //       }
    //     }).then(() => {
    //       this.$message.success('订购成功')
    //     }).catch(() => {
    //       this.$message.error('订购失败，请稍后重试')
    //     })
    //   }).catch(() => {
    //     this.$message.info('已取消订购')
    //   })
    // }
  }
}
</script>

<style lang="scss" scoped>
/* 保留原有样式并添加RuoYi-Vue风格的布局 */
.keyword-install-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  /* 促销卡片网格布局 - 实现每行三个卡片 */
  .promotion-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  /* 调整卡片样式，移除原有margin-bottom，统一由网格gap控制 */
  .keyword-install-card {
    margin-bottom: 0 !important;
  }

  .img {
    width: 64px;
    height: 64px;
    margin-right: 16px;
    background-color: #f0f0f0;
    border-radius: 4px;
  }

  .content {
    flex: 1;
    min-width: 0;

    .dd-flex {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-right: 8px;
    }

    .half-bg {
      padding: 2px 8px;
      background-color: #ff4949;
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
    }

    .description {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
      margin-bottom: 12px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

/* 促销服务列表样式 - 改为网格布局 */
.service-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.service-card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h3 {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin: 0;
    }

    .discount-badge {
      padding: 2px 8px;
      background-color: #ff4949;
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
    }
  }

  .card-content {
    margin-bottom: 16px;

    p {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .price {
      font-size: 16px;
      font-weight: 600;
      color: #ff4949;
    }
  }
}

/* 页面标题和工具栏样式 */
.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.toolbar {
  display: flex;
  gap: 8px;
}

/* 保留原有样式并添加RuoYi-Vue风格的布局 */
.keyword-install-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  margin-bottom: 0 !important;
  width: 100%;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .img {
    width: 64px;
    height: 64px;
    margin-right: 16px;
    background-color: #f0f0f0;
    border-radius: 4px;
  }

  .content {
    flex: 1;
    min-width: 0;

    .dd-flex {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .title {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin-right: 8px;
    }

    .half-bg {
      padding: 2px 8px;
      background-color: #ff4949;
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
    }

    .description {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
      margin-bottom: 12px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}

/* 促销卡片网格布局 - 实现每行三个卡片 */
.promotion-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

/* 促销服务列表样式 - 改为网格布局 */
.service-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.service-card {
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;

    h3 {
      font-size: 16px;
      font-weight: 500;
      color: #333;
      margin: 0;
    }

    .discount-badge {
      padding: 2px 8px;
      background-color: #ff4949;
      color: #fff;
      font-size: 12px;
      border-radius: 4px;
    }
  }

  .card-content {
    margin-bottom: 16px;

    p {
      font-size: 13px;
      color: #666;
      line-height: 1.5;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .price {
      font-size: 16px;
      font-weight: 600;
      color: #ff4949;
    }
  }
}

/* 页面标题和工具栏样式 */
.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.toolbar {
  display: flex;
  gap: 8px;
}
</style>