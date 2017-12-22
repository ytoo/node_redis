
// redis.createClient()连接本地的redis服务器

var redis = require("redis");
var client = redis.createClient();

//Redis的Connection事件之一，当与redis服务器连接成功后会触发这个事件，
// 此时表示已经准备好接收命令，当这个事件触发之前client命令会存在队列中，当一切准备就绪后按顺序调用
client.on("ready",function(err){
     console.log("ready")
})