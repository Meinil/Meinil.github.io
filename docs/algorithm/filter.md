---
title: 布隆过滤器
date: '2021-04-30'
sidebar: 'auto'
categories:
 - 数据结构
tags:
 - 算法
 - 数据结构
---

### 1. 简介

布隆过滤器`Bloom Filter`：是一个空间效率高的概率型数据结构，可以确保一个元素**一定不存在**或者**可能存在**

> **优缺点**

- 优点：空间效率和查询时间都远远超过一般的算法
- 缺点：有一定的误判率、删除困难

> **原理**

本质上是一个很长的二进制向量和一系列随机映射函数`Hash`函数

假设布隆过滤器由20位二进制，3个哈希函数组成，每个元素经过哈希函数处理都能生成一个索引位置


| 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   | 11   | 12   | 13   | 14   | 15   | 16   | 17   | 18   | 19   |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    |

1. 添加元素：将每一个哈希函数计算出的索引位置都设置为1

   假设要插入`A`，经`hash1`计算的出索引为`2`，经`hash2`计算的出索引为`7`，经`hash3`计算的出索引为`18`则有
   
   
   | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   | 11   | 12   | 13   | 14   | 15   | 16   | 17   | 18   | 19   |
   | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
   | 0    | 0    | 1    | 0    | 0    | 0    | 0    | 1    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 0    | 1    | 0    |
   
   再插入一个`B`，经`hash1`计算的出索引为`2`，经`hash2`计算的出索引为`7`，经`hash3`计算的出索引为`15`则有
   
   
   | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    | 10   | 11   | 12   | 13   | 14   | 15   | 16   | 17   | 18   | 19   |
   | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
   | 0    | 0    | 1    | 0    | 0    | 0    | 0    | 1    | 0    | 0    | 0    | 0    | 0    | 0    | 01   |      | 0    | 0    | 1    | 0    |

2. 查询利用哈希函数生成索引，如果所有的索引都为1，则返回`true`，否则返回`false`
3. 添加、查询的时间复杂度都是`O(K)`，`K`是哈希函数的个数

### 2.误判率

- 影响误判率的三个因素影响：二进制位的个数`m`、哈希函数的个数`k`、数据规模`n`
  $$
  P=(1-e^{-\frac{k(n+0.5)}{m-1}})^k
  $$
  可以简写为
  $$
  P=(1-e^{-\frac{kn}{m}})^k
  $$

- 已知误判率`p`,数据规模`n`,求二进制的个数`m`、哈希函数的个数`k`
  $$
  m=-\frac{nlnp}{(ln2)^2},k=\frac{m}{n}ln2,k=-\frac{lnp}{ln2}=-log_2p
  $$

### 3. 具体实现

#### 3.1 类的结构

```java
public class BloomFilter<T> {
    private int bitSize; // 二进制向量的长度
    // 二进制向量
    private long[] bits;
    private int hashSize; // 哈希函数的个数
    // n数据规模
    // 误判率
    public BloomFilter(int n, double p) {
    }

    // 添加元素
    public boolean put(T value) {
        return false;
    }

    // 判断一个元素是否存在
    public boolean contains(T value) {
        return true;
    }

    // 设置index位置的二进制位为1
    private void set(int index) {
    }

    // 获取index位置的二进制位是否为0
    private boolean get(int index) {
    }

    private void nullCheck(T value) {
    }
}
```

#### 3.2 方法实现

1. 构造函数

   ```java
   public BloomFilter(int n, double p) {
       if (n <= 0 || p <= 0 || p>= 1) {
           throw new IllegalArgumentException("参数错误");
       }
   
       double ln2 = Math.log(2);
       bitSize = (int)(-(n * Math.log(p)) / (ln2 * ln2));      // 求解二进制向量的长度
       hashSize = (int) (bitSize * ln2 / n);                   // 哈希函数的个数
       bits = new long[(bitSize + Long.SIZE - 1) / Long.SIZE]; // 计算bits数组的长度
       System.out.println(bitSize + " " + hashSize);
   }
   ```

2. 添加元素

   ```java
   public boolean put(T value) {
       nullCheck(value);
   
       // 利用value生成两个整数
       int hash1 = value.hashCode(); // 获取value的hashcode
       int hash2 = hash1 >>> 16; // 获取value的hashcode
       for (int i = 0; i < hashSize; i++) {
           int combinedHash = hash1 + (i * hash2);
           if (combinedHash < 0) {
               combinedHash = ~combinedHash;
           }
           int index = combinedHash % bitSize; // 求取索引
           // 设置index位置为1
           set(index);
       }
   
       return false;
   }
   ```

3. 判断一个元素是否存在

   ```java
   // 判断一个元素是否存在
   public boolean contains(T value) {
       nullCheck(value);
   
       // 利用value生成两个整数
       int hash1 = value.hashCode(); // 获取value的hashcode
       int hash2 = hash1 >>> 16; // 获取value的hashcode
       for (int i = 0; i < hashSize; i++) {
           int combinedHash = hash1 + (i * hash2);
           if (combinedHash < 0) {
               combinedHash = ~combinedHash;
           }
           int index = combinedHash % bitSize; // 求取索引
           // 查看index位置的二进制位是否为0
           if (get(index)) return false;
       }
   
       return true;
   }
   ```

4. 设置`index`位置的二进制位为1

   ```java
   private void set(int index) {
       bits[index / Long.SIZE] = bits[index / Long.SIZE] | (1 << (index % Long.SIZE));
   }
   ```

5. 检查`index`位置的二进制位是否为0

   ```java
   // true代表1，false代表0
   private boolean get(int index) {
       return (bits[index / Long.SIZE] & (1 << (index % Long.SIZE))) != 0;
   }
   ```

6. 空值检测

   ```java
   private void nullCheck(T value) {
       if (value == null) {
           throw new IllegalArgumentException("元素不能为空");
       }
   }
   ```

   