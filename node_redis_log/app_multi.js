

var redis = require("redis"),
    RDS_PORT = 6379,  // 端口号
    RDS_HOST = "127.0.1.1",  // 服务器IP
    RDS_PWD = "porschev",
    RDS_OPTS = {},    // 设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

    // 方法二，通过client.auth(password,callback)连接redis服务器
client.auth(RDS_PWD,() => {
    console.log("通过验证")
})

client.on("connect",() => {
    // 设置redis中的set集合的值
    var key = "skills";
    client.sadd(key,"C#");
    client.sadd(key,{"JS":"JavaScript"});
    client.sadd(key,"JS");
    client.sadd(key,"nodeJS");

    // 开启一个redis事务
    client.multi()
    .sismember(key,"C#")
    .sismember(key,"SQL")
    .smembers(key)
    .exec((err,replies) => {
        console.log("MULTI got " + replies.length + " replies");
        replies.forEach((reply,index) => {
            console.log("Reply " + index + ":" + reply.toString());
        });
        client.quit();
    })

})

// 关闭与redis服务器的连接
client.on("end",err => {
     console.log("end");
     // 打印出RedisClient对象
    //  console.log(client);
})