
// 密码连接redis服务器

var redis = require("redis"),
    RDS_PORT = 6379,  // 端口号
    RDS_HOST = "127.0.1.1",  // 服务器IP
    RDS_PWD = "porschev",
    RDS_OPTS = {},    // 设置项
    // 创建RedisClient对象
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

    // 方法二，通过client.auth(password,callback)连接redis服务器
client.auth(RDS_PWD,function(){
    console.log("通过验证,密码连接成功")
})

// 设置redis中的String字符串
client.set("string key","string val",redis.print);
// 设置redis中的hash散列
client.hset("hash key","hashtest1","some value",redis.print);
client.hset("hash key","hashtest1","some value11",redis.print);
client.hset("hash key","hashtest3","some value",redis.print);
client.hset("hash key","hashtest2","some other value",redis.print);
client.hmset("hash key","hashtest1","some value","hashtest4","some value4",redis.print);
// 获取到所有hash散列中的keys中的键名
client.hkeys("hash key",(err,replies) => {
    console.log(replies.length + "   replies:");
    console.dir(replies);
    replies.forEach((reply,index) => {
        console.log("   " + index + ":" + reply);
    })
    client.quit();
})

// 获取到所有hash散列中的keys的键值对,结果是一个对象
client.hgetall("hash key",(err,res) => {
        if(err){
            console.log("ERROR:" + err);
            return;
        } 
        console.dir(res);
    })

client.on("error",err => {
     console.log("Error" + err);
     // 打印出RedisClient对象
    //  console.log(client);
})