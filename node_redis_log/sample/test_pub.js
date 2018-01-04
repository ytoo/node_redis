

var publish = require("./sub_pub_publish")

// 发布信息 key => value的形式
// var obj = {};
// var str = "companyName"
// for (var i = 0; i < 1; i++) {
//     obj[str + i] = "www.pingan.com"  + i;
// }

var count = 0;


console.time("pub");
var timer = setInterval(function(){
  publish("listKey","time",Date.now());
  count ++;
  if(count > 10){
      clearInterval(timer);
  }
},1)

console.timeEnd("pub")



