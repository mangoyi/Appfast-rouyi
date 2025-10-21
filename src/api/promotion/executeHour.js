import request from '@/utils/request'

// 获取执行小时选项列表
export function getExecuteHourOptions() {
  return request({
    url: '/system/dict/data/type/execution_hours',
    method: 'get'
  })
}
