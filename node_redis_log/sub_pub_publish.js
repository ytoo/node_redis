
// 连接远程的redis服务器
var redis = require("redis"), 
    RDS_PORT = 6379,  // 端口号
    RDS_HOST = "127.0.1.1",  // 服务器IP
    RDS_OPTS = {},    // 设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

// 向redis的hash散列中添加数据
/**
 * 
 * @param {*} hashKeys  键名 --->需要记录日志信息的文件名标识
 * @param {*} hoptions  需要记录的信息对象
 * @param {*} hkey 各不相同的键，无序排列 ---> 需要记录的具体信息名标识
 * @param {*} hvalue 与键关联的值 ---> 需要记录的信息的具体内容
 */
module.exports = function hset(hashKeys, hoptions) {  
    for (var hkey in hoptions) {
        var hvalue = hoptions[hkey];
        // redis缓存数据
        (function(hkey, hvalue){
            client.hset(hashKeys, hkey, hvalue, () => {
                client.publish("chat", hkey);//client将hkey发布到chat这个频道
                //然后订阅这个频道的订阅者就会收到消息
           });
        })(hkey, hvalue);
    }
}

// 模拟定时发布
// for(var i = 0; i < 20; i++) {  
//     (function(i) {  
//         setTimeout(() => {  
//             hset("hash-key", "index " + i, "success log " + i*2 );//发布
//             console.log("第" + i + "次发布信息");    
//         }, 1000*i);  
//     })(i);  
// } 



