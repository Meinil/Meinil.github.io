---
title: 递归
date: '2021-04-22'
sidebar: 'auto'
categories:
 - 算法
tags:
 - 算法
---

### 1. 简介

递归：函数直接或直接调用自身，是一种编程技巧

- 递归调用如果没有终止条件，将会一直消耗栈空间，最终导致内存栈溢出
- 递归调用必须含有递归结束条件(也称边界条件，递归基)

#### 1.1 基本思想

> **拆解问题**

- 把规模大的问题变成规模较小的同类型问题
- 规模较小的问题又不断变为规模更小的问题
- 规模小到一定程度可以直接得出它的解

> **求解**

- 由最小规模问题的解得出较大规模问题的解
- 由较大规模问题的解不断得出规模更大问题的解
- 最后得出原来问题的解

> **使用场景**

- 链表、二叉树相关的问题

#### 1.2 使用步骤

1. 明确函数的功能

2. 明确原问题与子问题的关系

3. 明确递归基

   递归的过程中，子问题的规模不断减小，当小到一定程度时可以直接得出它的解
   

递归的时间复杂度一般是一个递推式，而空间复杂度一般是
$$
递归深度*每次调用所需的辅助空间
$$

### 2. 斐波那契

斐波那契数列
$$
1, 1, 2, 3, 5, 8....
$$

#### 2.1 简单写法

```java
public static int fib(int n) {
    if (n <= 2) return 1;
    return fib(n - 1) + fib(n - 2);
}
```

假设n为6的调用过程

<img src="https://gitee.com/dingwanli/picture/raw/master/20210422124849.png" alt="image-20210422124842543" style="zoom:70%;" />

#### 2.2 优化一

上述的方法中，一个结果会重复调用函数，效率较低，可以采用数组将已经计算出的结果存储起来，供后面的计算使用

```java
public static int fib(int n) {
    if (n <= 2) return 1;
    int[] array = new int[n + 1];
    array[1] = array[2] = 1;
    return fib(n, array);
}

private static int fib(int n, int[] array) {
    if (array[n] == 0) {
        array[n] = fib(n - 1, array) + fib(n - 2, array);
    }
    return array[n];
}
```

时间复杂度：`O(n)`，空间复杂度：`O(n)`

#### 2.3 优化二

去除递归

```java
public static int fib2(int n) {
    if (n <= 2) return 1;
    int[] array = new int[n + 1];
    array[1] = array[2] = 1;
    for (int i = 3; i <= n; i++) {
        array[i] = array[i - 1] + array[i - 2];
    }
    return array[n];
}
```

时间复杂度：`O(n)`，空间复杂度：`O(n)`

#### 2.4 优化三

空间复杂度优化，滚动数组存储元素，后面的结果覆盖前面的结果

```java
public static int fib3(int n) {
    if (n <= 2) return 1;
    int[] array = new int[2];
    array[0] = array[1] = 1;
    for (int i = 3; i <= n; i++) {
        array[i & 1] = array[0] + array[1];
    }
    return array[n & 1];
}
```

时间复杂度：`O(n)`，空间复杂度：`O(1)`

### 3. 汉诺塔

```java
// 将n个碟子从p1挪动到p3
public static void hanoi(int n, String p1, String p2, String p3) {
    if (n <= 1) {
        move(n, p1, p3);
    } else {
        hanoi(n - 1, p1, p3, p2); // 将n-1个盘子从p1挪动到p2
        move(n, p1, p3);
        hanoi(n- 1, p2, p1, p3);
    }
}

private static void move(int num, String from, String to) {
    System.out.println(num + ": " + from + "->" + to);
}
```

时间复杂度：`O(2^n)`

### 4. 递归转非递归

递归调用的过程中，会将每一次调用的参数、局部变量都保存在了对应的栈帧`Stack Frame`中