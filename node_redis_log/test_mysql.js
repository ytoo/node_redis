var mysql  = require('mysql');  //调用MySQL模块
// mysql连接池 
// mysql是有连接池的 并发大的情况下 如果你之前的连接不关闭 连接池满了 请求无法处理 程序就会阻塞 因此是用完是需要释放的
var pool = mysql.createPool({  
            host : 'localhost',       //主机
            user : 'root',               //MySQL认证用户名
            // password : '123456',        //MySQL认证用户密码
            port: '3306',                   //端口号
            database:"nodesample"
    }); 

module.exports.insert = function (res,Client){

    pool.getConnection(function(err,conn){  
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
        //执行SQL语句，插入数据
        var  addSql = 'INSERT INTO nodesample('+sqlKey.join(",")+') VALUES(?,?)';
        var  addSqlParams = sqlValue;
        conn.query(addSql,addSqlParams,function(err,results,fields){  
            // 数据写入mysql后，删除备份数据中的对应数据
            Client.lrem("backupsData",0,res,function(){
                console.log("backupsData已删除数据:" + res);
            })
            //释放连接  
            conn.release();  
        });  
         
    }); 
}