
// publish/subscribe

var redis = require("redis");
var sub = redis.createClient(), pub = redis.createClient();
var msg_count = 0;

sub.on("subscribe",(channel,count) => {
    pub.publish("a nice channel","I am sending a message");
    pub.publish("a nice channel1","I am sending a second message");
    pub.publish("a nice channel2","I am sending my last message");
});

sub.on("message",(channel,message) => {
    console.log("sub channel  " + channel + ":" + message);
    msg_count += 1;
    // if(msg_count === 3){
    //     sub.unsubscribe();
    //     sub.quit();
    //     pub.quit();
    // }
})

sub.subscribe("a nice channel");