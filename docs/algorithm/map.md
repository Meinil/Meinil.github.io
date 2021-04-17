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

### 2. 存储结构

#### 2.1 邻接矩阵

- 一维数组存放顶点信息
- 二维数组存放边信息

<img src="https://gitee.com/dingwanli/picture/raw/master/20210413215853.png" alt="image-20210413215853535" style="zoom:50%;" />

0代表没有边，1代表有边

#### 2.2 邻接表

只需要一个数组即可，数组中存储各节点的信息

<img src="https://gitee.com/dingwanli/picture/raw/master/20210413220023.png" alt="image-20210413220023638" style="zoom:50%;" />

#### 2.3 通用接口

```java
public abstract class Graph<V, E> {
    public abstract int edgesSize(); // 边的个数
    public abstract int verticesSize(); // 点的个数

    public abstract void addVertex(V v); // 添加点
    public abstract void addEdge(V from, V to); // 添加边
    public abstract void addEdge(V from, V to, E weight); // 添加边

    public abstract void removeVertex(V v); // 删除点
    public abstract void removeEdge(V from, V to); // 删除边

    public abstract void bfs(V begin, Predicate<V> consumer); // 从begin开始进行广度优先遍历
    public abstract void dfs(V begin, Predicate<V> consumer); // 从begin开始进行深度优先遍历
}
```

通用接口有两个泛型，`V`用于表示顶点的类型，`E`用于表示权重的类型

### 3. 邻接表的实现

#### 3.1 两个内部类

```java
public class ListGraph<V, E> implements Graph<V, E>{
    private static class Vertex<V, E>{
        V value;
        Set<Edge<V, E>> inEdges = new HashSet<>();; // 以当前节点为终点的边
        Set<Edge<V, E>> outEdges = new HashSet<>(); // 以当前节点为起点的边

        public Vertex(V value) {
            this.value = value;
        }

        @Override
        public boolean equals(Object obj) {
            // 如果两个顶点存储的值相同，则认为这两个点是同一个点
            return Objects.equals(value, ((Vertex<V, E>)obj).value);
        }

        @Override
        public int hashCode() {
            return value == null ? 0 : value.hashCode();
        }
    }
    private static class Edge<V, E>{
        Vertex<V, E> from; // 边的起点
        Vertex<V, E> to; // 边的终点
        E weight;

        public Edge(Vertex<V, E> from, Vertex<V, E> to) {
            this(from, to, null);
        }

        public Edge(Vertex<V, E> from, Vertex<V, E> to, E weight) {
            this.from = from;
            this.to = to;
            this.weight = weight;
        }

        @Override
        public boolean equals(Object obj) {
            Edge<V, E> edge = (Edge<V, E>) obj;
            // 如果一条边的起始和终点相同，则认为是同一条边
            return Objects.equals(from, edge.from) && Objects.equals(to, edge.to);
        }

        @Override
        public int hashCode() {
            return from.hashCode() * 31 + to.hashCode();
        }
    }
}
```

1. `Vertex<V, E>`顶点的存储结构

   `inEdges`存储顶点的入度

   `outEdges`存储顶点的出度

   `value`存储顶点的信息(名称)

2. `Edge<V, E>`边的存储结构

   `from`一条边的起点

   `to`一条边的终点

   `weight`权重

#### 3.2 添加顶点和边

> **属性**

```java
private Map<V, Vertex<V, E>> vertices = new HashMap<>(); //存储顶点
private Set<Edge<V, E>> edges = new HashSet<>(); // 存储边信息
```

> **两个方法**

`edgesSize()`返回边的个数

`verticesSize()`返回顶点的个数

```java
@Override
public int edgesSize() {
	return edges.size();
}

@Override
public int verticesSize() {
	return vertices.size();
}
```

> **添加顶点**

```java
@Override
public void addVertex(V v) {
    if (!vertices.containsKey(v)) {
    	vertices.put(v, new Vertex<>(v));
    }
}
```

> **添加边**
>

- 添加边的时候，需要先判断集合中是否存在，存在更新权重，不存在添加

- 添加边的时候，有三个地方需要添加

  起始点`fromVertex`的出度

  接入点`toVertex`的入度

  边集`edges`
```java
@Override
public void addEdge(V from, V to) {
	addEdge(from, to, null);
}

@Override
public void addEdge(V from, V to, E weight) {
    // 判断from和to是否在已经被添加进去
    Vertex<V, E> fromVertex = vertices.get(from);
    if (fromVertex == null) {
        fromVertex = new Vertex<>(from);
        vertices.put(from, fromVertex);
	}

    Vertex<V, E> toVertex = vertices.get(to);
        if (toVertex == null) {
        toVertex = new Vertex<>(to);
        vertices.put(to, toVertex);
    }

    // 创建一条边
    Edge<V, E> edge = new Edge<>(fromVertex, toVertex, weight);
    if (fromVertex.outEdges.remove(edge)) {
        // 如果存在则从边的集合中移除这条边
        toVertex.inEdges.remove(edge);

        edges.remove(edge);
    }

    // 将边添加至边的集合
    fromVertex.outEdges.add(edge);
    toVertex.inEdges.add(edge);
    edges.add(edge);
}
```

#### 3.3 删除顶点和边

> 删除顶点

- 删除顶点需要在所有的入度和出度中删除所在的边
- 对于一边遍历一边删除的集合来说，最好使用迭代器，否则会引发不可预知的错误

```java
@Override
public void removeVertex(V v) {
    // 从顶点集中删除待删除的定点
    Vertex<V, E> vertex = vertices.remove(v);
    if (vertex == null) return; // 返回为空，说明待删除的节点不存在

    Iterator<Edge<V, E>> iterator = vertex.outEdges.iterator();
    while(iterator.hasNext()) {
        Edge<V, E> edge = iterator.next();
        // 删除当前边的终点里的入边
        edge.to.inEdges.remove(edge);
        iterator.remove(); // 删除当前遍历到的边
        edges.remove(edge);
    }

    iterator = vertex.inEdges.iterator();
    while(iterator.hasNext()) {
        Edge<V, E> edge = iterator.next();
        // 删除当前边的终点里的出边
        edge.from.outEdges.remove(edge);
        iterator.remove(); // 删除当前遍历到的边
        edges.remove(edge);
    }
}
```

> 删除边同理

```java
@Override
public void removeEdge(V from, V to) {
    // 不存在的点直接返回即可
    Vertex<V, E> fromVertex = vertices.get(from);
    if (fromVertex == null) return;

    Vertex<V, E> toVertex = vertices.get(to);
    if (toVertex == null) return;

    Edge<V, E> edge = new Edge<>(fromVertex, toVertex);
    if (fromVertex.outEdges.remove(edge)) {
        toVertex.inEdges.remove(edge);
        edges.remove(edge);
    }
}
```

### 4. 图的遍历

从图中某一顶点出发访问图中其余顶点，且每个顶点仅被访问一次

图的遍历有两种方式

- 广度优先搜索`Breadth First Search,BFS`，又称宽度优先搜索、横向优先搜索。
- 深度优先搜索`Depth First Search,DFS`

在`Graph`接口中添加两个方法

```java
public abstract void bfs(V begin, Predicate<V> consumer); // 从begin开始进行广度优先遍历
public abstract void dfs(V begin, Predicate<V> consumer); // 从begin开始进行深度优先遍历
```

#### 4.1 广度优先搜索

1. 从某一顶点出发，将顶点入队
2. 如果队列不为空取出队头元素进行访问
3. 将它的所有未访问的邻接点入队
4. 重复2、3

```java
@Override
public void bfs(V begin, Predicate<V> consumer) {
    Vertex<V, E> vertex = vertices.get(begin);
    if (vertex == null) return;

    Set<Vertex<V, E>> visitedVertices = new HashSet<>(); // 存储已经访问过的节点
    Queue<Vertex<V, E>> queue = new LinkedList<>(); // 存储待访问的顶点
    queue.offer(vertex);
    visitedVertices.add(vertex);
    while (!queue.isEmpty()) {
        vertex = queue.poll();
        if (consumer.test(vertex.value)) break;

        for(Edge<V, E> edge : vertex.outEdges) {
            if (!visitedVertices.contains(edge.to)) {
                queue.offer(edge.to);
                visitedVertices.add(edge.to);
            }
        }
    }
}
```

#### 4.2 深度优先搜索

深度优先搜索类似于二叉树的前序遍历

1. 从任意一顶点出发，访问其值
2. 将其标记为已访问
3. 查找当前节点的第一个未被访问节点，递归进行1，2操作

```java
@Override
public void dfs(V begin, Predicate<V> consumer) {
    Vertex<V, E> vertex = vertices.get(begin);
    if (vertex == null) return;
    dfs(vertex, new HashSet<>(), consumer); // HashSet存储已经访问过的节点
}

private void dfs(Vertex<V, E> vertex, Set<Vertex<V, E>> visited, Predicate<V> consumer) {
	if (consumer.test(vertex.value)) return;
    vertex.outEdges.forEach(edge -> {
        if (!visited.contains(edge.to)) {
            dfs(edge.to, visited, consumer);
            visited.add(edge.to);
        }
    });
}
```

> **非递归的形式**

```java
@Override
public void dfs(V begin,Predicate<V> consumer) {
    Vertex<V, E> vertex = vertices.get(begin);
    if (vertex == null) return;
    Set<Vertex<V, E>> visited = new HashSet<>(); // HashSet存储已经访问过的节点
    Stack<Vertex<V, E>> stack = new Stack<>(); // 存储需要回溯的节点

    // 访问根节点
    stack.push(vertex);
    visited.add(vertex);
    if (consumer.test(vertex.value)) return;

    while (!stack.empty()) {
        vertex = stack.pop();

        for(Edge<V, E> edge : vertex.outEdges) {
            if(!visited.contains(edge.to)) {
                stack.push(edge.from); // 保存根节点以便回溯
                stack.push(edge.to);
                visited.add(edge.to);
                if (consumer.test(edge.to.value)) return;
                break;
            }
        }
    }
}
```

### 5. AOV网

- 一项大的工程常被分为多个小的子工程

  子工程之间可能存在一定的先后顺序，即某些子工程必须在其他的一些子工程完成后才能开始

- 一般通过有向图来描述和分析一项工程的计划和实施过程，子工程被称为活动`Activity`

  以顶点表示活动、有向边表示活动之间的先后关系，这样的图称为`AOV`网

- 标准的`AOV`网必须是一个有向无环图

  ```mermaid
  graph LR
  A --> B --> C --> E
  B --> E --> F
  B --> D --> E
  ```

- 前驱活动：有向边起点的活动称为终点的前驱活动

    只有一个活动的前驱全部都完成后，这个活动才能进行

- 后继活动：有向边终点的活动称为起点的后继活动

#### 5.1 拓扑排序

>  什么是拓扑排序？

将`AOV`网所有活动排成一个序列，使得每个活动的前驱活动都排在该活动的前面

比如上图的拓扑排序

```
ABCDEF 或 ABDCEF
```

> 卡恩算法

假设L是存放拓扑排序结果的列表

1. 把入度为0的顶点放入到L中国年，然后把这些顶点从图中去掉
2. 重复操作1操作，直到找不到入度为0的顶点

如果此时L中的元素个数和顶点总数相同，说明拓扑排序完成

如果此时L中的元素个数少于顶点总数，说明原图中存在环，无法进行拓扑排序

`Graph`接口中添加方法

```java
public abstract List<V> topologicalSort(); // 拓扑排序
```

>  具体实现

```java
@Override
public List<V> topologicalSort() {
    if (verticesSize() == 0) return null;
    List<V> list = new ArrayList<>();
    Queue<Vertex<V, E>> queue = new LinkedList<>();

    Map<Vertex<V, E>, Integer> degrees = new HashMap();
    // 初始化(将度为0的节点都入队)
    vertices.forEach((V v, Vertex<V, E> vertex) -> {
        if (vertex.inEdges.size() == 0) {
            queue.offer(vertex);
        } else {
            // 维护每个入度不为零的节点的入度数
            degrees.put(vertex, vertex.inEdges.size());
        }
    });

    Vertex<V, E> vertex;
    while (!queue.isEmpty()) {
        vertex = queue.poll();
        list.add(vertex.value);
        for(Edge<V, E> edge : vertex.outEdges) {
            // 更改入度
            int to = degrees.get(edge.to) - 1;
            if (to == 0) {
                queue.offer(edge.to);
            } else {
                degrees.put(edge.to, to); // 更改入度
            }
        }
    }

    return list.size() == verticesSize() ? list : null;
}
```

### 6. 生成树

生成树：连通图的极小连通子图，它含有图中全部的n个顶点，恰好只有`n-1`条边

<img src="https://gitee.com/dingwanli/picture/raw/master/20210415220206.png" alt="image-20210415220159294" style="zoom:80%;" />

最小生成树：是所有生成树中，总权值最小的那棵(适用于有权的**无向连通图**)

求最小生成树的2个经典的算法

- `Prim`算法
- `Kruskal`算法

#### 6.1 Prim算法(加点法)

假设`G=(V,E)`是有权的连通图(无向),`A`是`G`中最小生成树的边集

1. 将集合分为两部分，`S={u0}(u0属于V)`，`S-V={V - u0}`
2. 从集合`S-V`中选取一个最小的且与`S`连通的边，并将`S-V`的节点加入到`S`中
3. 重复1、2操作

`Graph`接口中添加新的结构

```java
public abstract Set<EdgeInfo<V, E>> mst(); // 最小生成树
// 边信息
protected static class EdgeInfo<V, E> {
    private V from;
    private V to;
    private E weight;
    public EdgeInfo(V from, V to, E weight) {
        this.from = from;
        this.to = to;
        this.weight = weight;
    }
}

// 权重管理
protected WeightManager<E> weightManager;
public interface WeightManager<E> {
    int compare(E w1, E w2); // 比较
    E add(E w1, E w2); // 相加
}
public Graph(WeightManager<E> weightManager) {
    this.weightManager = weightManager; // 有权图
}
public Graph() {} // 无权图
```

`ListGraph`添加方法，用于将集合转换为数组，供建小顶堆使用，`Prim`中使用小顶堆来选择最小边，[小顶堆](https://schrodingerseecat.github.io/algorithm/heap.html)

```java
private Edge<V, E>[] collectionConversionArray(Set<Edge<V, E>> collection) {
    if (collection.size() == 0) return null;
    Edge<V, E>[] elements = new Edge[collection.size()];
    int i = 0;
    for(Edge<V, E> element : collection) {
        elements[i++] = element;
    }
    return elements;
}
```

`ListGraph`中实现比较器

```java
private Comparator<Edge<V, E>> edgeComparator = (Edge<V, E> e1, Edge<V, E> e2) -> {
    return -weightManager.compare(e1.weight, e2.weight); // 默认堆是大根堆，所以取负
};
```

`Edge<V, E>`中添加方法，用于返回边的信息

```java
public EdgeInfo<V, E> info() {
    return new EdgeInfo<>(from.value, to.value, weight);
}
```

`prim`算法实现

```java
private Set<EdgeInfo<V, E>> prim() {

    // 先拿到起始节点
    Iterator<Vertex<V, E>> iterator = vertices.values().iterator();
    if (!iterator.hasNext()) return null;
    Vertex<V, E> vertex = iterator.next();
    Set<EdgeInfo<V, E>> edgeInfos = new HashSet<>(); // 最终要返回的边的信息
    Set<Vertex<V, E>> addedVertices = new HashSet<>(); // 已经添加的顶点
    addedVertices.add(vertex);

    // 将出度边集合转换为数组
    Edge<V, E>[] edges = collectionConversionArray(vertex.outEdges);
    BinaryHeap<Edge<V, E>> heap = new BinaryHeap<>(edges, edgeComparator);

    // 最小生成树的边的数量
    int edgeSize = verticesSize() - 1;
    while (!heap.isEmpty() && edgeInfos.size() < edgeSize) {
        Edge<V, E> edge = heap.remove();
        if (addedVertices.contains(edge.to)) continue; // 要访问的顶点必须未被加入到已访问的节点中

        // 将最小的边放入到边信息中
        edgeInfos.add(edge.info());
        addedVertices.add(edge.to);

        // 将to的出度放入到heap中
        for(Edge<V, E> to : edge.to.outEdges) {
            heap.add(to);
        }
    }

    return edgeInfos;
}
```

#### 6.2 Kruskal(加边法)

1. 按照边的权重(从小到大)将边加入到生成树中，直到生成树中含有`V-1`条边为止(V是顶点数量)

   如果加入该边会与生成树形成环，则不加入该边(从第三条边起，才可能会构成环)

2. 判断是否在同会构成环，使用[并查集](https://schrodingerseecat.github.io/algorithm/UnionFind.html)来判断

   如果一条边的起点和终点本身就在同一个集合内，若将这条边添加到最小生成树中一定会构成环

**具体实现**

```java
private Set<EdgeInfo<V, E>> kruskal() {
    if(verticesSize() == 0) return null; // 图中没有顶点
    Set<EdgeInfo<V, E>> edgeInfos = new HashSet<>();

    // 将所有边加入到小顶堆中
    BinaryHeap<Edge<V, E>> heap = new BinaryHeap<>(setConversionArray(edges), edgeComparator);

    // 创建并查集集合
    UnionFind<Vertex<V, E>> union = new UnionFind<>();
    vertices.forEach((V key, Vertex<V, E> value) -> {
        union.makeSet(value);
    });

    int edgeSize = verticesSize() - 1;
    while(!heap.isEmpty() && edgeInfos.size() < edgeSize) {
        Edge<V, E> edge = heap.remove();

        // 忽略会构成环的边
        if (union.isSame(edge.from, edge.to)) continue;

        edgeInfos.add(edge.info());
        union.union(edge.from, edge.to); // 将最小边的两个顶点放入到同一个集合中
    }

    return edgeInfos;
}
```

### 7. 最短路径

最短路径`Shortest Path`：指两顶点之间权值之和最小的路径(有向图、无向图均适用，不能有负权环)

> **有向图**

![image-20210417210724021](https://gitee.com/dingwanli/picture/raw/master/20210417210731.png)

> **无向图**

![image-20210417210821433](https://gitee.com/dingwanli/picture/raw/master/20210417210821.png)

> **最短路径算法**

1. 单源最短路径算法

   `Dijkstra`(迪杰斯特拉算法)

   `Bellman-Ford`(贝尔曼-福特算法)

2. 多源最短路径算法

   `Floyd`(弗洛伊德算法)

