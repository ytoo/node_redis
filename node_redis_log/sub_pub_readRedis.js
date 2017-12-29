// 连接远程redis服务器
var redis = require("redis"), 
    RDS_PORT = 6379,  // 端口号
    RDS_HOST = "127.0.1.1",  // 服务器IP
    RDS_OPTS = {};    // 设置项
var path = require("path");
var fs = require("fs");
var client1 = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);
var client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);  
var mysql  = require('mysql');  //调用MySQL模块

// 订阅及发布，都是需要单独的client的，一个client同时只能做一个事情，这也就是上面初始化了那么多client的原因。

// hashKeys需要记录日志信息的文件名标识
function getRedisData(chanl) {  
    //客户端连接redis成功后执行回调
    client.on("ready", () => {
        //订阅频道消息
        client.subscribe(chanl);
        // client.subscribe("chat1");
        console.log("订阅成功。。。");
    });

    client.on("error", (error) => {
        console.log("Redis Error " + error);
    });


    //监听订阅成功事件 订阅事件的会时候触发 subscribe ，回调包含两个参数，分别为订阅的频道和总订阅数量
    client.on("subscribe", (channel, count) => {
        console.log("client subscribed to " + channel + "," + count + " total subscriptions");
    });

    // 监听message事件，客户端将为与主动订阅匹配的每个接收到的消息发出消息。侦听器将通道名称作为通道传递，消息作为消息传递。
    //收到消息后执行回调，msg是redis发布的消息
    client.on("message", (channel, msg) => {
        // 可以根据msg的值，做不同的业务逻辑处理，这里的msg就是hash里面的hkey键
        // console.log(channel + "频道接收到信息了：" + msg);

           dealWithMsg();

    });

    //监听取消订阅事件
    client.on("unsubscribe", (channel, count) => {
        console.log("client unsubscribed from" + channel + ", " + count + " total subscriptions")
    });

    // 关闭与redis服务器的连接
    client.on("end",err => {
        console.log("与redis服务器的连接已关闭");
    })
}

function dealWithMsg() {   
   
    // 必须使用和client不一样的客户端获取数据，否则使用client.hget获取不到数据
    // 通过查询msg获取到某个键的值msg => reply
    client1.hgetall("hashK", (err, res) =>  {
        //  console.log("订阅的" + msg + "的内容是：" + res); 
         // 将获取到的数据连接到mysql数据库
        //创建一个connection
        var connection = mysql.createConnection({     
        host     : 'localhost',       //主机
        user     : 'root',               //MySQL认证用户名
        password : '123456',        //MySQL认证用户密码
        port: '3306',                   //端口号
        database:"nodesample"
        }); 
        //创建一个connection
        connection.connect(function(err){
            if(err){        
                    console.log('[query] - :'+err);
                return;
            }
            console.log('[connection connect]  succeed!');
        });  
        // 解析res数据对象
        var sqlKey = [];
        var sqlValue = [];
        for (var key in res) {
            sqlKey.push(key);
            sqlValue.push(res[key])
        }
        //执行SQL语句
        var  addSql = 'INSERT INTO nodesample(Id,'+sqlKey.join(",")+') VALUES(0,?,?,?,?)';
        var  addSqlParams = sqlValue;
        //增加数据
        connection.query(addSql,addSqlParams,function (err, result) {
                if(err){
                console.log('[INSERT ERROR] - ',err.message);
                return;
                }        
        
            console.log('--------------------------INSERT----------------------------');
            //console.log('INSERT ID:',result.insertId);        
            console.log('INSERT ID:',result);        
            console.log('-----------------------------------------------------------------\n\n');  
        });  
        //关闭connection
        connection.end(function(err){
            if(err){        
                return;
            }
                console.log('[connection end] succeed!');
            });
        });

    // 获取到hash里面所有键值对集合
        // client1.hgetall(hashKeys,(err,res) => {
        //     if(err){
        //         console.log("ERROR:" + err);
        //         return;
        //     } 
            // console.dir(res)

            // 所有的数据信息都存储在redisKeys里面
            // client1.hmset("redisKeys",hashKeys,JSON.stringify(res),redis.print)
            // client1.hgetall("redisKeys",(err,result) => {
            //     // console.dir(result);
            //     // console.log(JSON.stringify(result))
            //     // 把获取到的信息写入到本地文件进行存储
            //     fs.writeFile("./logger.txt",JSON.stringify(result),(err) => {
            //         if(err){
            //             throw err;
            //         }
            //         console.log("写入logger.txt文件成功")
            //     }) 
            // })
                
        // })
    

}
module.exports =  getRedisData