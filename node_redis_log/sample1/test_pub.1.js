

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
  publish("listKey","time",count+"一");
  count ++;
  if(count > 50){
      clearInterval(timer);
  }
},10)

console.timeEnd("pub")



