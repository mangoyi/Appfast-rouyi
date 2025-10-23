<template>
  <div class="app-container">
    <div class="promotion-container">
      <div class="page-header">
        <h3>选择适合您的推广服务，提升应用市场表现</h3>
      </div>

      <!-- 促销服务卡片网格布局 -->
      <div class="promotion-grid">
        <div 
          v-for="(card, index) in promotionCards" 
          :key="index"
          class="promotion-card"
          @click="handleCardClick(card.type)"
        >
          <div class="card-badge" :class="`badge-${card.badgeType}`">{{ card.badge }}</div>
          <div class="card-image">
            <img :src="card.image" :alt="card.title" />
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-description">{{ card.description }}</p>
            <el-button 
              type="primary" 
              size="small" 
              class="order-button"
              @click.stop="handleCardClick(card.type)"
            >
              立即订购
            </el-button>
          </div>
        </div>
      </div>
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
      },
      // 促销卡片数据
      promotionCards: [
        {
          type: 1,
          title: '关键词安装',
          description: '您获得的安装次数越多，关键字排名越高，您获得的自然流量就越多。',
          image: p1Pic,
          badge: '5折',
          badgeType: 'hot'
        },
        {
          type: 2,
          title: '下载量',
          description: '提升应用下载量，增强应用市场排名，获得更多曝光机会。',
          image: p2Pic,
          badge: '5折',
          badgeType: 'hot'
        },
        {
          type: 3,
          title: '用户评价',
          description: '高质量用户评价可以提升应用可信度，增加下载转化率。',
          image: p3Pic,
          badge: '6折',
          badgeType: 'popular'
        },
        {
          type: 4,
          title: '星级评分',
          description: '提升应用星级评分，改善应用在市场中的整体形象。',
          image: p4Pic,
          badge: '7折',
          badgeType: 'normal'
        },
        {
          type: 5,
          title: '推荐位',
          description: '获得应用商店推荐位，大幅提升应用曝光度和下载量。',
          image: p5Pic,
          badge: '8折',
          badgeType: 'normal'
        },
        {
          type: 6,
          title: 'ASO优化',
          description: '专业ASO优化服务，提升应用在搜索结果中的排名。',
          image: p6Pic,
          badge: '6折',
          badgeType: 'popular'
        }
      ]
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
      // 使用Vue Router进行导航，避免页面刷新
      this.$router.push(`/promotion/createOrder?type=${type}`)
    },
  }
}
</script>

<style lang="scss" scoped>
.promotion-container {
  padding: 15px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.page-header {
  text-align: center;
  margin-bottom: 20px;
  padding: 15px 0;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 6px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.promotion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 20vh; /* 20%空白区域 */
}

.promotion-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-3px);
  }
}

.card-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 3px 8px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  z-index: 2;
}

.badge-hot {
  background: linear-gradient(135deg, #ff4949, #ff6b6b);
  color: white;
}

.badge-popular {
  background: linear-gradient(135deg, #409eff, #64b5f6);
  color: white;
}

.badge-normal {
  background: linear-gradient(135deg, #67c23a, #95d475);
  color: white;
}

.card-image {
  height: 80px;
  background: linear-gradient(120deg, #e0f7fa, #f8f9fa);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 70%;
    max-height: 60px;
    object-fit: contain;
  }
}

.card-content {
  padding: 15px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.card-description {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  margin: 0 0 10px 0; /* 减少底部边距 */
  min-height: 54px;
}

.order-button {
  width: 100%;
  background: linear-gradient(135deg, #409eff, #1a73e8);
  border: none;
  font-weight: 500;
  padding: 10px;
  font-size: 13px;
  margin-top: 5px; /* 添加顶部边距以保持适当间距 */
  
  &:hover {
    background: linear-gradient(135deg, #1a73e8, #0d5bb8);
  }
}

/* 响应式设计 */
@media (max-width: 1100px) {
  .promotion-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
}

@media (max-width: 768px) {
  .promotion-container {
    padding: 12px;
  }
  
  .page-title {
    font-size: 22px;
  }
  
  .page-subtitle {
    font-size: 13px;
  }
  
  .promotion-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 14px;
  }
  
  .card-image {
    height: 100px;
  }
  
  .card-content {
    padding: 12px;
  }
  
  .card-title {
    font-size: 15px;
  }
  
  .card-description {
    font-size: 11px;
    min-height: 50px;
    margin: 0 0 8px 0; /* 移动端进一步减少间距 */
  }
  
  .order-button {
    padding: 8px;
    font-size: 12px;
    margin-top: 3px; /* 移动端较小的顶部边距 */
  }
}

@media (max-width: 480px) {
  .promotion-container {
    padding: 10px;
  }
  
  .page-header {
    margin-bottom: 15px;
    padding: 10px 0;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .page-subtitle {
    font-size: 12px;
  }
  
  .promotion-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding-bottom: 15vh;
  }
  
  .card-image {
    height: 90px;
  }
  
  .card-content {
    padding: 10px;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .card-description {
    font-size: 11px;
    margin-bottom: 8px; /* 移动端进一步减少间距 */
  }
  
  .order-button {
    padding: 8px;
    font-size: 12px;
  }
}
</style>