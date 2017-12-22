
// publish/subscribe

var redis = require("redis");
var client = redis.createClient(), client1 = redis.createClient();
var msg_count = 0;

client1.publish("a nice channel","I am sending a message");
client1.publish("a nice channel","I am sending a second message");
client1.publish("a nice channel","I am sending my last message");

//订阅频道消息
client.subscribe(`a nice channel`);

//监听订阅成功事件
client.on("subscribe",(channel,count) => {
    console.log("client subscribed to " + channel + "," + count + "total subscriptions");
});


// 监听message事件，客户端将为与主动订阅匹配的每个接收到的消息发出消息。侦听器将通道名称作为通道传递，消息作为消息传递。
    //收到消息后执行回调
client.on("message",(channel,message) => {
    console.log("sub channel  " + channel + ":" + message);
    msg_count += 1;
    if(msg_count === 3){
        // 取消订阅
        client.unsubscribe();
        // 关闭与redis服务器的连接
        client.quit();
        client1.quit();
    }
})

