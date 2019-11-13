//只用来统一导出数据库封装的方法,不做查询等操作
const platform = require('./platform.js');
const platform_goods = require('./platform_goods.js');
module.exports.platform=platform;
module.exports.platform_goods=platform_goods;