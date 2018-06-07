# 策略控制 api

实现针对策略的增删改查

## rule（策略/规则）

+ rule 结构
  + id
    + description: ID
    + type: number
  + name
    + description: 名字
    + type: string
  + rif (rule_if的缩写)
    + description: 条件
    + type: json
  + rthen (rule_then的缩写)
    + description: 操作
    + type: json

+ rif格式
  + 基础条件
    + 例如 { "a.level" : { "gt" : 50} } 
    + 含义 ： 当a的亮度大于50的时候
    + a : 设备ID，指代某一台设备
    + level : 设备的属性，这里指亮度，还可能有时间、风速、温度等等。
    + gt : 比较操作符>。还有eq(=)、lt(<)、gte(>=)、lte(>=)、bt(between,在···之间)
    + 50 : 属性的值，如果是bt可以是数组
  + and复合条件
    + 例如 { "and" : [ {···} , {···} ] }
    + 省略号代表一条基础规则
  + or复合条件  
    + 例如 { "or" : [ {···} , {···} ] }
    + 省略号代表一条基础规则

+ rthen格式    
  + 基础的
    + { "a.level" : 100 }
    + 含义 ： 设置a的亮度为100
  + 复杂的
    + { "a.online" : true, "a.level" : 150, "b.online" : false }
    + 含义 ： 打开灯a并设置灯a的亮度为150，同时关闭灯b


## 创建 rule

+ description: 创建 rule
+ path: /api/rules
+ verb: POST
+ req:
  + source: body
  + content-type: json
  + data: {rule}
    + root: true
    + id: false
+ res:
  + content-type: json
  + data: {rule}
    + root: true
    + id: true

+ example:
  + req
    + Content-Type: application/json
    + body: {"name": "level_policy1", "rif":{ "or":["a.level" : { "gt" : 50} }], "rthen":[{ "b.level" : 100 }] }
  + res
    + statusCode: 201
    + response: {"id":1, "name": "level_policy1", "rif":{ "or":["a.level" : { "gt" : 50} }], "rthen":[{ "b.level" : 100 }] }
  + errRes
    + statusCode: >=400

    

## 删除 rule

+ description: 删除 rule
+ path: /api/rules/:id
+ verb: DELETE
+ id:
  + source: path
+ res:
  + statusCode

+ example:
  + url= /api/rules/1, method="DELETE"
  + res
    + statusCode: 204
  + errRes
    + statusCode: >=400    


## 修改 rule

+ description: 修改 rule
+ path: /api/rules/:id
+ verb: PUT
+ req:
  + source: body
  + content-type: json
  + data: {rule}
    + root: true
    + id: false
+ res:
  + content-type: json
  + data: {rule}

+ example:
  + req
    + Content-Type: application/json
    + body: {"name": "level_policy1", "rif":{ "or":["a.level" : { "gt" : 50} }], "rthen":[{ "b.level" : 100 }] }
  + res
    + statusCode: 200
    + response:{"id":1, "name": "level_policy1", "rif":{ "or":["a.level" : { "gt" : 50} }], "rthen":[{ "b.level" : 100 }]  }
  + errRes
    + statusCode: >=400    



## 分页获取 rule

+ description: 获取 rule
+ path: /api/rules?name=_&limit=_ &offset=_
  + name为空时默认查询所有，name不为空查询给定值。
  + limit: 每页最多多少条数据。不给值采用默认值
  + offset: 数据偏移。从第几条数据开始查询。不给值默认偏移为0
+ verb: GET
+ res:
  + content-type: jsonArray
  + data: {rules}


+ example:
  + url:/api/rules?name=policy&limit=20 &offset=1, method="GET"
  + res
    + statusCode: 200
    + response: [{"id":1, "name": "level_policy1", "rif":{ "or":["a.level" : { "gt" : 50} }], "rthen":[{ "b.level" : 100 }]  },{...}]
  + errRes
    + statusCode: >=400    

## 获取rule总条数

+ description: 获取 rule总条数
+ path: /api/rules/count?name=_
  + name为空时默认查询所有，name不为空查询给定值。
+ verb: GET
+ res:
  + content-type: json
  + data: {"num":__}


+ example:
  + url:/api/rules?name=policy, method="GET"
  + res
    + statusCode: 200
    + response: {"num":100}
  + errRes
    + statusCode: >=400    


## 获取给定ID的rule

+ description: 获取获取给定ID的rule
+ path: /api/rules/:id
+ verb: GET
+ res:
  + content-type: json
  + data: {rule}

+ example:
  + url:/api/rules/1, method="GET"
  + res
    + statusCode: 200
    + response: {"id":1, "name": "level_policy1", "rif":{ "or":["a.level" : { "gt" : 50} }], "rthen":[{ "b.level" : 100 }] }
  + errRes
    + statusCode: >=400    