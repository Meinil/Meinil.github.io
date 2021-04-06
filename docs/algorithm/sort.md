---
title: 十大排序算法
date: '2021-04-05'
sidebar: 'auto'
categories:
 - 算法
tags:
 - 算法
 - 排序
---

<img src="https://gitee.com/dingwanli/picture/raw/master/20210406225135.png" style="zoom:80%;" />

<!-- more -->

### 1. 冒泡排序

#### 1.1 第一种实现方式

```java
public void bubbleSort(int[] array) {
    int temp;
    for(int end = array.length - 1; end > 0; end--) {
        for(int begin = 1; begin <= end; begin++) {
            if (array[begin] < array[begin - 1]) {
                temp = array[begin];
                array[begin] = array[begin - 1];
                array[begin - 1] = temp;
            }
        }
    }
}
```

#### 1.2 第一种优化

```java
public void bubbleSort(int[] array) {
    int temp;
    boolean flag = true; // 检测本次扫描是否有序
    for(int end = array.length - 1; end > 0; end--) {
        for(int begin = 1; begin <= end; begin++) {
            if (array[begin] < array[begin - 1]) {
                temp = array[begin];
                array[begin] = array[begin - 1];
                array[begin - 1] = temp;
                flag = false;
        	}
        }
        if (flag) break;
    }
}
```

只针对有序的情况，如果数据本身是非常乱序的，可能此项优化更加消耗时间

#### 1.3 第二种优化

如果序列尾部已经局部有序，可以记录最后一次交换的位置，减少比较次数

```java
public void bubbleSort(int[] array) {
    int temp;
    int sortIndex; // 记录最后一次交换的位置
    for(int end = array.length - 1; end > 0; end--) {
        sortIndex = 1;
        for(int begin = 1; begin <= end; begin++) {
            if (array[begin] < array[begin - 1]) {
                temp = array[begin];
                array[begin] = array[begin - 1];
                array[begin - 1] = temp;
                sortIndex = begin;
            }
        }
    	end = sortIndex;
    }
}
```

#### 1.4 时间复杂度分析

完全无序：最坏情况`O(n^2)`

完全有序：最后情况`O(n)`

> 排序算法的稳定性：如果相等的两个元素，在排序前后的相对位置保持不变，那么这就是稳定的排序。对于自定义的对象进行排序时，稳定性会影响最终的排序效果。冒泡算法属于稳定的排序算法

> 原地算法(in-place Algorithm)：不依赖额外的资源或者依赖少数的额外资源，仅依靠输出来覆盖输入。(空间复杂度为O(1)的算法都可以认为是原地算法)

### 2. 选择排序

- 从序列中找出最大的元素，然后与最末尾的元素交换位置
- 执行完一轮后，最末尾的元素就是最大的元素
- 重复`n-1`次

```java
public void selectSort(int[] array) {
    int temp;
    int maxIndex; // 最大元素的索引
    for(int end = array.length - 1; end > 0; end--) {
    	maxIndex = 0;
        for(int begin = 1; begin <= end; begin++) {
            if (array[begin] > array[maxIndex]) {
                maxIndex = begin;
            }
        }
    	array[end] = array[maxIndex];
    }
}
```

#### 2.1 复杂度分析

- 选择排序的交换次数少于冒泡排序，平均性能优于冒泡排序
- 最好、最坏、平均时间复杂度：`O(n^2)`，空间复杂度：`O(1)`，属于稳定排序

### 3. 堆排序

堆排序可以认为是对选择排序的一种优化

1. 对待排序的序列进行原地建大根堆

2. 重复执行以下操作，直到堆的元素数量为1

   交换堆顶元素与尾元素

   堆的元素数量减1

   对0位置进行一次`siftDown`操作

```java
public class HeadSort {
    private int heapSize; // 堆的大小
    private Integer[] array; // 待排序的数组

    public void sort(Integer[] array) {
        this.array = array;
        // 原地建堆
        heapSize = array.length;
        for(int i = (heapSize >> 1) - 1; i >= 0; i--) {
            siftDown(i);
        }

        System.out.println(Arrays.toString(array));
        while (heapSize > 1) {
            // 交换堆顶元素和尾部元素
            swap(0, --heapSize);

            // 对0位置进行siftDown
            siftDown(0);
        }
    }

    private void siftDown(int index) {
        Integer element = array[index];

        int half = heapSize >> 1;
        while (index < half) { // index必须是非叶子节点
            // 默认是左边跟父节点比
            int childIndex = (index << 1) + 1;
            Integer child = array[childIndex];

            int rightIndex = childIndex + 1;
            // 右子节点比左子节点
            if (rightIndex < heapSize && cmpElements(array[rightIndex], child) > 0) {
                child = array[childIndex = rightIndex];
            }

            // 大于等于子节点
            if (cmpElements(element, child) >= 0) break;

            array[index] = child;
            index = childIndex;
        }
        array[index] = element;
    }
    /*
     * 返回值等于0，两个索引的值相等
  	 * 返回值小于0，第一个索引值小于第二个索引值
	 * 返回值大于0，第一个索引值大于第二个索引值
	 **/
    private int cmp(int first, int second) {
        cmpCount++;
        return array[first] - array[second];
    }

    // 比较元素
    private int cmpElements(Integer first, Integer second) {
        return first - second;
    }
    private void swap(int first, int second) {
        int temp = array[first];
        array[first] = array[second];
        array[second] = temp;
    }
}
```

#### 3.1 时间复杂度

最好、最坏、平均时间复杂度：`O(nlogn)`、空间复杂度：`O(1)`，属于不稳定排序