---
title: 并查集
date: '2021-04-12'
sidebar: 'auto'
categories:
 - 数据结构
tags:
 - 算法
 - 数据结构
 - 并查集
---



### 1. 并查集

1. 并查集`Union Find`，也叫不相交集合`Disjoint Set`

2. 并查集有2个核心操作

   查找`Find`：查找元素所在的集合

   合并`Union`：将两个元素所在的集合合并为一个集合

#### 1.1 实现思路：

1. `Qucik Find`

   查找`Find`的时间复杂度：`O(1)`

   合并`Union`的时间复杂度：`O(n)`

2. `Quick Union`:star:

   查找`Find`的时间复杂度：`O(logn)`，可以优化至O(&alpha;(n))，&alpha;(n)<5

   合并`Union`的时间复杂度：`O(logn)`，可以优化至O(&alpha;(n))，&alpha;(n)<5

#### 1.2 存储数据

假设并查集处理的数据都是整型，那么可以使用整型数组来存储数据

<img src="https://gitee.com/dingwanli/picture/raw/master/20210411123318.png" alt="image-20210411123318270" style="zoom:80%;" />

- 0、1、3属于同一个集合
- 2单独属于一个集合
- 4、5、6、7属于同一个集合

因此并查集是可以用数组实现的树形结构(二叉堆、优先级队列也可以是用数组实现的树形结构)

### 2. 具体实现

#### 2.1 初始化

初始化时，每个元素各自属于一个单元素集合

![image-20210411124148991](https://gitee.com/dingwanli/picture/raw/master/20210411124149.png)

![image-20210411124210151](https://gitee.com/dingwanli/picture/raw/master/20210411124210.png)

**公共父类**

```java
public abstract class UnionFind {
    protected int[] parents;
    public UnionFind(int capacity) {
        if (capacity < 0) {
            throw new IllegalArgumentException("capacity must be >= 1");
        }

        parents = new int[capacity];
        for(int i = 0; i < parents.length; i++) {
            // 初始时每个节点的根节点都是它自己
            parents[i] = i;
        }
    }

    // 查找v所属集合的根节点
    public abstract int find(int v);

    // 检查v1、v2是否属于同一个集合
    public boolean isSame(int v1, int v2) {
        return find(v1) == find(v2);
    }

    // 合并v1、v2所在的集合
    public abstract void union(int v1, int v2);
    // 检查索引是否合法
    protected void rangeCheck(int v) {
        if(v >= parents.length || v < 0) {
            throw new IllegalArgumentException("v is out of bounds");
        }
    }
}
```

#### 2.2 QuickFind

> **Union**

合并两个集合`union(v1, v2)`，即把`v1`的根节点改为`v2`的根节点，`QuickFind`所创建的集合树高最大为`2`

> **find**

找某一个节点的所属集合(即根节点)，直接返回数组中对应的值即可

```java
public class UnionFindQuickFind extends UnionFind{
    public UnionFindQuickFind(int capacity) {
        super(capacity);
    }

    public int find(int v) {
        rangeCheck(v);
        return parents[v];
    }

    public void union(int v1, int v2) {
        int p1 = find(v1);
        int p2 = find(v2);
        if (p1 == p2) return;

        for(int i = 0; i < parents.length; i++) {
            if (parents[i] == p1) {
                parents[i] = p2;
            }
        }
    }
}
```

#### 2.3 QuickUnion

> **Union**

合并两个集合`union(v1, v2)`，即把`v1`的根节点改为指向`v2`的根节点

> **find**

找某一个节点的所属集合(即根节点)，需要找到当前集合的根节点，时间复杂度`logn`

```java
public class UnionFindQuickUnion extends UnionFind{
    public UnionFindQuickUnion(int capacity) {
        super(capacity);
    }

    @Override
    public int find(int v) {
        rangeCheck(v);
        while (v != parents[v]){
            v = parents[v];
        }
        return v;
    }

    @Override
    public void union(int v1, int v2) {
        int p1 = find(v1);
        int p2 = find(v2);

        if (p1 == p2) return;

        parents[p1] = p2;
    }
}
```

### 3. 优化

在`Union`的过程中，可能会出现树不平衡的情况，甚至退化成链表

<img src="https://gitee.com/dingwanli/picture/raw/master/20210411171433.png" alt="image-20210411171433823" style="zoom:80%;" />

两种优化方案

- 基于`size`的优化：元素少的树嫁接到元素多的树
- 基于`rank`的优化：矮的树嫁接到高的树

#### 3.1 基于size

```java
public class UnionFindQuickUnionSize extends UnionFind{
    private int[] sizes; // 存储每个集合的节点个数
    public UnionFindQuickUnionSize(int capacity) {
        super(capacity);
        sizes = new int[capacity];
        for (int i = 0; i < capacity; i++) {
            sizes[i] = 1; // 初始时每个集合的节点个数都为1
        }
    }

    @Override
    public int find(int v) {
        rangeCheck(v);
        while (v != parents[v]){
            v = parents[v];
        }
        return v;
    }

    @Override
    public void union(int v1, int v2) {
        int p1 = find(v1);
        int p2 = find(v2);

        if (p1 == p2) return;

        if (sizes[p1] < sizes[p2]) { // p1集合的节点个数少
            parents[p1] = p2;
            sizes[p2] += sizes[p1];
        } else {
            parents[p2] = p1; // p2集合的节点个数多
            sizes[p1] += sizes[p2];
        }
    }
}
```

#### 3.2 基于rank

```java
public class UnionFindQuickUnionRank extends UnionFind{
    private final int[] ranks;
    public UnionFindQuickUnionRank(int capacity) {
        super(capacity);
        ranks = new int[capacity];
        for(int i = 0; i < ranks.length; i++) {
            ranks[i] = 1;
        }
    }

    @Override
    public int find(int v) {
        rangeCheck(v);
        while (v != parents[v]){
            v = parents[v];
        }
        return v;
    }

    @Override
    public void union(int v1, int v2) {
        int p1 = find(v1);
        int p2 = find(v2);

        if (p1 == p2) return;

        if (ranks[p1] < ranks[p2]) {
            parents[p1] = p2;
        } else if (ranks[p1] > ranks[p2]){
            parents[p2] = p1;
        } else {
            parents[p1] = p2;
            ranks[p2] += 1;
        }
    }
}
```

#### 3.3 路径压缩

在`find`时使路径上的所有节点都指向根节点，从而降低树的高度

<img src="https://gitee.com/dingwanli/picture/raw/master/20210411210724.png" alt="image-20210411210723969" style="zoom:80%;" />

<img src="https://gitee.com/dingwanli/picture/raw/master/20210411210746.png" alt="image-20210411210723969" style="zoom:80%;" />

```java
public class UnionFindQuickUnionRankPathCompress extends UnionFind{
    private final int[] ranks;
    public UnionFindQuickUnionRankPathCompress(int capacity) {
        super(capacity);
        ranks = new int[capacity];
        for(int i = 0; i < capacity; i++) {
            ranks[i] = 1;
        }
    }

    @Override
    public int find(int v) {
        rangeCheck(v);
        if (parents[v] != v){
            parents[v] = find(parents[v]);
        }
        return parents[v];
    }

    @Override
    public void union(int v1, int v2) {
        int p1 = find(v1);
        int p2 = find(v2);

        if (p1 == p2) return;

        if (ranks[p1] < ranks[p2]) {
            parents[p1] = p2;
        } else if (ranks[p1] > ranks[p2]){
            parents[p2] = p1;
        } else {
            parents[p1] = p2;
            ranks[p2] += 1;
        }
    }
}
```

路径压缩是基于递归调用的，效率只会比`rank`稍高

#### 3.4 路径分裂

路径分裂：使路径上的每个节点都指向其祖父节点(`parent`的`parent`)

<img src="https://gitee.com/dingwanli/picture/raw/master/20210411212113.png" alt="image-20210411212113671" style="zoom:80%;" />

```java
package com.valid.union;

// 路径分裂
public class UnionFindQuickUnionRankPathSplit extends UnionFind{
    private final int[] ranks;
    public UnionFindQuickUnionRankPathSplit(int capacity) {
        super(capacity);
        ranks = new int[capacity];
        for(int i = 0; i < capacity; i++) {
            ranks[i] = 1;
        }
    }

    @Override
    public int find(int v) {
        rangeCheck(v);
        while (v != parents[v]){
            int p = parents[v]; // 保留v的父节点
            parents[v] = parents[parents[v]]; // 执行祖父节点
            v = p;
        }
        return v;
    }

    @Override
    public void union(int v1, int v2) {
        int p1 = find(v1);
        int p2 = find(v2);

        if (p1 == p2) return;

        if (ranks[p1] < ranks[p2]) {
            parents[p1] = p2;
        } else if (ranks[p1] > ranks[p2]){
            parents[p2] = p1;
        } else {
            parents[p1] = p2;
            ranks[p2] += 1;
        }
    }
}
```

#### 3.5 路径减半

路径减半`Path Halving`：使路径上每隔一个节点就指向其祖父节点(`parent`的`parent`)

<img src="https://gitee.com/dingwanli/picture/raw/master/20210411212931.png" alt="image-20210411212931764" style="zoom:80%;" />

```java
public class UnionFindQuickUnionRankPathSplit extends UnionFind{
    private final int[] ranks;
    public UnionFindQuickUnionRankPathSplit(int capacity) {
        super(capacity);
        ranks = new int[capacity];
        for(int i = 0; i < capacity; i++) {
            ranks[i] = 1;
        }
    }

    @Override
    public int find(int v) {
        rangeCheck(v);
        while (v != parents[v]){
            parents[v] = parents[parents[v]]; // 执行祖父节点
            v = parents[v];
        }
        return v;
    }

    @Override
    public void union(int v1, int v2) {
        int p1 = find(v1);
        int p2 = find(v2);

        if (p1 == p2) return;

        if (ranks[p1] < ranks[p2]) {
            parents[p1] = p2;
        } else if (ranks[p1] > ranks[p2]){
            parents[p2] = p1;
        } else {
            parents[p1] = p2;
            ranks[p2] += 1;
        }
    }
}
```

#### 3.6 泛型支持

```java
public class GenericUnionFind<E> {
    // 用于存储所有的节点
    private final Map<E, Node<E>> nodes = new HashMap<>();

    // 创建一个集合
    public void makeSet(E v) {
        if (!nodes.containsKey(v)) {
            nodes.put(v, new Node<>(v));
        }
    }

    // 找出v的根节点
    private Node<E> findNode(E v) {
        Node<E> node = nodes.get(v);
        if (node == null) return null;

        // 路径减半算法
        while (!Objects.equals(node.value, node.parent.value)) {
            node.parent = node.parent.parent;
            node = node.parent;
        }

        return node;
    }

    public E find(E v) {
        Node<E> node = findNode(v);

        return node == null ? null : node.value;
    }

    public void union(E v1, E v2) {
        Node<E> p1 = findNode(v1);
        Node<E> p2 = findNode(v2);

        if (p1 == null || p2 == null) return;
        if (Objects.equals(p1.value, p2.value)) return;

        if (p1.rank < p2.rank) {
            p1.parent = p2;
        } else if (p1.rank > p2.rank) {
            p2.parent = p1;
        } else {
            p1.parent = p2;
            p2.rank++;
        }
    }

    public boolean isSame(E v1, E v2) {
        return Objects.equals(find(v1), find(v2));
    }

    // 集合中的节点对象
    private static class Node<E> {
        E value;
        Node<E> parent = this;
        int rank = 1;
        Node(E value) {
            this.value = value;
        }
    }
}
```

### 4. 总结

使用路径压缩、分裂或减半+基于`rank`或者`size`的优化

可以确保每个操作的均摊时间复杂度为O(&alpha;(n))，&alpha;(n)<5