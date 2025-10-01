import request from '@/utils/request'

// 查询收入支出记录列表
export function listIncome(query) {
  return request({
    url: '/income/list',
    method: 'get',
    params: query
  })
}

// 查询收入支出记录详细
export function getIncome(id) {
  return request({
    url: '/income/' + id,
    method: 'get'
  })
}

// 新增收入支出记录
export function addIncome(data) {
  return request({
    url: '/income',
    method: 'post',
    data: data
  })
}

// 修改收入支出记录
export function updateIncome(data) {
  return request({
    url: '/income',
    method: 'put',
    data: data
  })
}

// 删除收入支出记录
export function delIncome(id) {
  return request({
    url: '/income/' + id,
    method: 'delete'
  })
}

// 查询用户财务汇总信息
export function getUserFinancialSummary() {
  return request({
    url: '/income/summary',
    method: 'get'
  })
}


// 查询用户财务汇总信息
export function getUserDailyConsumptionList(query) {
  return request({
    url: '/income/daily/list',
    method: 'get',
    params: query
  })
}
