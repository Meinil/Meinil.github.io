## 1. 线程概述

### 1.1 线程相关概念

#### 1.1.1 进程和线程

进程`Process`：是计算机中的程序关于某数据集合上的一次运行活动，是操作系统进行资源分配与调度的基本单位。

线程`Thread`：是进程的一个执行单元。一个线程就是进程中一个单一顺序的控制流，进程的一个执行分支。

进程是线程的容器，一个进程至少有一个线程，一个进程中也可以有多个线程

#### 1.1.2 主线程与子线程

主线程与子线程：`JVM`启动时会创建一个主线程，该主线程负责执行`main`方法，主线程就是运行`main`方法的线程。

`Java`中的线程不是孤立的，线程之间存在一些联系，如果`A`线程中创建了`B`线程，称`B`线程为`A`线程的子线程，相应的`A`线程就是`B`线程的父线程

#### 1.1.3 并发与并行

假设有三个任务，`A`、`B`、`C`

> **串行**

![](https://gitee.com/dingwanli/picture/raw/master/20210610161348.png)

串行`Sequential`，先做任务`A`，完成后再做任务`B`，完成`B`后在做任务`C`

> **并发**

![](https://gitee.com/dingwanli/picture/raw/master/20210610162038.png)

并发`Concurrent`，各任务交替执行，但同一时间只有一个任务在执行

> **并行**

![](https://gitee.com/dingwanli/picture/raw/master/20210610162431.png)

并行`Parallel`，三个任务同时开始，总耗时取决于需要时间最长的那个任务

### 1.2 线程的创建与启动

在`Java`中，创建一个线程就是创建一个`Thread`类(子类)的对象(实例)

`Thread`类有两个常用的构造方法：`Thread()`与`Thread(Runnable runnable)`，两种方法没有本质的区别

#### 1.2.1 继承Thread类

调用线程类的`start()`方法来启动线程，启动线程的实质就是请求`JVM`运行相应的线程，这个线程具体什么时候执行由线程调度器`Scheduler`决定(新开启的线程会执行`run`方法)

```java
public class ThreadTest {
    public static void main(String[] args) {
        System.out.println("主线程");

        Thread thread = new MyThread();
        thread.start(); // 启动线程
    }
}

class MyThread extends Thread{
    @Override
    public void run() {
        System.out.println("自定义的线程 继承Thread类");
    }
}
```

#### 1.2.2 实现Runnable接口

```java
public class ThreadTest {
    public static void main(String[] args) {
        System.out.println("主线程");

        Thread thread = new Thread(new MyThread());
        thread.start(); // 启动线程
    }
}

class MyThread implements Runnable{

    @Override
    public void run() {
        System.out.println("自定义的线程 实现Runnable接口");
    }
}
```

### 1.3 线程的常用方法

#### 1.3.1 currentThread

获取当前线程，`Java`中的任何一段代码都是执行在某个线程当中的，执行当前代码的线程就是当前线程

```java
Thread.currentThread();
```

同一段代码可能被不同的线程调用执行，因此当前线程是一个相对的概念

#### 1.3.2 setName()/getName()

`thread.setName()`设置线程名称

`thread.getName()`返回线程名称

通过设置线程名称，有助于程序调试和提高上程序的可读性

#### 1.3.3 isAlive

判断当前线程是否处于活动状态

```java
thread.isAlive()
```

活动状态就是线程已启动并且尚未终止

```java
public class ThreadTest {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("主线程");

        Thread thread = new MyThread();
        thread.start(); // 启动线程

        for (int i = 0; i < 10; i++) {
            Thread.sleep(1000);
            System.out.println(thread.isAlive());
        }
        thread.interrupt();
    }
}

class MyThread extends Thread{
    @Override
    public void run() {
        while (true) {
            try {
                Thread.sleep(1000);
                System.out.println("线程: " + getName() + " 正在执行");
            } catch (InterruptedException e) {
                break;
            }
        }
    }
}
```

#### 1.3.4 sleep

让当前线程休眠指定的毫秒数

```java
Thread.sleep(毫秒数);
```

#### 1.3.5 getId()

获取线程的唯一标识

```java
thread.getId();
```

#### 1.3.6 yield

放弃当前`CPU`的使用权，转让给其他线程

```java
thread.yield();
```

#### 1.3.7 setPriority

设置线程的优先级，`java`线程的优先级的取值范围为`1~10`，如果超出这个范围会抛出异常

```java
thread.setPriority(num);
```

线程优先级本质上只是给线程调度器一个提示信息，以便于调度器决定先调度哪些线程。注意并不能保证优先级高的线程先运行。如果优先级设置不当或者滥用可能会导致某些线程无法得到运行，即产生了**线程饥饿**

优先级不是越高越好，一般情况下默认即可

线程的优先级具有继承性，如果在`A`线程中创建了`B`线程，则`B`线程的优先级与`A`线程是一样的

#### 1.3.8 interrupt

中断线程，注意调用`interrupt()`方法仅仅是在当前线程打一个停止标志，并不是真正停止线程

```java
thread.interrupt();
```

```java
public class ThreadTest {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("主线程");

        Thread thread = new MyThread();
        thread.start(); // 启动线程

        for (int i = 0; i < 10; i++) {
            Thread.sleep(1000);
            System.out.println(thread.isAlive());
        }
        thread.interrupt();
    }
}

class MyThread extends Thread{
    @Override
    public void run() {
        while (true) {
            System.out.println("线程: " + getName() + " 正在执行");
            if (this.isInterrupted()) { // 判断是否有中断标志
                break;
            }
        }
    }
}
```

#### 1.3.9 setDaemon()

将当前线程设置守护线程，

```java
thread.setDaemon(boolean);
```

`java`中的线程分为用户线程和守护线程，守护线程是为其他线程提供服务的线程，如垃圾回收器`GC`就是一个典型的守护线程。

守护线程不能单独运行，当`JVM`中没有其他用户线程的时候，守护线程会自动退出

### 1.4 线程的生命周期

![](https://gitee.com/dingwanli/picture/raw/master/20210610200229.png)

线程的生命周期就是线程对象的生老病死，即线程的状态，线程的声明周期可以通过`getState()`方法获得

线程的状态是一个枚举类，定义在`Thread`内部

```java
public enum State {
    NEW,		
    RUNNABLE,		
    BLOCKED,
    WAITING,
    TIMED_WAITING,
    TERMINATED;
}
```

1. `NEW`新建状态，创建了线程对象，在调用start()启动之前的状态
2. `RUNNABLE`可运行状态，它是一个复合状态，包含READY和RUNNING两个状态。READY状态表示该线程可以被线程调度器进行调度，调度之后处于RUNNING状态，RUNNING表示该状态正在执行，Thread.yield()方法可以把线程由RUNNING状态转换为READY状态
3. `BLOCKED`阻塞状态，线程发起阻塞的`I/O`操作，或者申请由其他线程占用的独占资源，线程会转换为`BLOCKED`阻塞状态。处于阻塞状态的线程不会占用`CPU`资源。当阻塞的`I/O`操作执行完成后，或者线程获得了它申请的资源，现车给你可以转换为`RUNNABLE`
4. `WAITING`等待状态，线程执行了`Object.wait()`，`thread.join()`方法会吧线程转换为`WAITING`等待状态，执行`Object.notify()`方法，或者加入的线程执行完毕，当前线程会转换为`RUNNABLE`状态
5. `TIMED_WAITING`状态，与`WAITING`状态类似，都是等待状态。区别在于处在该状态的线程不会无限的等待，如果线程没有在指定的时间范围内完成期望的操作，该线程自动转换为`RUNNABLE`
6. `TERMINATED`线程结束处于终止状态

### 1.5 多线程编程的优势与存储的风险

多线程具有以下优势：

1. 提高系统的吞吐量`Throughout`，多线程编程可以使一个进程有多个并发(`concurrent`，即同时进行的)的操作
2. 提高响应性`Responsiveness`，`Web`服务器会采用一些专门的线程负责用户的请求处理，缩短了用户的等待时间
3. 充分利用多核`Multicore`处理器资源

风险：

1. 线程安全`Thread safe`问题，多线程共享数据时，如果没有采用正确的并发访问控制措施，就可能会产生数据一致性问题，如读脏读(过期的数据)，如丢失数据更新

2. 线程活性`thread liveness`问题，由于程序滋生的缺陷或者由资源稀缺性导致线程一直处于非`RUNNABLE`状态，这就是线程活性问题，常见的活性故障有以下几种

    死锁`Deadlock`：鹬蚌相争

    锁死`Lockout`：类似于睡美人故事中王子挂了

    活锁`Livelock`：类似于小猫咬自己的尾巴

    饥饿`Starvation`：类似于健壮的雏鸟总是从母鸟嘴中抢到的食物，弱小的小鸟抢不到食物

3. 上下文切换`Contenxt Switch`：处理器从执行一个线程切换在执行另外一个线程

4. 可靠性，可能会由一个线程导致`JVM`意外终止，其他的线程也无法执行

## 2. 线程安全问题

非线程安全主要是指多个线程对同一个对象的实例变量进行操作时，会出现值被更改，值不同步的情况

线程安全问题表现为三个方面：**原子性**，**可见性**和**有序性**

### 2.1 原子性

原子`Atomic`就是不可分割的意思，原子操作的不可分割有两层

1. 访问(读、写)某个共享变量的操作从其他线程来看，该操作要么已经执行完毕，要么尚未发生，即其他线程看不到当前操作的中间结果
2. 访问同一组共享变量的原子操作是不能够交错的

`Java`有两种方式实现原子性：一种是使用锁，另一种利用处理器的`CAS(Compare and Swap)`指令

1. 锁具有排他性，保证共享变量在某一时刻只能被一个线程访问。
2. `CAS`指令直接在硬件(处理器和内存)层次上实现，可以看作是硬件锁

### 2.2 可见性

在多线程环境中，一个线程对某个共享变量进行更新之后，后续其他的线程可能无法立即读到这个更新的结果，这就是线程安全问题的另一种形式：可见性`visibility`

如果一个线程对共享变量更新后，后续访问该变量的其他线程可以读到更新的结果，称这个线程给对共享变量的更新读其他线程可见，否则称这个线程对共享变量的更新对其他线程不可见

多线程程序因为可见性问题可能导致其他线程读取到了旧数据(脏数据)

### 2.3 有序性

有序性`Ordering`是指在什么情况下，一个处理器运行的一个线程所执行的内存访问操作在另一个处理器运行的其他线程看来是乱序的`Out of Order`

乱序是指内存访问操作的顺序看起来发生了变化

在多核处理器的环境下，编写的顺序结构，这种操作执行的顺序可能是没有保障的

1. 编译器可能会改变两个操作的先后顺序
2. 处理器也可能不会按照目标代码的顺序执行

与目标代码指定的顺序可能不一样，这种现象称为重排序。重排序是对内存访问有序操作的一种优化，可以在不影响单线程程序正确的情况下提升程序的性能。但是，可能对多线程程序的正确性产生影响，即可能导致线程安全问题

可以把重排序分为指令重排序两种

1. 指令重排序主要是由`JIT`编译器处理器引起的，指程序顺序与执行顺序不一样
2. 存储子系统重排序是由高速缓存，写缓冲器引起的

