---
title: 策略
date: '2021-04-23'
sidebar: 'auto'
categories:
 - 算法
tags:
 - 算法
---

### 1. 回溯

回溯`Back Tracking`：通过选择不同的路径去往目的地

- 每一步都选择一条路出发，能进则进，不能进则退回上一步(回溯)

树的前序遍历、图的深度优先搜索典型的回溯应用

#### 1.1 八皇后问题

<img src="https://gitee.com/dingwanli/picture/raw/master/20210423122416.png" alt="image-20210423122416940" style="zoom:50%;" />

> **问题描述**

在8*8的国际象棋上摆放八个皇后，使其不能相互攻击：任意两个皇后都不能处于同一行、同一列、同一斜线上，问有多少种摆法？

1. 初始化

   ```java
   private static int ways; //总共的摆法
   public static void placeQueens(int n) {
       if (n < 1) return;
       int[] cols = new int[n];
       ways = 0;
       place(0, cols);
       System.out.println("一共有: " + ways);
   }
   ```

2. 回溯与剪枝

   ```java
   // 从第row行开始摆放皇后
   // cols索引是行号(从0开始)，数组元素是列号
   private static void place(int row, int[] cols) {
       if (row == cols.length) {// 第8行说明已经找到一种摆法
           ways++;
           return;
       }
   
       for(int col = 0; col < cols.length; col++) {
           if (isValid(row, col, cols)) {
               // 第row行第col列摆放皇后
               cols[row] = col;
               place(row + 1, cols);
               // 回溯
           }
       }
   }
   ```

3. 冲突处理

   ```java
   // 判断第row行，第col列是否可以摆放皇后
   private static boolean isValid(int row, int col, int[] cols) {
       for(int i = 0; i < row; i++) {
           if (cols[i] == col) return false; // 列冲突
           if (row - i == Math.abs(col - cols[i])) return false; // 对角线冲突
       }
       return true;
   }
   ```

#### 1.2 优化

1. 类定义

   ```java
   public class PlaceQueens {
       private int ways; //总共的摆法
       private boolean[] cols; // 标记着某一列是否有皇后
       private boolean[] leftTop; // 左上角到右下角是否有皇后
       private boolean[] rightTop; // 右上角到左下角是否有皇后
   }    
   ```

2. 初始化

   ```java
   // 初始化
   public void placeQueens(int n) {
       if (n < 1) return;
       cols = new boolean[n];
       leftTop = new boolean[(n << 1) - 1];
       rightTop = new boolean[leftTop.length];
       place(0);
       System.out.println("一共有: " + ways);
   }
   ```

3. 摆放皇后

   ```java
   // 从第row行开始摆放皇后
   // cols索引是行号(从0开始)，数组元素是列号
   private void place(int row) {
       if (row == cols.length) {// 第8行说明已经找到一种摆法
           ways++;
           return;
       }
   
       for(int col = 0; col < cols.length; col++) {
           if (cols[col]) continue; // 行冲突
           int ltIndex = row - col + cols.length - 1;
           if (leftTop[ltIndex]) continue; // 左斜线冲突
           int rtIndex = row + col;
           if (rightTop[rtIndex]) continue; // 友斜线冲突
           // 第row行第col列摆放皇后
   
           cols[col] = true;
           leftTop[ltIndex] = true;
           rightTop[rtIndex] = true;
           place(row + 1);
   
           // 回溯
           cols[col] = false;
           leftTop[ltIndex] = false;
           rightTop[rtIndex] = false;
       }
   }
   ```

### 2. 贪心

贪心策略，也称贪婪策略。每一步都采取当前状态下最优的选择(局部最优解)，从而希望推导出全局最优解

#### 2.1 最优装载问题

总容量为`W`，每件物品的重量为`wi`，如何装数量最多

每次都选择最轻的物品，直至容量达到最大

```java
public int maxNum(int capacity,  int[] treasure) {
    if (treasure == null) return 0;
    Arrays.sort(treasure);
    int weight = 0;
    for (int i = 0; weight < capacity && i < treasure.length; i++) {
        if (weight + treasure[i] < capacity) {
            weight += treasure[i];
        } else {
            return i;
        }
    }
    return treasure.length;
}
```

#### 2.2 0-1背包

有n件物品和一个最大承重为W的背包，每件物品的重量`wi`·，价值是`vi`，在保证总重量不超过W的前提下，将哪几件物品装入背包，可以使背包的价值最大？(每个物品只能选或不选，不能多选)