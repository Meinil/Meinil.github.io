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

> **贪心方法解决**

1. 价值贪心，优先把价值最高的物品放进背包
2. 重量贪心，优先把重量最轻的放进背包
3. 性价比贪心，优先把单位价值最高的物品放进背包

分析可知，性价比贪心正确

> **具体实现**

1. 定义一个内部类，

   ```java
   public class Knapsack {
       public static class Article {
           private int weight; // 重量
           private int value; // 价值
           private double valueDensity; // 性价比
   
           public Article(int weight, int value) {
               this.weight = weight;
               this.value = value;
               valueDensity = value * 1.0 / weight;
           }
   
           public double getValueDensity() {
               return valueDensity;
           }
       }
   }
   ```

2. 贪心实现

   ```java
   // articles要装的物品
   // capacity背包的容量
   public List<Article> knapsack(
       Article[] articles,
       int capacity,
       Comparator<Article> comparator) {
       Arrays.sort(articles, comparator); // 排序
       System.out.println(Arrays.toString(articles));
       List<Article> list = new LinkedList<>(); // 保存添加的物品的信息
   
       int weight = 0; // 已经装载的重量
       int value = 0; // 已经装载的物品的价值
       for (Article article : articles) {
           if ((article.weight + weight) > capacity) {
               continue;
           }
   
           weight += article.weight;
           value += article.value;
           list.add(article);
       }
       return list;
   }
   ```

### 3. 分治

分治`Divide And Conquer`，分而治之

1. 将原问题分解成若干个规模较小的子问题(子问题和原问题的结构一样，只是规模不一样)
2. 子问题又不断分解成规模更小的子问题，直至不能再分解(可以轻易计算出子问题的解)
3. 利用子问题的解推导出原问题的解

>  **主定理**

解决规模为n的问题，分解为a个规模为`n/b`的子问题，然后在`O(n^d)`时间内将子问题的解合并

算法运行时间
$$
T(n) = a\times T(\frac{n}{b})+O(n^d),a>0,b>0,d\geq0
$$
时间复杂度：
$$
d>log_ba,T(n)=O(n^d)
$$

$$
d=log_ba,T(n)=O(n^dlog_n)
$$

$$
d<log_ba,T(n)=O(n^{log_ba})
$$

#### 3.1 最大连续子序列和

[力扣题目](https://leetcode-cn.com/problems/maximum-subarray/)给定一个长度为`n`的整数序列，求它的最大连续子序列和

```
[-2, 1, -3, 4, -1, 2, 1, -5, 4]
4+(-1)+2+1=6
```

> **暴力解法**

```java
public int maxSubArray(int[] nums) {
    if (nums == null || nums.length == 0) return 0;

    int max = Integer.MIN_VALUE;
    for (int begin = 0; begin < nums.length; begin++) {
        int sum = 0;
        for (int end = begin; end < nums.length; end++) {
            sum += nums[end];
            max = Math.max(max, sum);
        }
    }
    return max;
}
```

时间复杂度：`O(n^2)`

> **分治**

1. 将序列均匀地分割成2个子序列

   ```shell
   [begin, end) = [begin, mid] + [mid, end), mid = (begin + end) >> 1
   ```

2. 假设问题的解是`S[i,j)`，那么问题的解有3中可能

   `[i,j)`存在于`[begin,mid)`中

   `[i,j)`存在于`mid,end`中

   `[i,j)`一部分存在于`[begin,mid)`中，另一部分存在于`[mid,end)`中

   ```java
   public int maxSubArray(int[] nums) {
       if (nums == null || nums.length == 0) return 0;
       return maxSubArray(nums, 0, nums.length);
   }
   public int maxSubArray(int[] nums, int begin, int end) {
       // 如果只有一个元素，那最大序列和就是这个元素本身
       if (end - begin < 2) return nums[begin];
       int mid = (begin + end) >> 1;
   
       // 求出横跨左右两边的子序列最大值的和
       int leftMax = Integer.MIN_VALUE, leftNum = 0;
       for (int i = mid - 1; i >= begin; i--) {
           leftNum += nums[i];
           if (leftMax < leftNum) leftMax = leftNum;
       }
       int rightMax = Integer.MIN_VALUE, rightNum = 0;
       for (int i = mid; i < end; i++) {
           rightNum += nums[i];
           if (rightMax < rightNum) rightMax = rightNum;
       }
   
       return Math.max(
           Math.max(maxSubArray(nums, begin, mid), maxSubArray(nums, mid, end)),
           leftMax + rightMax);
   }
   ```

3. 复杂度分析

   空间复杂度：`O(logn)`，时间复杂度：`O(nlogn)`

### 4. 动态规划

动态规划`Dynamic Programming`，用于求解最优问题的一种常用策略

#### 4.1 零钱兑换

[零钱兑换](https://leetcode-cn.com/problems/coin-change/)，假设现在有`25`分、`20`分、`5`分、`1`分的硬币，现要找给客户`41`分的零钱，如何办到硬币个数最少

> **求解过程**

假设`dp(n)`是凑到`n`分需要的最少硬币个数

- 如果第一次选择了`25`分的硬币，那么

$$
dp(n)=dp(n-25)+1
$$

- 如果第一次选择了`20`分的硬币，那么

$$
dp(n)=dp(n-20)+1
$$

- 如果第一次选择了`5`分的硬币，那么

$$
dp(n)=dp(n-5)+1
$$

- 如果第一次选择了`1`分的硬币，那么

$$
dp(n)=dp(n-1)+1
$$

- 综上应该是

$$
dp(n)=min\{dp(n-25),dp(n-20),dp(n-1)\}+1
$$

> **暴力递归**

```java
public int coins(int n) {
    if (n <= 0) return Integer.MAX_VALUE;
    if (n == 25 || n == 20 || n == 5 || n ==1) return 1;

    return Math.min(
        Math.min(coins(n - 25), coins(n - 20)),
        Math.min(coins(n - 5), coins(n - 1))) + 1;
}
```

存在大量重复计算，效率底下

> **记忆化搜索**

```java
public int coins(int n) {
    if (n <= 0) return -1;
    int[] dp = new int[n + 1]; // 保存已经求出的硬币数
    
    // 初始化
    int[] faces = {1, 5, 20, 25};
    for(int face : faces) {
        if (face > n) break;
        dp[face] = 1;
    }
    return coins(n, dp);
}
private int coins(int n, int[] dp) {
    if (n < 1) return Integer.MAX_VALUE;
    if (dp[n] == 0) {
        dp[n] = Math.min(
            Math.min(coins(n - 25, dp), coins(n - 20, dp)),
            Math.min(coins(n - 5, dp), coins(n - 1, dp))
        ) + 1;
    }
    return dp[n];
}
```

自顶向下的调用

> **动态规划**

```java
public int coins(int n){
    if (n < 1) return -1;
    int[] dp = new int[n + 1];
    for (int i = 1; i <= n; i++) {
        int min = dp[i - 1];
        if (i >= 5) min = Math.min(dp[i - 5], min);
        if (i >= 20) min = Math.min(dp[i - 20], min);
        if (i >= 25) min = Math.min(dp[i - 25], min);
        dp[i] = min + 1;
    }
    return dp[n];
}
```

时间复杂度：`O(n)`、空间复杂度：`O(n)`

> **最终优化**

```java
public int coinChange(int[] coins, int amount) {
    if (amount < 1 || coins == null || coins.length == 0) {
        return -1;
    }
    int[] dp = new int[amount + 1];
    for(int i = 1; i <= amount; i++) {
        int min = Integer.MAX_VALUE;
        for (int coin : coins) {
            if (i < coin) continue;
            min = Math.min(dp[i - coin], min);
        }
        dp[i] = min + 1;
    }
    return dp[amount];
}
```

