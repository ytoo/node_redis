
// 连接远程的redis服务器
var redis = require("redis"), 
    RDS_PORT = 6379,  // 端口号
    RDS_HOST = "127.0.1.1",  // 服务器IP
    RDS_OPTS = {},    // 设置项
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
var URL = require("url");
var url = URL.parse("http://localhost:3000/management/html/news/dirlist?id=1&page=1#index")
var path = require("path");



// 向redis的hash散列中添加数据
/**
 * 
 * @param {*} hashKeys  键名 --->需要记录日志信息的文件名标识
 * @param {*} hoptions  需要记录的信息对象
 * @param {*} hkey 各不相同的键，无序排列 ---> 需要记录的具体信息名标识(或订阅需要发布的信息)
 * @param {*} hvalue 与键关联的值 ---> 需要记录的信息的具体内容
 */
module.exports = function hmset(chanl,hkey,hvalue) {  
    // for (var hkey in hoptions) {
    //     var hvalue = hoptions[hkey];
    //     (function(hkey, hvalue){
    //         // redis缓存数据
    //         client.hset(hashKeys, hkey, hvalue, () => {
    //             client.publish("chat", hkey);//client将hkey发布到chat这个频道
    //             //然后订阅这个频道的订阅者就会收到消息
    //        });
    //     })(hkey, hvalue);
    // }

    // var hashKeys = path.basename(path.join(__filename),".js");
    // hoptions.hashKeys = hashKeys;
    console.log(hkey,hvalue);

    var hoptions = {};
    hoptions[hkey] = hvalue;
    hoptions.host = url.host;
    hoptions.pathname = url.pathname;
    hoptions.query = url.query;
    hoptions.path = path.join(__filename);
    hoptions.hash = url.hash;
    console.dir(hoptions);

    //  redis缓存数据
    client.hmset("hashK", hoptions, () => {
            client.publish(chanl, hkey);//client将指定的hkey发布到chat这个频道
            //然后订阅这个频道的订阅者就会收到消息 
    });
}



