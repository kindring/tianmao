//只用来统一导出数据库封装的方法,不做查询等操作
const platform = require('./platform.js');
const platform_goods = require('./platform_goods.js');
const address = require('./address.js');
const merchant = require('./merchant.js');
const goods = require('./goods.js');
module.exports.platform=platform;
module.exports.platform_goods=platform_goods;
module.exports.address=address;
module.exports.merchant=merchant;
module.exports.goods=goods;