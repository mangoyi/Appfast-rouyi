import request from '@/utils/request'

// 查询客户普通订单记录列表
export function listOrder(query) {
  return request({
    url: '/normal/order/list',
    method: 'get',
    params: query
  })
}

// 查询客户普通订单记录详细
export function getOrder(id) {
  return request({
    url: '/normal/order/' + id,
    method: 'get'
  })
}

// 新增客户普通订单记录
export function addOrder(data) {
  return request({
    url: '/normal/order',
    method: 'post',
    data: data
  })
}

// 修改客户普通订单记录
export function updateOrder(data) {
  return request({
    url: '/normal/order',
    method: 'put',
    data: data
  })
}

// 删除客户普通订单记录
export function delOrder(id) {
  return request({
    url: '/normal/order/' + id,
    method: 'delete'
  })
}

// 查询客户消费订单记录列表
export function costListOrder(query) {
  return request({
    url: '/normal/order/costList',
    method: 'get',
    params: query
  })
}
