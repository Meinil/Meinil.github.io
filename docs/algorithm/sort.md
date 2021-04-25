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

<img src="https://gitee.com/dingwanli/picture/raw/master/20210406225135.png" style="zoom:70%;" />
<!-- more -->

**所有排序算法的父类**

```java
public abstract class Sort<E extends Comparable<E>>{

    protected E[] array; // 待排序的数组
    private int cmpCount; // 比较的次数
    private int swapCount; // 交换的次数

    public void sort(E[] array){
        if (array == null || array.length == 1) return;
        this.array = array;

        sort();
    }

    protected abstract void sort();

    /*
    * 返回值等于0，两个索引的值相等
    * 返回值小于0，第一个索引值小于第二个索引值
    * 返回值大于0，第一个索引值大于第二个索引值
    * */
    protected int cmp(int first, int second) {
        cmpCount++;
        return array[first].compareTo(array[second]);
    }

    // 比较元素
    protected int cmp(E first, E second) {
        cmpCount++;
        return first.compareTo(second);
    }
    protected void swap(int first, int second) {
        swapCount++;
        E temp = array[first];
        array[first] = array[second];
        array[second] = temp;
    }
}
```

### 1. 冒泡排序

#### 1.1 第一种实现方式

```java
public class BubbleSort<E extends Comparable<E>> extends Sort<E> {
    @Override
    protected void sort() {
        for(int end = array.length - 1; end > 0; end--) {
            for(int begin = 1; begin <= end; begin++) {
                if (cmp(begin, begin - 1) < 0) {
                    swap(begin, begin - 1);
                }
            }
        }
    }
}
```

#### 1.2 第一种优化

```java
public class BubbleSort<E extends Comparable<E>> extends Sort<E> {
    @Override
    protected void sort() {
        boolean flag = true; // 检测本次扫描是否有序
        for(int end = array.length - 1; end > 0; end--) {
            for(int begin = 1; begin <= end; begin++) {
                if (cmp(begin, begin - 1) < 0) {
                    cmp(begin, begin - 1);
                    flag = false;
                }
            }
            if (flag) break;
        }
    }
}
```

只针对有序的情况，如果数据本身是非常乱序的，可能此项优化更加消耗时间

#### 1.3 第二种优化

如果序列尾部已经局部有序，可以记录最后一次交换的位置，减少比较次数

```java
public class BubbleSort<E extends Comparable<E>> extends Sort<E> {
    @Override
    protected void sort() {
        int sortIndex; // 记录最后一次交换的位置
        for(int end = array.length - 1; end > 0; end--) {
            sortIndex = 1;
            for(int begin = 1; begin <= end; begin++) {
                if (cmp(begin, begin - 1) < 0) {
                    swap(begin, begin - 1);
                    sortIndex = begin;
                }
            }
            end = sortIndex;
        }
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
public class SelectionSort<E extends Comparable<E>> extends Sort<E>{
    @Override
    protected void sort() {
        int maxIndex;
        for(int end = array.length - 1; end > 0; end--) {
            maxIndex = 0;
            for(int begin = 1; begin <= end; begin++) {
                if (cmp(begin, maxIndex) > 0) {
                    maxIndex = begin;
                }
            }
            swap(maxIndex, end);
        }
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
public class HeadSort<E extends Comparable<E>> extends Sort<E>{
    private  int heapSize; // 堆的大小

    @Override
    protected void sort() {
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
        E element = array[index];

        int half = heapSize >> 1;
        while (index < half) { // index必须是非叶子节点
            // 默认是左边跟父节点比
            int childIndex = (index << 1) + 1;
            E child = array[childIndex];

            int rightIndex = childIndex + 1;
            // 右子节点比左子节点
            if (rightIndex < heapSize && cmp(array[rightIndex], child) > 0) {
                child = array[childIndex = rightIndex];
            }

            // 大于等于子节点
            if (cmp(element, child) >= 0) break;

            array[index] = child;
            index = childIndex;
        }
        array[index] = element;
    }
}

```

#### 3.1 时间复杂度

最好、最坏、平均时间复杂度：`O(nlogn)`、空间复杂度：`O(1)`，属于不稳定排序

### 4. 插入排序

1. 执行过程中，插入排序会将序列分为2部分

   头部是已经排好序的，尾部是待排序的

2. 从头开始扫描每一个元素

   每当扫描到一个元素，就将它插入到头部合适的位置，使得头部数据依然保持有序

```java
public class InsertSort<E extends Comparable<E>> extends Sort<E> {
    @Override
    protected void sort() {
        for (int begin = 1; begin < array.length; begin++) {
            int cur = begin;
            while (cur > 0 && cmp(cur, cur - 1) < 0) {
                swap(cur, cur - 1);
                cur--;
            }
        }
    }
}
```

#### 4.1 第一优化

上面的那种方法，每次比较过后都会进行交换，比较耗费时间，可以考虑将待插入的元素备份，所有比待排序元素大的(升序排序)，都超尾部挪动一个位置，将待插入的元素放到最终合适的位置

```java
public class InsertSort<E extends Comparable<E>> extends Sort<E> {
    @Override
    protected void sort() {
        for (int begin = 1; begin < array.length; begin++) {
            int cur = begin;
            E element = array[begin];
            while (cur > 0 && cmp(element, array[cur - 1]) < 0) {
                array[cur] = array[cur - 1];
                cur--;
            }
            array[cur] = element;
        }
    }
}
```

#### 4.2 第二优化

在元素`element`的插入过程中，可以先使用二分搜索在有序的序列中搜索出合适的位置，再将`element`插入，插入的位置一定是第一个大于当前元素的位置

```java
public class InsertSort<E extends Comparable<E>> extends Sort<E> {
    // 二分搜索优化
    @Override
    protected void sort() {
        for (int begin = 1; begin < array.length; begin++) {
            E element = array[begin];
            int left = 0, right = begin, mid;
            // 查找合适的查找位置
            while (left < right) {
                mid = (left + right) >> 1;
                if (cmp(array[mid], element) > 0) {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            }
            // 所有比当前插入元素要小的元素后移一位
            for (int i = begin; i > left; i--) {
                array[i] = array[i - 1];
            }
            array[left] = element;
        }
    }
}
```

#### 4.3 时间复杂度

数组`[2, 3, 8, 6, 1]`的逆序对为：`[2, 1]`，`[3, 1]`，`[8, 1]`，`[8, 6]`，`[6, 1]`，共5个逆序对

插入排序的时间复杂度与逆序对的数量成正比关系，最坏情况时间复杂度是`O(n^2)`，如果待排序的数组是有序的，即最好情况的时间复杂度`O(n)`

属于稳定排序

### 5. 归并排序

1. 不断将当前序列平均分割成2个子序列，直到只有一个元素为止
2. 不断地将2个子序列合并成一个有序序列，直到只剩下一个有序序列

```java
public class MergeSort<E extends Comparable<E>> extends Sort<E>{
    private E[] arr; // 用于合并时使用的临时数组

    @Override
    protected void sort() {
        arr = (E []) new Comparable[array.length >> 1];
        sort(0, array.length);
    }

    // 归并排序
    private void sort(int begin, int end) {
        if (end - begin < 2) return;
        int mid = (begin + end) >> 1;
        sort(begin, mid);
        sort(mid, end);

        merge(begin, mid, end);
    }
    // 对[begin, mid)和[mid, end)范围合并成一个有序序列
    private void merge(int begin, int mid, int end) {
        int li = 0, le = mid - begin;

        // 备份数组
        for(int i = li; i < le; i++) {
            arr[i] = array[begin + i];
        }
        while (li < le) {
            if (mid < end && cmp(arr[li], array[mid]) > 0) {
                array[begin++] = array[mid++];
            } else {
                array[begin++] = arr[li++];
            }
        }
    }
}
```

#### 5.1 时间复杂度

归并排序所消耗的时间：`T(n) = 2 * T(n / 2) + O(n)`，经递推推导：`O(nlogn)`。最好最坏都是`O(nlogn)`

空间复杂度：`O(n)`

#### 5.2 常用递推式

| 递推式             | 复杂度   |
| ------------------ | -------- |
| T(n) = T(n/2)+O(1) | O(logn)  |
| T(n)=T(n-1)+O(1)   | O(n)     |
| T(n)=T(n/2)+O(n)   | O(n)     |
| T(n)=2*T(n/2)+O(1) | O(n)     |
| T(n)=2*T(n/2)+O(n) | O(nlogn) |
| T(n)=T(n-1)+O(n)   | O(n^2)   |
| T(n)=2*T(n-1)+O(1) | O(2^n)   |
| T(n)=2*T(n-1)+O(n) | O(2^n)   |

### 6. 快速排序

1. 从序列中选择一个轴点元素`pivot`

   一般选择子序列的`0`位置元素为轴点

2. 利用`pivot`将序列分割成2个子序列

   将小于`pivot`的元素放在`pivot`前面

   将大于`pivot`的元素放在`pivot`后面

   等于`pivot`的元素放在哪都可以

3. 对以`pivot`分割成的子序列进行`1, 2`操作

   直到不能再分割(子序列只剩下一个元素)

```java
public class QuickSort <E extends Comparable<E>> extends Sort<E>{
    @Override
    protected void sort() {
        sort(0, array.length);
    }

    private void sort(int begin, int end) {
        if ((end - begin) < 2) {
            return;
        }

        int mid = pivot(begin, end);
        sort(begin, mid);
        sort(mid + 1, end);
    }

    private int pivot(int begin, int end) {
        E element = array[begin];
        end--;
        while (begin < end) {
            while (begin < end) {
                // 右边元素大于轴点元素
                if (cmp(array[end], element) > 0) {
                    end--;
                } else {
                    array[begin++] = array[end];
                    break;
                }
            }
            while (begin < end) {
                // 左边的元素小于轴点元素
                if (cmp(array[begin], element) < 0) {
                    begin++;
                } else {
                    array[end--] = array[begin];
                    break;
                }
            }
        }

        array[begin] = element;
        return begin;
    }
}
```

#### 6.1 优化

在寻找轴点的过程中，轴点元素比其他元素都小，而且其他元素为升序。效率最低

```java
public class QuickSort<E extends Comparable<E>> extends Sort<E>{
    @Override
    protected void sort() {
        sort(0, array.length);
    }

    private void sort(int begin, int end) {
        if ((end - begin) < 2) {
            return;
        }

        int mid = pivot(begin, end);
        sort(begin, mid);
        sort(mid + 1, end);
    }

    private int pivot(int begin, int end) {
        // 随机选取一个元素作为轴点
        swap(begin, begin + (int) (Math.random() * (end - begin)));
        E element = array[begin];
        end--;
        while (begin < end) {
            while (begin < end && (cmp(array[end], element) > 0)) {
                // 右边元素大于轴点元素
                end--;
            }
            while (begin < end && (cmp(array[begin], element) < 0)) {
                // 左边的元素小于轴点元素
                begin++;
            }
            if(begin < end) {
                swap(begin, end);
            }
        }
        array[begin] = element;
        return begin;
    }
}
```

#### 6.2 时间复杂度

最好情况下(左右元素比较均匀)：`O(nlogn)`

最坏情况下(轴点元素比其他元素都小，而且其他元素为升序)：`O(n^2)`

属于不稳定的元素

### 7. 希尔排序

- 希尔排序把序列看作一个矩阵，分成`m`列，逐列进行排序

  `m`从某个整数逐渐减为1

  当`m`为1时，整个序列将完全有序

- 矩阵的列数取决于步长序列

  希尔本人给出的步长序列是`n/2^k`，比如n为16时，步长序列是`{1, 2, 4, 8}`

- 希尔排序对每一列使用插入排序进行排序

```java
public class ShellSort<E extends Comparable<E>> extends Sort<E>{
    @Override
    protected void sort() {
        List<Integer> stepSequence = shellStepSequence(); // 步长序列
        for (Integer step : stepSequence) {
            sort(step);
        }
    }

    // 分成step进行排序
    private void sort(int step) {
        // col第几列
        for(int col = 0; col < step; col++) {
            // 插入排序对每一列进行排序
            for (int begin = col + step; begin < array.length; begin+=step) {
                int cur = begin;
                while (cur > col && cmp(cur, cur - step) < 0) {
                    swap(cur, cur - step);
                    cur = cur - step;
                }
            }
        }
    }

    // 生成步长序列
    private List<Integer> shellStepSequence() {
        List<Integer> stepSequence = new ArrayList<>();
        int step = array.length;

        while ((step = (step >> 1)) > 0) {
            stepSequence.add(step);
        }
        return stepSequence;
    }
}
```

#### 7.1 时间复杂度

希尔本人给出的步长序列：最坏情况下时间复杂度为`O(n^2)`

目前已知最好的步长序列，最坏情况时间复杂度是`O(n^(4/3))`
$$
(2^k-2^{k/2})+1,k为偶数
$$

$$
2^k-6*2^{(k+1)/2}+1,k为奇数
$$

实现如下

```java
private List<Integer> shellStepSequence() {
    List<Integer> stepSequence = new ArrayList<>();
    int step = 0, k = 0;

    while (true) {
        if (k % 2 == 0) {
            int pow = (int) Math.pow(2, k >> 1);
            step = 1 + 9 * (pow * pow - pow);
        } else {
            int pow1 = (int) Math.pow(2, (k - 1) >> 1);
            int pow2 = (int) Math.pow(2, (k + 1) >> 1);
            step = 1 + 8 * pow1 * pow2 - 6 * pow2;
        }

        if (step >= array.length) break;
        stepSequence.add(step);
        k++;
    }
    return stepSequence;
}
```

希尔排序属于不稳定的排序

### 8. 计数排序

以上七个算法都是基于比较的排序，计数排序、桶排序、基数排序不是基于比较的排序。典型的空间换时间。

计数排序适合对一定范围内的**整数**进行排序

核心思想：统计每个整数在序列中出现的次数，进而推导出每个整数在有序序列中的索引

```java
public class CountingSort extends Sort<Integer> {
    @Override
    protected void sort() {
        // 找出最大值
        int max = array[0];
        for(int i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
            }
        }

        // 存储每个整数出现的位置
        int[] counts = new int[max + 1];
        for(int i = 0; i < array.length; i++) {
            counts[array[i]]++;
        }

        // 排序
        for(int i = 0, k = 0; i < counts.length; i++) {
            while (counts[i] > 0) {
                array[k++] = i;
                counts[i]--;
            }
        }
    }
}
```

- 这个版本无法对负整数进行排序
- 浪费内存空间
- 不稳定排序
- 只能对正整数进行排序

#### 8.1 优化

1. 求出待排序数组中的最大值`max`与最小值`min`
2. 创建长度为`[max - min + 1]`长度的`counts`数组
3. `counts`数组中存储元素所出现的次数，以及当前元素之前有多上元素的和

```java
public class CountingSort2 extends Sort<Integer> {
    @Override
    protected void sort() {
        // 找出最大值
        int max = array[0], min = array[0];
        for(int i = 1; i < array.length; i++) {
            if (array[i] > max) {
                max = array[i];
            }
            if (array[i] < min) {
                min = array[i];
            }
        }

        // 存储每个整数出现的次数
        int[] counts = new int[max - min + 1];
        for(int i = 0; i < array.length; i++) {
            counts[array[i] - min]++;
        }
        // 累加前面的次数
        for(int i = 1; i < counts.length; i++) {
            counts[i] += counts[i - 1];
        }

        // 排序
        int[] newArray = new int[array.length];
        for(int i = array.length - 1; i >= 0; i--) {
            newArray[--counts[array[i] - min]] = array[i];
        }

        // 将排序好的数组拷贝至原数组
        for(int i = 0; i < array.length; i++) {
            array[i] = newArray[i];
        }
    }
}
```

这个优化解决了第一个版本中出现的问题

#### 8.2 复杂度分析

空间复杂度：`O(n+k)`，k为整数的取值范围

最好、最坏、平均时间复杂度：`O(n+k)`，k为整数的取值范围

属于稳定排序

### 9. 基数排序

基数排序非常适合于整数排序(尤其是非父整数)

执行流程：一次对个位数、十位数、百位数、千位数、万位数...进行排序(从低位到高位)

<img src="https://gitee.com/dingwanli/picture/raw/master/20210411100719.png" alt="继续排序" style="zoom:70%;" />

个位数、十位数、百位数的取值范围都是固定的`0-9`，可以使用计数排序对它们进行排序

```java
public class RadixSort extends Sort<Integer> {
    @Override
    protected void sort() {
        // 找最大值，确定要进行几次基数排序
        int max = array[0];
        for (int i = 1; i < array.length; i++) {
            if (max < array[i]) {
                max = array[i];
            }
        }

        for(int radix = 1; radix <= max; radix *= 10) {
            countingSort(radix);
        }
    }

    private void countingSort(int radix) {
        // 存储每个整数出现的次数
        int[] counts = new int[10];
        for(int i = 0; i < array.length; i++) {
            counts[array[i] / radix % 10]++;
        }
        // 累加前面的次数
        for(int i = 1; i < counts.length; i++) {
            counts[i] += counts[i - 1];
        }

        // 排序
        int[] newArray = new int[array.length];
        for(int i = array.length - 1; i >= 0; i--) {
            newArray[--counts[array[i] / radix % 10]] = array[i];
        }

        // 将排序好的数组拷贝至原数组
        for(int i = 0; i < array.length; i++) {
            array[i] = newArray[i];
        }
    }
}
```

#### 9.1 复杂度分析

最好、最坏、平均时间复杂度：`O(d*(n+k))`，d是最大值的位数，k是进制。属于稳定排序

空间复杂度：`O(n+k)`，k是进制

### 10. 桶排序

1. 创建一定数量的桶(数组、链表)
2. 按照一定的规则，将序列中的元素均匀分配到对应的桶中
3. 分别对每个桶进行单独排序
4. 将所有非空桶的元素合并成有序序列

不同的人制定的规则不同，结果也不同