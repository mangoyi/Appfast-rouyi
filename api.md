创建安装订单接口参数：
```bash

{
  # appId 下拉选择
  "appId": "887314963", 
  # 订单开始日期 
  "beginDate": "2025-10-02",
  # 订单结束日期 
  "endDate": "2025-10-12",
  # 地区和关键词安装列表
  "orderAreaKeywords": [
    {
      "area": "us",
       "keywordList":[{"keyword": "us"},{"count": 10},{"keyword": "dd"},{"count": 9}]
    },{
      "area": "cn",
      "keywordList":[{"keyword": "hh"},{"count": 10}]
    }
  ],
  # 关键词安装
  "orderType": 1,
  # 应用商店
  "storeType": 1,
  # 可执行小时
  "executionHour": 2
}
```


创建下载量订单接口参数：
{
  "appId": "887314963",
  "beginDate": "2025-10-02",
  "endDate": "2025-10-12",
  "customerAppId": 1,
  "orderAreaComments": [],
  "orderAreaDownloads": [
    {
      "area": "us",
      "downloadAmount": 10
    },{
      "area": "cn",
      "downloadAmount": 9
    }
  ],
  "orderAreaScores": [
  ],
  "orderCountryKeyword": [
  ],
  "orderStatus": 1,
  "orderType": 2,
  "remark": "string",
  "storeType": 1,
  "executionHour": 3

}

创建评分订单接口参数
{
  "appId": "887314963",
  "beginDate": "2025-09-29",
  "endDate": "2025-10-01",
  "customerAppId": 1,
  "orderAreaComments": [],
  "orderAreaDownloads": [
  ],
  "orderAreaScores": [{
       "area": "us",
      "scoreAmount":16,
      "starLevel": 5
    },{
      "area": "cn",
      "scoreAmount": 9,
      "starLevel": 4}
  ],
  "orderCountryKeyword": [
  ],
  "orderStatus": 1,
  "orderType": 3,
  "storeType": 1,
  "executionHour": 4
}

创建评论订单
{
  "appId": "887314963",
  "beginDate": "2025-10-11",
  "endDate": "2025-10-21",
  "customerAppId": 1,
  "orderAreaComments": [ {
            "area": "us",
            "commentDetailList": [
                {
                    "commentContent": "好用的boss",
                    "commentTitle": "boss不错，一直坚持用"
                },{
                    "commentContent": "好s",
                    "commentTitle": "错愕错，一直坚持用"
                }
            ],
            "starLevel": 5
        },{
            "area": "cn",
            "commentDetailList": [
                {
                    "commentContent": "好boss",
                    "commentTitle": "不错，一直坚持用"
                }
            ],
            "starLevel": 4
        }],
  "orderAreaDownloads": [
  ],
  "orderAreaScores": [
  ],
  "orderCountryKeyword": [
  ],
  "orderStatus": 1,
  "orderType": 4,
  "remark": "string",
  "storeType": 1,
  "executionHour": 1
}

关键词保排名订单，下单参数
{
  "appId": "887314963",
  "communicateNumber": "18918",
  "communicateType": 1,
  "customerAppId": 1,
  "orderKeywordRanks": [
    {
      "area": "us",
      "keywordRankList": [
        {
          "keyword": "你好",
"targetRank": 1

        },{
          "keyword": "好",
"targetRank": 2
        }
      ]
    },{
      "area": "cn",
      "keywordRankList": [
        {
          "keyword": "tabuhao",
"targetRank": 3
        }
      ]
    }
  ],
  "orderStatus": 1,
  "orderType": 5,
  "remark": "string",
  "storeType": 1
}

关键词覆盖订单，下单参数
{
  "appId": "887314963",
  "communicateNumber": "18918",
  "communicateType": 1,
  "customerAppId": 1,
  "orderKeywordRanks": [
    {
      "area": "us",
      "keywordRankList": [
        {
          "keyword": "你好"
        },{
          "keyword": "好"
        }
      ]
    },{
      "area": "cn",
      "keywordRankList": [
        {
          "keyword": "tabuhao"
        }
      ]
    }
  ],
  "orderStatus": 1,
  "orderType": 6,
  "remark": "string",
  "storeType": 1
}
