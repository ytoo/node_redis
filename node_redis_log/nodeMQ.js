var redis = require("redis");
var mysql = require("mysql");
var nodeMQConfig = require("./nodeMQConfig")
var URL = require("url");
var url = URL.parse("http://localhost:3000/management/html/news/dirlist?id=1&page=1#index")
var redisConfig = nodeMQConfig.redis[0];
var mysqlConfig = nodeMQConfig.mysql[0];
// 订阅及发布，都是需要单独的client的，一个client同时只能做一个事情，这也就是上面初始化了那么多client的原因。
var client2 = redis.createClient(redisConfig.RDS_PORT,redisConfig.RDS_HOST,redisConfig.RDS_OPTS);
var client3 = redis.createClient(redisConfig.RDS_PORT,redisConfig.RDS_HOST,redisConfig.RDS_OPTS);
// mysql是有连接池的 并发大的情况下 如果你之前的连接不关闭 连接池满了 请求无法处理 程序就会阻塞 因此用完是需要释放的
var pool = mysql.createPool({  
            host : mysqlConfig.host,       //主机
            user : mysqlConfig.user,               //MySQL认证用户名
            // password : mysqlConfig.password,    //MySQL认证用户密码
            port: mysqlConfig.port,                //端口号
            database:mysqlConfig.database          // 数据库名 
    }); 

var nodeMQ = {
        producer(listKey,hkey,hvalue) {  
            var client = redis.createClient(redisConfig.RDS_PORT,redisConfig.RDS_HOST,redisConfig.RDS_OPTS);
            var hoptions = {};
            hoptions[hkey] = hvalue;
            hoptions.host = url.host;

            //redis存数据到list列表中
            client.lpush(listKey, JSON.stringify(hoptions), (err, replay) => {
                if (err) {
                    throw err;
                }
                client.quit();
            });
        },
        consumer(listkey,redisServerConfigOption) { 
            // var redisConfig = redisServerConfigOption || redisConfig;
            var client1 = redis.createClient(redisConfig.RDS_PORT,redisConfig.RDS_HOST,redisConfig.RDS_OPTS);
            //客户端连接redis成功后执行回调
            client1.on("ready", () => {
                // 开始处理消费数据
                this.dealWithMsg(listkey);
                console.log("开始监听消费。。。");
                // 判断此时redis的list内是否有数据，如果它的长度不等于0，则说明之前的数据由于消费端中断未处理完毕，需要再次处理
                client1.lrange(listkey, 0, -1, (err, res) => {
                    if (err) {
                        throw ('-----初始化消息队列失败' + err)
                    } 
                    if (res.length > 0) {
                        console.log('开始消费已有队列');
                        this.dealWithMsg(listkey);
                    } else {
                        console.log('无初始队列');
                    }
                   
                });
                // 判断备份数据backupsData中是否有未写入mysql的数据
                client1.lrange("backupsData", 0, -1, (err, res) => {
                    if (err) {
                        throw ('-----读取备份消息队列失败' + err)
                    } 
                    if (res.length > 0) {
                        console.log('开始消费backupsData备份队列');
                        res.forEach((i,v)=>{
                            client3.brpoplpush("backupsData","backupsData",1000,(err,res)=>{
                                console.log("backupsData")
                                console.log(res);
                                this.mysqlInsert(res);
                            })
                        })                   
                    } else {
                        console.log('无备份消息队列');
                    }                 
                });                
            });
            client1.on("error", (error) => {
                console.log("Redis Error " + error);
            });
            // 关闭与redis服务器的连接
            client1.on("end",err => {
                console.log("与redis服务器的连接已关闭");
            })
        },
        dealWithMsg(listkey) {   
            // 必须使用和client不一样的客户端获取数据，否则使用client获取不到数据
            // brpoplpush不仅返回一个消息，同时还将这个消息添加到另一个备份列表backupsData当中，这个操作室原子性的，要么成功（返回数据并存入备份），要么失败（未返回数据且未备份）
            // 如果一切正常的话，当一个客户端完成某个消息的处理之后，可以用 LREM 命令将这个消息从备份表删除（比如成功写入数据库后删除备份的数据）
            // 阻塞listkey这个队列1000秒钟,如果有数据,立刻从右侧（尾部）弹出,并将弹出的数据存入新的备份队列,如果没有,持续阻塞,直到1000秒(0代表没有数据时无限期阻塞)
            client2.brpoplpush(listkey,"backupsData",1000, (err, res) =>  {
                // 解析res数据,res的结果是一个对象转换后的字符串
                console.log("执行brpoplpush操作")
                console.log(res);
                if(res) {
                    // 将获取到的数据连接到mysql数据库,并插入数据
                    this.mysqlInsert(res);
                } 
                // 重复调用此处理方法，消费数据
                this.dealWithMsg(listkey)  
            })
        },
        mysqlInsert(res){
            pool.getConnection((err,conn)=>{  
                if(err){  
                    throw err;
                } 
                var sqlKey = [];
                var sqlValue = [];
                var result = JSON.parse(res)
                for (var key in result) {
                    sqlKey.push(key);
                    sqlValue.push(result[key])
                }
                //执行SQL语句，将数据插入数据库的表中
                var  addSql = 'INSERT INTO nodesample('+sqlKey.join(",")+') VALUES(?,?)';
                var  addSqlParams = sqlValue;
                conn.query(addSql,addSqlParams,(err,results,fields)=>{  
                    if(err){
                        throw err;
                    }
                    // 数据写入mysql后，删除备份数据中的对应数据
                    client3.lrem("backupsData",1,res,()=>{
                        console.log("backupsData已删除数据:" + res);
                    })
                    //释放连接  
                    conn.release();  
                });             
            }); 
        }
    }

    
    module.exports = nodeMQ;
