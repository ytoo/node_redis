// 连接远程redis服务器
var redis = require("redis"), 
    RDS_PORT = 6379,  // 端口号
    RDS_HOST = "127.0.1.1",  // 服务器IP
    RDS_OPTS = {};    // 设置项
var path = require("path");
var fs = require("fs");
var client1 = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
var client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);  

// 订阅及发布，都是需要单独的client的，一个client同时只能做一个事情，这也就是上面初始化了那么多client的原因。

// hashKeys需要记录日志信息的文件名标识
function getRedisData(hashKeys) {  
    //客户端连接redis成功后执行回调
    client.on("ready", () => {
        //订阅频道消息
        client.subscribe("chat");
        // client.subscribe("chat1");
        console.log("订阅成功。。。");
    });

    client.on("error", (error) => {
        console.log("Redis Error " + error);
    });


    //监听订阅成功事件
    client.on("subscribe", (channel, count) => {
        console.log("client subscribed to " + channel + "," + count + " total subscriptions");
    });

    // 监听message事件，客户端将为与主动订阅匹配的每个接收到的消息发出消息。侦听器将通道名称作为通道传递，消息作为消息传递。
    //收到消息后执行回调，msg是redis发布的消息
    client.on("message", (channel, msg) => {
        // 可以根据msg的值，做不同的业务逻辑处理，这里的msg就是hash里面的hkey键
        console.log(channel + "频道接收到信息了：" + msg);
        dealWithMsg(hashKeys,msg);
    });

    //监听取消订阅事件
    client.on("unsubscribe", (channel, count) => {
        console.log("client unsubscribed from" + channel + ", " + count + " total subscriptions")
    });
}

function dealWithMsg(hashKeys,msg) {   
   
    // 必须使用和client不一样的客户端获取数据，否则使用client.hget获取不到数据
    // 通过查询message获取到某个键的值msg => reply
    client1.hget(hashKeys,msg, (err, reply) =>  {
         console.log(msg + "的内容是：" + reply); 
    });

    // 获取到hash里面所有键值对集合
        client1.hgetall(hashKeys,(err,res) => {
            if(err){
                console.log("ERROR:" + err);
                return;
            } 

            // 所有的数据信息都存储在redisKeys里面
            client1.hmset("redisKeys",hashKeys,JSON.stringify(res),redis.print)
            client1.hgetall("redisKeys",(err,result) => {
                // console.dir(result);
                // console.log(JSON.stringify(result))
                // 把获取到的信息写入到本地文件进行存储
                fs.writeFile("./logger.txt",JSON.stringify(result),(err) => {
                    if(err){
                        throw err;
                    }
                    console.log("写入logger.txt文件成功")
                    // fs.readFile("./logger.txt","utf-8",function(err,data){
                    //     if(err){
                    //       throw err;
                    //     }
                    //     console.log(JSON.parse(data));
                    // })
                }) 
            })
                
        })
    

}
module.exports =  getRedisData