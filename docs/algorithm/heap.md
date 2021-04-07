---
title: 堆
date: '2021-04-07'
sidebar: 'auto'
categories:
 - 数据结构
tags:
 - 算法
 - 数据结构
 - 堆
---

### 

## 1. 堆的特点(二叉堆)

- 堆的父节点一定比子节点的值要大(或小)，称为大根堆(或小根堆)

- 二叉堆的逻辑结构就是一棵完全二叉树，所以也叫完全二叉堆

![image-20210407124752907](https://gitee.com/dingwanli/picture/raw/master/20210407124802.png)

- 二叉堆的底层结构一般使用数组实现

  | i     | 0    | 1    | 2    | 3    | 4    | 5    | 6    | 7    | 8    | 9    |
  | ----- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
  | value | 72   | 68   | 50   | 43   | 38   | 47   | 21   | 14   | 40   | 3    |

- 索引的`i`的规律

  如果`i = 0`，它是根节点

  如果`i > 0`，它的父节点编号为`floor(i - 1) / 2`

  如果`2*i + 1 <= n - 1`，它的左子节点编号为`2*i + 1`

  如果`2*i + 1 > n - 1`，它无左子节点

  如果`2*i + 2 <= n - 1`，它的右子节点编号为`2 * i + 2`

  如果`2*i + 2 > n - 1`，它无右子节点

## 2. 主要方法

```java
public interface Heap <E>{
    int size(); // 元素的数量
    boolean isEmpty(); // 对是否为空
    void clear(); //清空堆
    void add(E element); // 添加元素
    E get(); // 获取堆顶元素
    E remove(); // 删除堆顶元素
    E replace(E element); // 删除堆顶元素的同时添加一个元素
}
```

### 2.1 属性和构造函数

1. 属性

   ```java
   private E[] elements;
   private int size;
   private Comparator<E> comparator;
   private static final int DEFAULT_CAPACITY = 10;
   ```

2. 构造函数

   ```java
   public BinaryHeap(Comparator<E> comparator) {
       this.comparator = comparator;
       this.elements = (E[]) new Object[DEFAULT_CAPACITY];
       this.size = 0;
   }
   
   public BinaryHeap() {
   	this(null);
   }
   ```

### 2.2 几个辅助方法

1. 比较，插入堆中的元素必须是可比较的

   ```java
   private int compare(E e1, E e2) {
       return comparator != null ?
       	comparator.compare(e1, e2) : ((Comparable<E> )e1).compareTo(e2);
   }
   ```

2. 检查`heap`是否为空

   ```java
   private void emptyCheck() {
       if (size == 0) {
       	throw new IndexOutOfBoundsException("Heap is empty");
       }
   }
   ```

3. 检查插入的元素是否为`null`，堆中不允许插入`null`值

   ```java
   private void elementNotNullCheck(E element) {
       if (element == null) {
       	throw new IllegalArgumentException("Element is not null");
       }
   }
   ```

4. 数组扩容

   ```java
   private void ensureCapacity(int capacity){
       if (elements.length >= capacity) {
       	return;
       }
       // 扩容数组的容量为原来的1.5倍
       E []newElements = (E[])new Object[elements.length + (elements.length >> 1)];
       for(int i = 0; i < size; i++){
       	newElements[i] = elements[i];
       }
       elements = newElements;
   }
   ```

## 3. 添加元素

假设现在添加的元素为`node`

1. 如果`node `大于父节点与父节点交换位置
2. 如果`node`小于或者等于父节点，或者`node`没有父节点，退出循环

以上的过程称为上滤`Sift Up`，时间复杂度为`O(logn)`

```java
public void add(E element) {
    // 检查元素是否为空, 二叉堆不允许插入null值
    elementNotNullCheck(element);
    // 检查数组容量
    ensureCapacity(size + 1);
    elements[size++] = element;
    siftUp(size - 1);
}

// 上滤
private void siftUp(int index) {
    E element = elements[index];
    int parent;
    while(index > 0) {
        parent = (index - 1) >> 1;

        // 小于父节点无需上滤
        if (compare(elements[parent], element) >= 0) return;

        // 将父元素放在index的位置
        elements[index] = elements[parent];
        index = parent;
    }
    // 将要添加的元素放在指定的位置
    elements[index] = element;
}
```

## 4. 删除元素

### 4.1 删除堆顶元素

堆的删除就是删除堆顶元素。原理就是利用数组的最后一个元素覆盖堆顶的元素，然后对堆顶元素进行下滤

具体步骤

1. 用最后一个节点覆盖根节点

2. 删除最后一个节点

3. 循环执行以下操作

   如果`node` < 子节点，从子节点中选出最大的与`node`进行交换

   如果`node` >= 子节点或者没有子节点，结束循环

时间复杂度`O(logn)`

```java
public E remove() {
    emptyCheck();

    E root = elements[0];
    elements[0] = elements[size - 1];
    elements[--size] = null;

    siftDown(0);
    return root;
}

private void siftDown(int index) {
    E element = elements[index];

    int half = size >> 1; // 非叶子节点的个数
    // 第一个叶子节点的索引 == 非叶子节点的个数
    // index应该是非叶子节点
    while (index < half) {
        // index 的节点有2种情况
        // 1. 只有左子节点
        // 2. 同时有左右子节点
        int child  = (index << 1) + 1; // 默认为左子节点

        if (compare(element, elements[child]) >= 0) break; // 如果比子节点大，结束循环

        // 选出最大子节点
        if (child < size && compare(elements[child], elements[child + 1]) < 0) {
        	child++;
        }

        // 将子节点存放到index
        elements[index] = elements[child];
        // 重新设置index
        index = child;
    }
    elements[index] = element;
}
```

### 4.2 删除堆顶并插入一个元素

```java
public E replace(E element) {
    elementNotNullCheck(element);

    E root = null;
    if (size != 0) {
        root = elements[0];
        elements[0] = element;
        siftDown(0);
    } else {
        elements[size++] = element;
    }
    return root;
}
```

## 5. 建堆

