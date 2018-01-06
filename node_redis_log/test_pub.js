

var publish = require("./sub_pub_publish")

var count = 0;
console.time("pub");
var timer = setInterval(function(){
  publish("listKey","time",count);
  count ++;
  if(count >= 100){
      clearInterval(timer);
  }
},10)

console.timeEnd("pub")



