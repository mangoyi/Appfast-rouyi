import request from '@/utils/request'

// 获取执行小时选项列表
export function getExecuteHourOptions() {
  return request({
    url: '/promotion/executeHour/options',
    method: 'get'
  })
}
