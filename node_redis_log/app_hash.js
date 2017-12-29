
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

// connect事务  Redis的Connection事件之一，在不设置client.options.no_ready_check的情况下，
// 客户端触发connect同时它会发出ready
client.on("connect",function(){
    // 注意：这里需要区分使用hmset与hset场景下的区别
    // 当key:value的键值对的形式的数大于1或者有使用对象{}表示时，需要使用hmset，
    // 单独只有一个key:value键值对设置时使用hset
    client.hmset("short",{"JS":"javascript","C#":"C sharp"},redis.print);
    client.hmset("short5",{"JS":"javascript","C#":"C sharp"},redis.print);
    client.hmset("short","JQ","Jquery","SQL","Structured Query Languange",redis.print);
    client.hset("short","hashtest4","some value",redis.print) // redis.print 简便的回调函数，测试时显示返回值
    client.hset("short5","hashtest4","some value",redis.print)
    // 获取到hash里面所有键值对集合
    client.hgetall("short",function(err,res){
        if(err){
            console.log("ERROR:" + err);
            return;
        } 
        console.dir(res);
    })
    
    // 获取到某个键的值
    client.hget("short","hashtest4",function(err,res){
        console.log(res);
    })

})

client.hmset("short","hashtest1","some value","hashtest11","some value1",(item) => {
    console.log("----")
    console.log(item);
    console.log("----")
});
client.hmset("short",{"hashtest2":"some other value"},redis.print);


client.on("ready",function(err){
     console.log("ready");
     // 打印出RedisClient对象
    //  console.log(client);
})