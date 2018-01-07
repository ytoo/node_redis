
// 连接远程的redis服务器
var redis = require("redis"), 
    RDS_PORT = 6379,  // 端口号
    RDS_HOST = "127.0.1.1",  // 服务器IP
    RDS_OPTS = {};    // 设置项
    
var URL = require("url");
var url = URL.parse("http://localhost:3000/management/html/news/dirlist?id=1&page=1#index")
// 向redis的list中添加数据
/**
 * 
 * @param {*} hashKeys  键名 --->需要记录日志信息的文件名标识
 * @param {*} hoptions  需要记录的信息对象
 * @param {*} hkey 各不相同的键，无序排列 ---> 需要记录的具体信息名标识(或订阅需要发布的信息)
 * @param {*} hvalue 与键关联的值 ---> 需要记录的信息的具体内容
 */
module.exports = function MessageQueue(listKey,hkey,hvalue) {  

    var client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
    var hoptions = {};
    hoptions[hkey] = hvalue;
    hoptions.host = url.host;
    // hoptions.pathname = url.pathname;
    // hoptions.query = url.query;
    // hoptions.hash = url.hash;

    //redis存数据
    client.lpush(listKey, JSON.stringify(hoptions), (err, replay) => {
        
        if (err) {
            throw err;
        }
       //client将指定的hkey发布到chat这个频道
       //然后订阅这个频道的订阅者就会收到消息
    //    client.publish("chat",JSON.stringify(hoptions) );

     client.quit();

    });
   


}



