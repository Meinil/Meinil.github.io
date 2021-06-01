---
title: Git
date: '2021-06-01'
sidebar: 'auto'
categories:
 - Linux
tags:
 - Git
---

## 1. 概述

`Git`是一个分布式版本控制工具，[下载地址](https://git-scm.com/download)

<img src="https://gitee.com/dingwanli/picture/raw/master/20210601162032.png" style="zoom:90%;" />

## 2. git常用命令

### 2.1 设置用户签名

设置用户名

```shell
git config --global user.name "用户名"
```

设置邮箱

```shell
git config --global user.email "邮箱"
```

### 2.1 简单命令

初始化仓库

```shell
git init
```

查看仓库状态

```shell
git status
```

添加文件至暂存区

```shell
git add <文件名>
```

添加所有文件至暂存区

```shell
git add .
```

将文件从暂存区中移除

```shell
git rm --cached <文件名>
```

提交本地库

```shell
git commit -m <日志信息>
```

查看简单日志信息

```shell
git reflog
```

查看详细日志信息

```shell
git log
```

版本穿梭

```shell
git reset --hard <版本号>
```

## 3. 分支操作

在版本控制过程中，同时推进多个任务，每一个任务我们都可以创建单独的分支。使用分支意味着程序员可以把自己的工作从开发主线上分离开来，开发自己分支的时候，不会影响主线的运行。使用分支可以并行推进多个功能开发，提高开发效率。各个分支在开发过程中 ，如果某一个分支开发失败，不会对其他分支有任何影响

### 3.1 常用操作

创建分支

```shell
git branch <分支名>
```

查看分支

```shell
git branch -v
```

切换分支

```shell
git checkout <分支名>
```

把指定的分支合并到当前分支上

```shell
git merge <分支名>
```

删除分支

```shell
git branch -d <分支名>
```

### 3.2 冲突合并

冲突产生的原因，合并分支时，两个分支在同一个文件的同一个位置有两套完全不同的修改。`Git`无法替我们决定使用哪一个。必须人为的决定新代码的内容

## 4. Github

[地址](https://github.com/)

### 4.1 git常用远程命令

查看远程仓库

```shell
git remote -v
```

添加一个远程仓库

```shell
git remote add <别名> <仓库地址>
```

删除一个远程仓库

```shell
git remote rm <别名>
```

推送远程库

```shell
git push <别名> <分支>
```

拉取远程仓库

```shell
git pull <别名> <分支>
```

克隆仓库

```shell
git clone <仓库地址>
```

### 4.1 团队协作

1. 邀请成员加入

<img src="https://gitee.com/dingwanli/picture/raw/master/20210601184736.png" style="zoom:50%;" />

2. 复制邀请函

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210601184925.png" style="zoom:50%;" />

3. 邀请函发给对方，对方同意即可

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210601185121.png" style="zoom:50%;" />

4. 对方同意后，自己的仓库就会出现在对方的仓库列表中

### 4.2 跨团队协作

1. 首先将对方的仓库`fork`到自己的账号下

2. 修改代码

3. 创建`Pull requests`

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210601190612.png" style="zoom:50%;" />

4. 创建好后发给对方，等待对方审核即可

## 5. SSH登陆

1. 生成密钥

   ```shell
   ssh-keygen.exe -t rsa
   ```

2. 将`C:\Users\<windows用户名>\.ssh\id_rsa.pub`的内容复制到`github`即可

## 6. 忽略文件

一些与项目的实际功能无关，不需要提交至远程仓库。此时就需要一个忽略文件

1. 创建一个`xxx.gitignore`文件(前缀名是什么无所谓)
2. 原则上忽略文件放在哪里都行，建议放在根目录
3. 模板，[开源模板地址](https://github.com/github/gitignore)

