import request from '@/utils/request'

// 查询客户APP记录列表
export function listApp(query) {
  return request({
    url: '/system/app/list',
    method: 'get',
    params: query
  })
}

// 查询客户APP记录详细
export function getApp(id) {
  return request({
    url: '/system/app/' + id,
    method: 'get'
  })
}

// 新增客户APP记录
export function addApp(data) {
  return request({
    url: '/system/app',
    method: 'post',
    data: data
  })
}

// 修改客户APP记录
export function updateApp(data) {
  return request({
    url: '/system/app',
    method: 'put',
    data: data
  })
}

// 删除客户APP记录
export function delApp(id) {
  return request({
    url: '/system/app/' + id,
    method: 'delete'
  })
}
