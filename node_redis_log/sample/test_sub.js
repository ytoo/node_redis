

var subscribe = require("./sub_pub_readRedis")
// 订阅频道信息

console.time("sub")
subscribe("listKey")
console.timeEnd("sub")
