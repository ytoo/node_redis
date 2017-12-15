
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

client.on("connect",function(){
    // 注意：这里需要区分使用hmset与hset场景下的区别
    // 当key:value的键值对的形式的数大于1或者有使用对象{}表示时，需要使用hmset，
    // 单独只有一个key:value键值对设置时使用hset
    client.hmset("short",{"JS":"javascript","C#":"C sharp"},redis.print);
    client.hmset("short","JQ","Jquery","SQL","Structured Query Languange",redis.print);
    client.hset("short","hashtest4","some value",redis.print)
    client.hgetall("short",function(err,res){
        if(err){
            console.log("ERROR:" + err);
            return;
        } 
        console.dir(res);
    })
})

client.hmset("short","hashtest1","some value","hashtest11","some value1",redis.print);
client.hmset("short",{"hashtest2":"some other value"},redis.print);


client.on("ready",function(err){
     console.log("ready");
     // 打印出RedisClient对象
    //  console.log(client);
})