### 步骤
- 1、先打开mysql-5.7.16-winx64目录，启动bin目录下的mysqld.exe，然后到Navicat for Mysql文件夹下
启动navicat.exe，这样就可以打开一个数据库的可视化界面,然后进行数据库的连接即可
- 2、解压到后运行"64bit"文件夹下的redis-server.exe，启动redis服务器
- 3、然后分别启动Node命令，先启动多个node nodeMQ_consumer.js，构建多个消费者,
再启动node nodeMQ_producer.js，创建生产者，这样生产者生产的数据就可以被消费者消费，
先存入redis中的list列表，然后再把list列表中的数据存入到mysql中



### 参考文章
- https://www.cnblogs.com/softidea/p/5587126.html
- https://www.cnblogs.com/zhongweiv/p/node_redis.html
- https://www.tuicool.com/articles/7biABn
- http://redisdoc.com/list/rpoplpush.html
- http://redisdoc.com/list/lrem.html#lrem
- http://www.redis.cn/
- http://www.runoob.com/nodejs/nodejs-mysql.html
