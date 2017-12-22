
var redis = require("redis");  
var client4 = redis.createClient(6379, "127.0.0.1");

// 向redis的有序集合zset中添加数据
/**
 * 
 * @param {*} key  键名 
 * @param {*} score 分值，根据数字大小进行排序
 * @param {*} member 成员，根据相关联的分值进行排序
 */
function zadd(key, score, member) {  
    // redis缓存数据
    client4.zadd(key, score, member, () => {
        client4.publish("chat", member);//client将member发布到chat这个频道
        //然后订阅这个频道的订阅者就会收到消息
    });
}


for(var i = 0; i < 20; i++) {  
    (function(i) {  
        setTimeout(() => {  
            zadd("z", i, "success " + i*2);//发布
            console.log("第" + i + "次发布信息");    
        }, 1000*i);  
    })(i);  
} 

