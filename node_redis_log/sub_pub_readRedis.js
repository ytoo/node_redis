// 连接远程redis服务器
var redis = require("redis"), 
    RDS_PORT = 6379,  // 端口号
    RDS_HOST = "127.0.1.1",  // 服务器IP
    RDS_OPTS = {};    // 设置项
var client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS); 
var client0 = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS); 
var client1 = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS); 
var mysql  = require('./test_mysql');  //调用MySQL模块

// 订阅及发布，都是需要单独的client的，一个client同时只能做一个事情，这也就是上面初始化了那么多client的原因。

function getRedisData(listkey) {  
    //客户端连接redis成功后执行回调
    client.on("ready", () => {
        dealWithMsg(listkey);
        console.log("订阅成功。。。");
        // 判断此时redis的list内是否有数据，如果它的长度不等于0，则说明之前的数据由于消费端中断未处理完毕，需要再次处理
        client.lrange(listkey, 0, -1, (err, res) => {
            if (err) {
                console.log('-----初始化消息队列失败' + err)
            } else {
                if (res.length > 0) {
                    console.log('开始消费已有队列');
                     dealWithMsg(listkey);
                } else {
                    console.log('无初始队列');
                }
            }
        });
        // 判断备份数据backupsData中是否有未写入mysql的数据
        client.lrange("backupsData", 0, -1, (err, res) => {
            if (err) {
                console.log('-----读取备份消息队列失败' + err)
            } else {
                if (res.length > 0) {
                    console.log('开始消费backupsData备份队列');
                    res.forEach((i,v)=>{
                        client0.brpoplpush("backupsData","backupsData",1000,function(err,res){
                            console.log("backupsData")
                            console.log(res);
                            mysql.insert(res,client0);
                        })
                    })
                   
                } else {
                    console.log('无备份消息队列');
                }
            }
        });
        
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
        // console.log(channel + "频道接收到信息了：" + msg);
        //    dealWithMsg(listkey);
        
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

function dealWithMsg(listkey) {   
    // 必须使用和client不一样的客户端获取数据，否则使用client获取不到数据
    // 开启三个不同的客户端client，用来消费掉订阅过来的大量数据
    // 阻塞listkey这个队列1000秒钟,如果有数据,立刻从右侧（尾部）弹出,并将弹出的数据存入新的备份队列,如果没有,持续阻塞,直到1000秒(0代表没有数据时无限期阻塞)
    client1.brpoplpush(listkey,"backupsData",1000, (err, res) =>  {
        // 解析res数据,res的结果是一个对象转换后的字符串
        console.log("执行brpoplpush操作")
        console.log(res);
        if(res) {
             // 将获取到的数据连接到mysql数据库,并插入数据
            mysql.insert(res,client0);
        } 
        dealWithMsg(listkey)  
    })
}

module.exports =  getRedisData