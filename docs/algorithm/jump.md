---
title: 跳表
date: '2021-05-02'
sidebar: 'auto'
categories:
 - 数据结构
tags:
 - 算法
 - 数据结构
---

### 1. 跳表

跳表`SkipList`：又叫跳跃表、跳跃列表，在有序列表的基础上增加了"跳跃"的功能

对比平衡二叉树：

- 跳表的实现和维护更加简单
- 跳表的搜索、删除、添加的平均时间复杂度是`O(logn)`

> **普通链表**

查找某一个元素只能从头查找到尾

![image-20210502211727701](https://gitee.com/dingwanli/picture/raw/master/20210502211729.png)

> **跳表**

跳过紧挨着的元素直接查找下一个元素

![image-20210502211435113](https://gitee.com/dingwanli/picture/raw/master/20210502211439.png)

> **多重跳表**

在跳表之上再添加一层跳表

![image-20210502211853874](https://gitee.com/dingwanli/picture/raw/master/20210502211855.png)

![image-20210502211546905](https://gitee.com/dingwanli/picture/raw/master/20210502211548.png)

### 2. 具体实现

#### 2.1 类的结构

```java
public class SkipList<K, V>{
    private static final int MAX_LEVEL = 32; // 跳表的最大层级
    private int size;                        // 跳表的长队
    private final Comparator<K> comparator;  // 比较器
    private Node<K, V> first;                // 头节点
    private int level;                      // 有效层数

    // Key必须是可比较的
    public SkipList(Comparator<K> comparator) {
        this.comparator = comparator;
        first = new Node<>();
        first.next = new Node[MAX_LEVEL];
    }

    public SkipList() {
        this(null);
    }

    // 跳表的大小
    public int size() {
        return size;
    }

    // 跳表是否为空
    public boolean isEmpty() {
        return size == 0;
    }

    // 加入元素
    public V put(K key, V value) {
        keyCheck(key);
        return null;
    }

    // 获取元素
    public V get(K key) {
        keyCheck(key);
        return null;
    }

    // 移除元素
    public V remove(K key) {
        keyCheck(key);
        return null;
    }

    // 比较方法
    private int compare(K k1, K k2) {
        return comparator != null
                ? comparator.compare(k1, k2)
                : ((Comparable<K>)k1).compareTo(k2);
    }

    private void keyCheck(K key) {
        if (key == null) {
            throw new IllegalArgumentException("key 不允许为空");
        }
    }

    private static class Node<K, V> {
        K key;             // 节点的键
        V value;           // 节点的值
        Node<K, V>[] next; // 节点的next
    }
}
```

#### 2.2 获取元素

1. 从顶层链表的首元素开始，从往右搜索，直至找到一个大于或等于目标的元素，或者达到当前层链表的尾部
2. 如果该元素等于目标元素，则表明该元素已被找到
3. 如果该元素大于目标元素或已到达链表的尾部，则退回当前层的前一个元素，然后转入下一层进行搜索

```java
public V get(K key) {
    keyCheck(key);

    Node<K, V> node = first;
    for(int i = level - 1; i >= 0; i--) {
        while(node.next[i] != null && (compare(key, node.next[i].key) > 0)) {
            node = node.next[i];        // 遍历某一个跳表
        }
        if (compare(key, node.next[i].key) == 0) {
            return node.next[i].value;
        }
    }
    return null;
}
```

#### 2.3 添加