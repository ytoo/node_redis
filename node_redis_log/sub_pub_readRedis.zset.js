var redis = require("redis");  
var path = require("path");
var fs = require("fs");
var client1 = redis.createClient(6379, "127.0.0.1");
var client2 = redis.createClient(6379, "127.0.0.1");
var client = redis.createClient(6379, "127.0.0.1");  

// 订阅及发布，都是需要单独的client的，一个client同时只能做一个事情，这也就是上面初始化了那么多client的原因。

function getRedisData() {  
    //客户端连接redis成功后执行回调
    client.on("ready", () => {
        //订阅频道消息
        client.subscribe("chat");
        client.subscribe("chat1");
        client.subscribe("chat2");
        console.log("订阅成功。。。");
    });

    client.on("error", (error) => {
        console.log("Redis Error " + error);
    });


    //监听订阅成功事件
    client.on("subscribe", (channel, count) => {
        console.log("client subscribed to " + channel + "," + count + "total subscriptions");
    });

    // 监听message事件，客户端将为与主动订阅匹配的每个接收到的消息发出消息。侦听器将通道名称作为通道传递，消息作为消息传递。
    //收到消息后执行回调，msg是redis发布的消息
    client.on("message", (channel, msg) => {
        // 可以根据msg的值，做不同的业务逻辑处理
        console.log(channel + "频道接收到信息了：" + msg);
        dealWithMsg(msg);
    });

    //监听取消订阅事件
    client.on("unsubscribe", (channel, count) => {
        console.log("client unsubscribed from" + channel + ", " + count + " total subscriptions")
    });
}

var data = [];
function dealWithMsg(message) {   
     var obj = {};
    //在有序集合zset中按照message查询redis中的内容
    client1.zscore("z", message, (err, reply) => {
        if(err){
            throw err;
        }
        console.log(message + "的内容是：" + reply);
        // 将订阅到的信息存入本地的log.txt文件
        obj[message] = reply;
        data.push(obj);
        fs.writeFile("./log.txt",JSON.stringify(data),function(err){
            if(err){
                throw err;
            }
            console.log("写入log.txt文件成功")
        })

        // client1.zrange("z",0,-1,(err,reply) => {
        //     console.log(reply)
        // })
    });
}
getRedisData();