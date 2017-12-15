
// 密码连接redis服务器

var redis = require("redis"),
    RDS_PORT = 6379,  // 端口号
    RDS_HOST = "127.0.1.1",  // 服务器IP
    RDS_PWD = "porschev",
    RDS_OPTS = {},    // 设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

    // 方法二，通过client.auth(password,callback)连接redis服务器
client.auth(RDS_PWD,function(){
    console.log("通过验证")
})
client.on("ready",function(err){
     console.log("ready");
     // 打印出RedisClient对象
    //  console.log(client);
})