
// 密码连接redis服务器

var redis = require("redis"),
    RDS_PORT = 6379,  // 端口号
    RDS_HOST = "127.0.1.1",  // 服务器IP
    RDS_PWD = "porschev",
    // 方法一：通过设置redis.createClient()的第三个参数，设置密码连接
    RDS_OPTS = {auth_pass:RDS_PWD},    // 设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);


client.on("ready",function(err){
     console.log("ready");
     // 打印出RedisClient对象
    //  console.log(client);
})