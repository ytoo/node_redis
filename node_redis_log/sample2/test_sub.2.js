

var subscribe = require("./sub_pub_readRedis.2")
// 订阅频道信息

console.time("sub")
subscribe("listKey")
console.timeEnd("sub")
