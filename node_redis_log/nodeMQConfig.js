"use strict";

module.exports = {
    redis:[{
        RDS_PORT : 6379,  // 端口号
        RDS_HOST : "127.0.1.1",  // 远程服务器IP
        RDS_OPTS : {}    // 设置项
    }],
    mysql:[{
        host : 'localhost',       //主机
        user : 'root',               //MySQL认证用户名
        // password : '123456',        //MySQL认证用户密码
        port: '3306',                   //端口号
        database:"nodesample"
    }]
}