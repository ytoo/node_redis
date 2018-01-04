var mysql  = require('mysql');  //调用MySQL模块

module.exports.insert = function (sqlKey,sqlValue){
    //创建一个connection
    var connection = mysql.createConnection({     
    host     : 'localhost',       //主机
    user     : 'root',               //MySQL认证用户名
    // password : '123456',        //MySQL认证用户密码
    port: '3306',                   //端口号
    database:"nodesample"
    }); 
    // //创建一个connection
    connection.connect(function(err){
        if(err){        
                console.log('[query] - :'+err);
            return;
        }
        console.log('[connection connect]  succeed!');
    });  
    
    //执行SQL语句，插入数据
    var  addSql = 'INSERT INTO nodesample('+sqlKey.join(",")+') VALUES(?,?)';
    var  addSqlParams = sqlValue;
    // //增加数据
    connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
        console.log('[INSERT ERROR] - ',err.message);
        return;
        }        
    });  
    // //关闭connection
    connection.end(function(err){
        if(err){        
            return;
        }
        // console.log('[connection end] succeed!');
    });
}