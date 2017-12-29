

var publish = require("./sub_pub_publish")

// 发布信息 key => value的形式
// var obj = {};
// var str = "companyName"
// for (var i = 0; i < 1; i++) {
//     obj[str + i] = "www.pingan.com"  + i;
// }

console.time("pub");
publish("chat","Time:",Date.now());
console.timeEnd("pub")



