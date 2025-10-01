import request from '@/utils/request'

// 查询客户关键词订单记录列表
export function listOrder(query) {
  return request({
    url: '/keyword/order/list',
    method: 'get',
    params: query
  })
}

// 查询客户关键词订单记录详细
export function getOrder(id) {
  return request({
    url: '/keyword/order/' + id,
    method: 'get'
  })
}

// 新增客户关键词订单记录
export function addOrder(data) {
  return request({
    url: '/keyword/order',
    method: 'post',
    data: data
  })
}

// 修改客户关键词订单记录
export function updateOrder(data) {
  return request({
    url: '/keyword/order',
    method: 'put',
    data: data
  })
}

// 删除客户关键词订单记录
export function delOrder(id) {
  return request({
    url: '/keyword/order/' + id,
    method: 'delete'
  })
}
