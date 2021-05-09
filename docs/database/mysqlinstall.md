---
title: MySQL安装
date: '2021-05-09'
sidebar: 'auto'
categories:
 - 数据库
tags:
 - 数据库
 - MySQL
---

### 1. 下载

[下载连接]([MySQL :: Download MySQL Community Server](https://dev.mysql.com/downloads/mysql/))

<img src="https://gitee.com/dingwanli/picture/raw/master/20210509192724.png" style="zoom:50%;" />

### 2. 解压缩

将下载好的压缩包，解压至一个合适的位置，并以管理员的方式打开命令行工具在其`bin`目录下

1. 运行命令

   ```shell
   mysqld --install
   ```

2. 初始化`mysql`，并记录下产生的临时密码

   ```shell
   mysqld --initialize --console
   ```

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210509200234.png" alt="image-20210509193436159" style="zoom:50%;" />

3. 开启服务

   ```shell
   net start mysql
   ```

4. 使用刚刚产生的密码登陆

   ```shell
   mysql -uroot -prjHkb-ypG1Ch
   ```

5. 修改密码

   ```sql
   alter user 'root'@'localhost' identified by '123456';
   ```

6. 设置系统变量

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210509194258.png" style="zoom:70%;" />

7. 配置文件，`mysql`根目录下新建`my.ini`

   ```ini
   [mysqld]
   # 设置3306端口
   port=3306
   # 设置mysql的安装目录,根据需要修改
   basedir=D:\env\mysql
   # 设置mysql数据库的数据的存放目录，根据需要修改
   datadir=D:\env\mysql\data
   # 允许最大连接数
   max_connections=200
   # 允许连接失败的次数。这是为了防止有人从该主机试图攻击数据库系统
   max_connect_errors=10
   # 服务端使用的字符集默认为UTF8MB4
   character-set-server=utf8mb4
   # 创建新表时将使用的默认存储引擎
   default-storage-engine=INNODB
   # 默认使用“mysql_native_password”插件认证
   default_authentication_plugin=mysql_native_password
   
   [mysql]
   # 设置mysql客户端默认字符集
   default-character-set=utf8mb4
   [client]
   # 设置mysql客户端连接服务端时默认使用的端口
   port=3306
   default-character-set=utf8mb4
   ```

   

