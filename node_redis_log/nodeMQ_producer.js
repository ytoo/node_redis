var nodeMQ = require("./nodeMQ");

var count = 1;
console.time("producer");
var timer = setInterval(function(){
  nodeMQ.producer("listKey","time",count);
  count ++;
  if(count > 10000){
      clearInterval(timer);
  }
},10)

console.timeEnd("producer")