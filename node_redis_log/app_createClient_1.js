
// node连接本地的redis服务器

var redis = require("redis");
var client = redis.createClient();

client.on("ready",function(err){
     console.log("ready")
})