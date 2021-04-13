---
title: 图
date: '2021-04-12'
sidebar: 'auto'
categories:
 - 数据结构
tags:
 - 算法
 - 数据结构
 - 图
---

### 1. 基本概念

- 图由顶点`vertex`和边`edge`，通常表示为`G=(V,E)`
- `G`表示一个图，`V`是顶点集，`E`是边集
- 顶点集`V`有穷且非空
- 任意两个顶点之间都可以用边来表示它们之间的关系，边集`E`可以是空的

> **无向图**

<img src="https://gitee.com/dingwanli/picture/raw/master/20210413204654.png" alt="image-20210413204647271" style="zoom:70%;" />

> **有向图**

<img src="https://gitee.com/dingwanli/picture/raw/master/20210413204934.png" alt="image-20210413204934952" style="zoom:70%;" />

- 如果无向图之间任意2个顶点之间都是连通的，则称这个图为连通图
- 如果有向图G中任意2个顶点都是连通的，则称G为强连通图

### 2. 实现方案

#### 2.1 邻接矩阵

- 一维数组存放顶点信息
- 二维数组存放边信息

<img src="https://gitee.com/dingwanli/picture/raw/master/20210413215853.png" alt="image-20210413215853535" style="zoom:50%;" />

0代表没有边，1代表有边

#### 2.2 邻接表

只需要一个数组即可，数组中存储各节点的信息

<img src="https://gitee.com/dingwanli/picture/raw/master/20210413220023.png" alt="image-20210413220023638" style="zoom:50%;" />