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

module.exports.insert = function (sqlKey,sqlValue){

    pool.getConnection(function(err,conn){  
        if(err){  
            throw err;
        } 
        //执行SQL语句，插入数据
        var  addSql = 'INSERT INTO nodesample('+sqlKey.join(",")+') VALUES(?,?)';
        var  addSqlParams = sqlValue;
        conn.query(addSql,addSqlParams,function(err,results,fields){  
            //释放连接  
            conn.release();  
        });  
         
    }); 
}


// https://www.cnblogs.com/jkll/p/4550100.html
// https://www.cnblogs.com/yansj1997/p/6550201.html
// http://blog.csdn.net/zhuming3834/article/details/77184193
// http://redisdoc.com/list/rpoplpush.html
// http://redisdoc.com/list/lrem.html#lrem
// https://www.zhihu.com/question/43688764?sort=created