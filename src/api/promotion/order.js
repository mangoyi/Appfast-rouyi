import request from '@/utils/request'

// 创建推广订单
export function createPromotionOrder(data) {
  return request({
    url: '/normal/order',
    method: 'post',
    data: data
  })
}

// 更新推广订单
export function updatePromotionOrder(data) {
  return request({
    url: '/promotion/order/update',
    method: 'put',
    data: data
  })
}

// 获取推广订单详情
export function getPromotionOrder(id) {
  return request({
    url: `/normal/order/${id}`,
    method: 'get'
  })
}
