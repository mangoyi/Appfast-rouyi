import request from '@/utils/request'

// 获取国家选项列表
export function getCountryOptions() {
  return request({
    url: '/area/config/list',
    method: 'get'
  })
}

export function getTime() {
  return request({
    url: '/area/config/time',
    method: 'get'
  })
}
