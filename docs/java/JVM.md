---
title: JVM(一)
date: '2021-05-26'
sidebar: 'auto'
categories:
 - java
tags:
 - java
---

## 1. JVM与java体系

`JVM`是一个跨语言的平台，在`java7`的发布之后，`java`虚拟机的设计者们通过`JSR-292`规范基本实现在`java`虚拟机上运行非`java`语言编写的程序

```mermaid
graph TD
Kotlin --> C[编译器]
Clojure --> C
Groovy --> C
Scala --> C
Jython --> C
JRuby --> C
JavaScript --> C
C --> 字节码文件
字节码文件 --> java虚拟机
```

### 1.1 字节码

- 对于字节码的理解，任何能在`jvm`平台上执行的字节码格式都是一样的。所以应该统称为`jvm`字节码
- 不同的编译器，可以编译出相同的字节码文件，字节码文件也可以在不同的`JVM`上运行
- `java`虚拟机与`java`语言没有必然的联系，它只与特定的二进制文件格式——`Class`文件格式所关联，`class`文件中包含了`java`虚拟机指令集(或者称为字节码`Bytecodes`)和符号表，还有一些其它辅助信息

### 1.2 多语言混合编程

- `java`平台上，通过特定领域的语言去解决特定领域的问题是当前软件开发的一个趋势

- 某一个项目

  ```mermaid
  graph TD
  并行处理 --> Clojure
  展示层 --> JRuby/Rails
  中间层 --> Java
  ```

- 各种语言之间的交互不存在任何困难，就像使用自己语言的原生`API`一样，因为它们最终都运行在一个虚拟机上

- 对于运行在`java`虚拟机之上、`java`之外的语言，来自系统级、底层的支持正在迅速曾倩，以`JSR-292`为核心的一系列项目和功能改进

  ```
  Vinci Machine
  Nashorn
  InvokeDynamic
  java.lang.invoke
  ```


### 1.3 虚拟机

#### 1.3.1 虚拟机

- 所谓虚拟机`virtual machine`，就是一台虚拟的计算机，它是一款软件，用来执行一系列虚拟计算机指令。大体上，虚拟机可以分为系统虚拟机和程序虚拟机

  `virtual box`，`VMware`就属于系统虚拟机，它们完全是对物理计算机的仿真，提供了一个可运行完整操作系统的软件平台

  程序虚拟机的典型代表就是`java`虚拟机，它专门执行单个计算机程序而设计，在`java`虚拟机中执行的指令我们称为`java`字节码指令

- 无论是系统虚拟机还是程序虚拟机，在上面运行的软件都被限制于虚拟机提供的资源中

#### 1.3.2 java虚拟机

- `java`虚拟机是一台执行`java`字节码的虚拟计算机，它拥有独立的运行机制，其运行的`java`字节码也未必是`java`语言编译而成

- `JVM`平台的各种语言可以共享`java`虚拟机带来的跨平台性、优秀的垃圾回收器，以及可靠的即时编译器

- `java`技术的核心就是`java`虚拟机，因为所有的`java`程序都运行在`java`虚拟机内部

- `java`虚拟机就是二进制字节码的运行环境，负责装载字节码到其内部，解释/编译为对应平台上的机器指令执行。每一条`java`指令，`java`虚拟机规范都有详细定义

- 特点

  一次编译，到处运行

  自动内存管理

  自动垃圾回收机制

### 1.4 java整体结构

- `HotSpot VM`目前市面上高性能虚拟机的代表作之一
- 它采用解释起与即时编译器并存的架构

<img src="https://gitee.com/dingwanli/picture/raw/master/20210525163204.png" style="zoom:80%;" />

### 1.5 java代码执行流程

```mermaid
graph TD
java程序 --> |编译|A[字节码文件] --> |执行|windows_JVM
A --> |执行|Linux_JVM
A --> |执行|Mac_JVM
```

### 1.6 JVM架构模型

`java`编译器输入的指令流基本上是一种基于栈的指令集架构，另外一种指令集架构则是基于寄存器的指令集架构

具体来说：这两种架构之间的区别

#### 1.6.1 基于栈式架构

- 设计和实现更简单，适用于资源受限的系统
- 避开了寄存器的分配难题：使用零地址指令方式分配
- 指令流中的大部分是零地址指令，其执行过程依赖于操作栈。指令集更小，编译器容易实现
- 不需要硬件支持，可移植性好，更好实现跨平台

#### 1.6.2 基于寄存器架构

- 典型的应用是`x86`的二进制指令集：比如传统的`PC`以及`Android`的`Davlik`虚拟机
- 指令集架构则完全依赖硬件，可移植性差
- 性能优秀和执行高效
- 花费更少的指令完成一项操作
- 在大部分情况下，基于寄存器架构的指令集往往都以一地址指令、二地址指令和三地址指令为主，而基于栈式架构的指令集都是以零地址指令为主

#### 1.6.3 总结

由于跨平台性的设计，`Java`的指令都是根据栈来设计的。

### 1.7 JVM的生命周期

**虚拟机的启动**

`Java`虚拟机的启动是通过引导类加载器`bootstrap class loader`创建一个初始类`initial class` 来完成的，这个类是由虚拟机的具体实现指定的

**虚拟机的运行**

- 一个运行中的`JaVA`虚拟机有着一个清晰的任务：执行`java`程序
- 程序开始执行时它才运行，程序结束时它就停止
- 执行一个所谓的`Java`程序的时候，真真正正在执行的是一个叫做`Java`虚拟机的进程

**虚拟机的退出**

- 程序正常执行结束
- 程序在执行过程中遇到了异常或者错误而异常终止
- 由于操作系统出现错误而导致`Java`虚拟机进程终止
- 某线程调用`Runtime`类或`System`类的`exit`方法，或`Runtime`类的`Halt`方法，并且`Java`安全管理器也允许这次`exit`或`halt`操作
- 除此之外，`JNI(Java Native Interface)`规范描述了用`JNI Invocation API`来加载或卸载`Java`虚拟机时，`Java`虚拟机的退出情况

## 2. 类加载子系统

### 2.1 类加载的过程

<img src="D:\code\笔记\java\JVM.assets\image-20201123182326389.png" alt="image-20201123182326389" style="zoom:80%;" />

- 类加载子系统负责从文件系统或者网络中加载`Class`文件，`class`文件在文件开头有特定的文件标识
- `ClassLoader`只负责`calss`文件的加载，至于它是否可以运行，则由`Execution Engine`决定
- 加载的类信息存放于一块称为方法区的内存空间。除了类的信息外，方法区中还会存放运行时常量池信息，可能还包括字符串字面量和数字常量(这部分常量信息是`Class`文件中常量池部分的内存映射)

```mermaid
graph LR
A(加载Loading) --> B(验证Verification) --> C(准备Preparation) --> D(解析Resolution) --> E(初始化Initialization)
```

#### 2.1.1 加载

1. 通过一个类的全限定名获取定义此类的二进制字节流
2. 将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构
3. 在内存中生成一个代表这个类的`java.lang.Class`对象，作为方法区这个类的各种数据的访问入口

> **加载字节码文件的方式**

1. 从本地系统中直接加载
2. 通过网络获取`Web Applet`
3. 从压缩包中读取`zip`、`jar`、`war`
4. 运行时计算生成，动态代理技术
5. 由其他文件生成，典型场景：`JSP`应用
6. 从专有数据库中提取`.class`文件
7. 从加密文件中获取，典型的防`Class`文件被反编译的保护措施

#### 2.1.2 链接

链接包括

```mermaid
graph TD
B(验证Verification) --> C(准备Preparation) --> D(解析Resolution)
```

- 验证`Verify`

  目的在于确保`Class`文件的字节流中包含信息符合当前虚拟机的要求，保证加载类的正确性，不会危害虚拟机自身安全

  主要包括四种验证，文件格式验证，元数据验证，字节码验证，符号引用验证

- 准备`Prepare`

  为类变量分配内存并且设置该类的默认初始值，即零值

  这里包括含用`final`修饰的`static`，因为`final`在编译的时候就会分配了，准备阶段会显式初始化

  这里不会为实例变量分配初始化，类变量会分配在方法区中，而实例变量会随着对象一起分配到`java`堆中

- 解析`Resolve`

  将常量池内的符号引用转换为直接引用的过程

  事实上，解析操作往往会伴随着`JVM`在执行完初始化之后再执行

  符号引用就是一组符号来描述所引用的目标，符号引用的字面量形式明确定义在`Java`虚拟机规范的`Class`文件格式中，直接引用就是目标的指针、相对偏移量或一个间接定位到目标的句柄

  解析动作主要针对类或接口、字段、类方法、接口方法、方法类型等。对应常量池中的`CONSTANT_Class_info`、`CONSTANT_Fieldref_info`、`CONSTANT_Methodref_info`等

#### 2.1.3 初始化

- 初始化阶段就是执行类构造器方法`<clinit>()`的过程
- 此方法不需定义，是`javac`编译器自动收集类中的所有类变量的赋值动作和静态代码块中的语句合并而来
- 构造器方法中指令按语句在源文件中出现的顺序执行
- `<clinit>()`不同于类的构造器。(关联：构造器是虚拟机视角下的`<init>()`)
- 若该类具有父类，`JVM`会保证子类的`<clinit>()`执行前，父类的`<clinit>()`已执行完毕
- 虚拟机必须保证一个类的`<clinit>()`方法在多线程下被同步加锁

### 2.2 类加载器

- `JVM`支持两种类型的类加载器，分别是引导类加载器`Bootstrap ClassLoader`和自定义类加载器`User-Defined ClassLoader`
- 从概念上来讲，自定义类加载器一般指的是程序中由开发人员自定义的一类类加载器，但是`java`虚拟机规范却没有这么定义，而是将所有派生于抽象类`ClassLoader`的类加载器都划分为自定义类加载器
- 无论类加载器的类型如何划分，在程序中我们最常见的类加载器始终只有3个

```mermaid
graph TD
A[Bootstrap ClassLoader] --> B[Extension Class Loader] --> C[System Class Loader] --> D[User Define Class Loader] --> E[User Defined Class Loader] --> |...|I[....]
C --> F[User Defined Class Loader] -->G[User Defined Class Loader] --> |...|H[....]
```

四者的关系不是继承而是包含

```java
public class ClassLoaderTest {
    @Test
    public void test() {
        // 获取系统类加载器
        ClassLoader systemClassLoader = ClassLoader.getSystemClassLoader();
        System.out.println(systemClassLoader); // jdk.internal.loader.ClassLoaders$AppClassLoader@2437c6dc

        // 获取系统类加载器的上层，扩展类加载器
        ClassLoader extClassLoader = systemClassLoader.getParent();
        System.out.println(extClassLoader); // jdk.internal.loader.ClassLoaders$PlatformClassLoader@7c30a502

        // 获取扩展类加载器的上层，引导类加载器
        ClassLoader bootstrapClassLoader = extClassLoader.getParent();
        System.out.println(bootstrapClassLoader); // null

        // 对于用户自定义类来说，默认使用系统类加载器进行加载
        ClassLoader classLoader = ClassLoaderTest.class.getClassLoader();
        System.out.println(classLoader); // jdk.internal.loader.ClassLoaders$AppClassLoader@2437c6dc
    }
}
```

`Java`的核心类库都是使用引导类加载器进行加载的

#### 2.2.1 虚拟机再带的加载器

> **启动类加载器**

启动类加载器(引导类加载器，Bootstrap ClassLoader)

1. 这个类加载器是使用`C/C++`实现，嵌套在`JVM`内部
2. 并不是继承自`java.lang.ClassLoader`，没有父加载器
3. 是加载扩展类和应用程序的类加载器，并指定为他们的父类加载器
4. 处于安全的考虑，`Bootstrap`启动类只加载包名为`java`、`javax`、`sun`等开头的类

> **扩展类加载器**

扩展类加载器(Extension ClassLoader)

1. `Java`语言编写，由`sun.misc.Lanucher$ExClassLoader`实现
2. 派生于`ClassLoader`类，父类加载器为启动类加载器
3. 从`java.ext.dirs`系统属性所指定的目录中加载类库，或从`JDK`的安装目录的`jre/lib/ext`子目录下加载类库。如果用户创建的`JAR`放在此目录下，也会自动由扩展类加载器加载

> **应用程序类加载器**

1. `java`语言编写，由`sun.misc.Launcher$AppClassLoader`实现
2. 派生于`ClassLoader`类，父类加载器为扩展类加载器
3. 它负责加载环境变量`classpath`或系统属性`java.class.path`指定路径下的类库
4. 该类加载是程序中默认的类加载器，一般来说，`Java`应用的类都是由它来完成加载
5. 通过`ClassLoader.getSystemClassLoader()`方法可以获取到该类加载器

#### 2.2.2 用户自定义的加载器

大部分场景下，类的加载是由上述的三种类加载器相互配合执行，在一些特殊的场景下，可以自定义类加载器来定制类的加载方式

1. 隔离加载类
2. 修改类加载的方式
3. 扩展加载源
4. 防止源码泄露

自定义类加载器步骤

1. 开发人员可以通过继承抽象类`java.lang.ClassLoader`类的方式，实现自己的类加载器，一满足一些特殊的需求
2. 继承`ClassLoader`类名重写`findClass()方法`
3. 在编写自定义类加载器时，如果没有太过于复杂的需求，可以直接继承`URLClassLoader`类，这样就可以避免自己去编写`findClass()`方法及其获取字节码流的方式，使自定义类加载器编写更加简洁

#### 2.2.3 ClassLoader

`ClassLoader`类，它是一个抽象类，其后所有类加载器都继承自`ClassLoader`(不包括启动类加载器)

| 方法名称                                             | 描述                                                         |
| ---------------------------------------------------- | ------------------------------------------------------------ |
| getParent()                                          | 返回该类加载器的超类加载器                                   |
| loadClass(String name)                               | 加载名称为name的类，返回结果java.lang.Class类的实例          |
| findClass(String name)                               | 查找名称为name的类，返回结果java.lang.Class类的实例          |
| findLoadedClass(String name)                         | 查找名称为name且已经被加载过的类，返回结果java.lang.Class的实例 |
| defineClass(String name, byte[] b, int off, int len) | 把字节数组b中的内容转换为一个java类，返回结果为java.lang.Class的实例 |
| resolveClass(Class<?> c)                             | 连接指定的一个java类                                         |

```mermaid
classDiagram
class ClassLoader{
	<<abstract>>
	+loadClass(String)
	+resolveClass(Class<?>)
	+findClass(String)
	+defineClass(byte[], int, int)
}
class SecureClassLoader {
	
}
class URLClassLoader {
	
}
class ExtClassLoader {
	
}
class AppClassLoader {
	
}
ClassLoader <|-- SecureClassLoader
SecureClassLoader <|-- URLClassLoader
URLClassLoader <|-- ExtClassLoader
URLClassLoader <|-- AppClassLoader
```

### 2.3 双亲委派机制

`Java`虚拟机对`class`文件采用的是按需加载的方式，也就是说当需要使用该类时才会将它的`class`文件加载到内存生成`class`对象。而且加载某个类的`class`文件时，`Java`虚拟机采用的是双亲委派模式，即把请求交由父类处理，它是一种任务委派模式

#### 2.3.1 工作原理

<img src="https://gitee.com/dingwanli/picture/raw/master/20210527215556.png" style="zoom:60%;" />

1. 如果一个类加载器收到了类加载请求，它并不会自己先去加载，而是把这个请求委托给父类的加载器去执行
2. 如果父类加载器还存在其父类加载器，则进一步向上委托，依次递归，请求最终到达顶层的启动类加载器
3. 如果父类加载器可以完成类加载器任务，就成功返回，倘若父类加载器无法完成此加载任务，子加载器才会尝试自己去加载，这就是双亲委派模式

#### 2.3.2 双亲委派的优点

1. 避免类的重复加载

2. 保护程序安全，防止核心`API`被随意篡改

3. 沙箱安全机制

   如自定义`String`类，但是在加载自定义`String`类的时候会率先使用引导类加载器加载，而引导类加载器在加载的过程中会先加载`JDK`自己的包，所以就会忽略自定义的类。这样可以保证对`java`核心源代码的保护

### 2.4 其它

> 在`JVM`中表示两个`class`对象是否为同一个类的两个必要条件

1. 类的完整类名必须一致(含包名)
2. 加载这个类的`ClassLoader`必须相同

> **对类加载器的引用**

`JVM`必须知道一个类是由启动类加载器加载的还是用户自定义的类加载器加载的。如果一个类是由用户类加载器加载的，那么`JVM`会将这个类加载器的一个引用作为类型信息的一部分保存在方法区中。当解析一个类型到另一个类型的饮用个的时候，`JVM`需要保证这两个类型的类加载器是相同的

> **主动使用和被动使用**

**主动使用**

1. 创建类的实例

2. 访问某个类或接口的静态变量，或者对该静态变量赋值

3. 调用类的静态方法

4. 反射(Class.forName("xxxx"))

5. 初始化一个类的子类

6. `Java`虚拟机启动时被标明为启动类的类

7. `JDK7`开始提供的动态语言的支持

   `java.lang.invoke.MethodHandle`实例的解析结果

   `REF_getStatic`、`REF_putStatic`、`REF_invokeStatic`句柄对应的类没有初始化则初始化

**被动使用**

除了以上七种情况，其他使用`Java`类的方式都被看作是对类的被动使用，都不会导致类的初始化

## 3. 运行时数据区

<img src="https://gitee.com/dingwanli/picture/raw/master/20210526143644.png" style="zoom:80%;" />

内存是非常重要的系统资源，是硬盘和`CPU`的中间仓库及桥梁，承载着操作系统和应用程序的事实运行。`JVM`内存布局规定了`Java`在运行过程中内存申请、分配、管理的策略，保证了`JVM`的高效稳定运行。不同的`JVM`对于内存的划分方式和管理机制存在着差异

<img src="https://gitee.com/dingwanli/picture/raw/master/20210526144441.png" style="zoom:80%;" />

`Java`虚拟机定义了若干种程序运行期间会使用到的运行时数据区，其中有一些会随着虚拟机的启动而创建，随着虚拟机的退出而销毁。另外一些则是与线程一一对应的，这些与线程对应的数据区域会随着线程开始和结束而创建和销毁，比如第一幅图，红色的代表多个线程共享，灰色的代表单独线程私有

### 3.1 线程

1. 线程是一个程序里的运行单元。`JVM`允许一个应用有多个线程并行的执行
2. 在`Hostspot JVM`里，每个线程都与操作系统的本地线程直接映射。当一个`Java`想成准备好执行以后，此时一个操作系统的 本地线程也同时创建。`Java`线程执行终止后，本地线程也会回收
3. 操作系统负责所有线程的安排调度到任何一个可用的`CPU`上。一旦本地线程初始化成功后，它就会调用`Java`线程中的`run()`方法

使用调试工具，能够在后台看到有许多线程在运行，这些后台不包括调用`public static void main(String[] args)`的`main`线程以及所有这个`main`线程自己创建的线程

1. 虚拟机线程：这种线程的操作都是需要`JVM`达到安全点才会出现。这些操作必须在不同的线程中发生的原因是他们都需要`JVM`达到安全点，这样堆才不会变化。这种线程的执行类型包括`stop-the-world`的垃圾收集，线程栈收集，线程挂起以及偏向锁撤销
2. 周期任务线程：这种线程是时间周期事件的体现(比如中断)，他们一般用于周期性操作的调度执行
3. `GC`线程：这种线程对`JVM`里不同种类的垃圾收集行为提供了支持
4. 编译线程：这种线程在运行时会将字节码编译成本地代码
5. 信号调度线程：这种线程接受信号并发送给`JVM`，在它内部通过调用适当的方法进行处理

### 3.2 程序计数器

#### 3.2.1 基本介绍

`JVM`中的程序计数寄存器`Program Counter Register`中，`Register`的命名源于`CPU`的寄存器，寄存器存储指令相关的现场信息。`CPU`只有把数据装载到寄存器才能够运行

> **注意**

这里并非广义上的物理寄存器，`JVM`中的`PC`寄存器是对物理`PC`寄存器的一种抽象模拟。`PC`寄存器用来存储指向下一条指令的地址，也就是即将要执行的指令代码。由执行引擎读取下一条指令

<img src="https://gitee.com/dingwanli/picture/raw/master/20210526193010.png" style="zoom:50%;" />

1. 它是一块很小的内存空间，几乎可以忽略不计。也是运行速度最快的存储区域
2. 在`JVM`规范中，每个线程都有它自己的程序计数器，是线程私有的，生命周期与线程的生命周期保持一致
3. 任何时间一个线程都只有一个方法在执行，也就是所谓的当前方法。程序计数器会存储当前正在执行的`JVM`指令地址。特别地，如果是在执行`navtive`方法，则是未指定值`undefined`
4. 它是程序控制流的指示器，分支、循环、跳转、异常处理、线程恢复等基础功能都需要依赖这个计数器来完成
5. 字节码解释器工作时就是通过改变这个计数器的值来选取下一条需要执行的字节码指令
6. 它是唯一一个在`Java`虚拟机规范中没有规定任何`OutOtMemoryError`情况的区域

#### 3.2.2 实例

```java
public class Main {
    public static void main(String[] args) {
        int i = 10;
        int j = 20;
        int k = i + j;
    }
}
```

```
 0: bipush        10
 2: istore_1
 3: bipush        20
 5: istore_2
 6: iload_1
 7: iload_2
 8: iadd
 9: istore_3
 10: return
```

#### 3.2.3 常见问题

1. 使用`PC`寄存器存储字节码指令地址有什么用？

   因为`CPU`需要不停的切换各个线程，这时候切换回来以后，就需要知道接着从哪开始继续执行

   `JVM`的字节码解释器就需要通过改变`PC`寄存器的值来明确下一条应该执行什么样的字节码指令

2. `PC`寄存器为什么被设定为线程私有的?

   我们都知道所谓的多线程在一个特定的时间段内只会执行其中某一个线程的方法，`CPU`会不停地做任务切换，这样必然导致经常中断或者恢复。为了能够准确地记录各个线程正在执行的当前字节码指令地址，最好的办法就是为每一个线程都分配一个`PC`寄存器，这样依赖各个线程之间便可以进行独立计算，而不会出现相互干扰的情况

   由于`CPU`时间片轮限制，众多线程在并发执行过程中，任何一个确定的时刻，一个处理器或者多核处理器中的一个内核，只会执行某个线程中的一条指令。这样必然导致经常中断或恢复，所以每个线程在创建后，都会产生自己的程序计数器和栈帧，程序计数器在各个线程之间互不影响

## 4. 虚拟机栈

由于跨平台性的设计，`Java`的指令都是根据栈来设计的。不同平台`CPU`架构不同，所以不能设计为基于寄存器的

优点：跨平台，指令集小，编译器容易实现，缺点是性能下降，实现同样的功能需要执行更多的指令

### 4.1 基本介绍

> **java虚拟栈**

`Java`虚拟机栈`Java Virtual Machine Stack`，早期也叫`Java`栈。每个线程在创建时都会创建一个虚拟机栈(即线程私有)，其内部保存一个个的栈帧`Stack Frame`，对应着一次次的`Java`方法调用。

> **生命周期**

生命周期和线程一致

> **作用**

主管`Java`程序的运行，它保存方法的局部变量、部分结果，并参与方法的调用和返回

> **优点**

1. 栈是一种快速有效的分配存储方式，访问速度仅次于程序计数器

2. `JVM`直接对`Java`栈的操作只有两个：

   每个方法执行，伴随着进栈(入栈、压栈)

   执行结束后的出栈工作

3. 不存在垃圾回收问题

<img src="https://gitee.com/dingwanli/picture/raw/master/20210526203440.png" style="zoom:60%;" />

> **栈溢出**

`Java`虚拟机规范允许`Java`栈的大小是动态的或者是固定不变的

1. 如果采用固定大小的`Java`虚拟机栈，那每一个线程的`Java`虚拟机栈容量可以在线程创建的时候独立选定。如果线程请求分配的栈容量超过`Java`虚拟机栈允许的最大容量，`Java`虚拟机唱会抛出一个`StackOverflowError`异常
2. 如果`Java`虚拟机栈可以动态扩展，并且在尝试扩展的时候无法申请到足够的内存，或者在创建新的线程时没有足够的内存去创建对应的虚拟机栈，那`Java`虚拟机将会抛出一个`OutOfMemoryError`异常

> **设置栈的大小**

可以使用参数-Xss选项来设置线程的最大栈空间，栈的大小直接决定了函数调用的最大可达深度

```
-Xss256K // KB
-Xss256M // MB
-Xss256G // GB
```

### 4.2 栈的存储单位

1. 每个线程都有自己的栈，栈中的数据都是以栈帧`Stack Frame`的格式存在
2. 在这个线程上正在执行的每个方法都各自对应一个栈帧`Stack Frame`
3. 栈帧是一个内存区块，是一个数据集，维系着方法执行过程中的各种数据信息
4. 在一条活动线程中，一个时间点上，只会有一个活动的栈帧。即只有当前正在执行的方法的栈帧。即只有当前正在执行的方法的栈帧(栈顶栈帧)是有效的，这个栈帧被称为当前栈帧`Current Frame`，与当前栈帧相对应的方法就是当前方法`Current Method`，定义这个方法的类就是当前类`Current Class`
5. 执行引擎运行的所有字节码指令只针对当前栈帧进行操作
6. 如果改方法中调用了其他方法，对应的新的栈帧会被创建出来，放在栈的顶端，成为新的当前帧

> **运行原理**

1. 不同线程中所包含的栈帧是不允许存在相互引用的，即不可能在一个栈帧中引用另外一个线程的栈帧
2. 如果当前方法调用了其他方法，方法返回之际，当前栈帧会传回此方法的执行结果给前一个栈帧，接着，虚拟机栈会丢弃当前栈帧，使得前一个栈帧重新称为当前栈帧
3. `Java`方法有两种返回函数的方式，一种是正常的函数返回，使用`return`指令，另外一种抛出异常。不管使用哪种方式，都会导致栈帧被弹出

### 4.3 栈帧的内部结构

1. 局部变量表`Local Variables`
2. 操作数栈`Operand Stack`(表达式栈)
3. 动态链接`Dynamic Linking`(或指向运行时常量池的方法引用)
4. 方法返回地址`Return Address`(或方法正常退出或者异常退出的定义)
5. 一些附加信息`可选`

<img src="https://gitee.com/dingwanli/picture/raw/master/20210527125045.png" style="zoom:60%;" />

#### 4.3.1 局部变量表

1. 局部变量表也称为局部变量数组或本地变量表
2. 定义为一个数字数组，主要用于存储方法参数和定义在方法体内的局部变量，这些数据类型、对象引用`reference`，以及`returnAddress`类型
3. 由于局部变量表是建立在线程的栈上，是线程的私有数据，因此不存在数据安全问题
4. 局部变量表所需的容量大小是编译期确定下来的，并保存在方法的`Code`属性的`maximum local variables`数据项中。在方法运行期间是不会改变局部变量表的大小的

> **slot**

**简介**

1. 参数值的存放总是在局部变量数组的`index0`开始，到数组长度`-1`的索引结束

2. 局部变量表，最基本的存储单元是`slot`

3. 局部变量表种存放编译期可知的各种基本数据类型，引用类型`reference`，`returnAddress`类型的变量

4. 在局部变量表里，32位以内的类型只占一个`slot`(包括`returnAddress`类型)，64位的类型(long和double)占用两个`slot`。

   `byte`、`short`、`char`在存储前被转换为`int`、`boolean`也被转换为`int`，0表示`false`，非零表示`true`

   `long`和`double`则占据两个`slot`

**理解**

1. `JVM`会为局部变量表中的每一个`slot`都分配一个访问索引，通过这个索引即可成功访问到局部变量表中指定的局部变量值
2. 当一个实例方法被调用的时候，它的方法参数和方法体内部定义的局部变量将会按照顺序被复制到局部变量表中的每一个`slot`上
3. 如果需要访问局部变量表中一个`64bit`的局部变量值时，只需要使用前一个索引即可
4. 如果当前帧是由构造方法或者实例方法创建的，那么该对象引用`this`会存放在`index`为`0`的`slot`处，其余的参数按照参数表顺序继续排列

```java
public class StackTest {
    public static void main(String[] args) {
        new StackTest().test(new Date(), "测试");
    }

    public void test(Date data, String name) {
        int a = 10;
        double b = 20.0;
        char c = 'c';
    }
}
```

查看`test`方法的局部变量表

<img src="https://gitee.com/dingwanli/picture/raw/master/20210527094023.png" style="zoom:80%;" />

**注意**：栈帧中的局部变量表中的槽位是可以重用的，如果一个局部变量过了其作用域，那么在其作用域之后申明的新的局部变量就很有可能会复用过期的局部变量的槽位，从而达到节省资源的目的

> **注意**

在栈帧中，与性能调优关系最为密切的部分就是前面提到的局部变量表。在方法执行时，虚拟机使用局部变量表完成方法的传递

局部变量表中的变量也是重要的垃圾回收根节点，只要被局部变量表中直接或间接引用的对象都不会被回收

#### 4.3.2 操作数栈

> **基本介绍**

1. 每一个独立的栈帧中除了包含局部变量表以外，还包含一个后进先出的操作数栈买也可以称为表达式栈`Expression Stack`

2. 操作数栈，在方法执行过程中，根据字节码指，往栈中国年写入数据或提取数据，即入栈`push`出栈`pop`

   某些字节码指令将值压入操作数栈，其余的字节码指令将操作数取出栈。使用它们后再把结果压入栈

   比如：执行复制、交换、求和等操作

3. 操作数栈，主要用于保存计算过程的中间结果，同时作为计算机过程中变量临时的存储空间

4. 操作数栈就是`JVM`执行引擎的一个工作区，当一个方法刚开始执行的时候，一个新的栈帧也会随之被创建出来，这个方法的操作数栈是空的

5. 每一个操作数栈都会拥有一个明确的栈深度用于存储数值，其所需的最大深度在编译期就定义好了，保存在方法的`Code`属性中，为`max_stack`的值

6. 栈中的任何一个元素都是可以任意的`Java`数据类型

   `32bit`的类型占用一个栈单位深度

   `64bit`的类型占用两个栈单位深度

7. 操作数栈并非采用访问索引的方式来进行数据访问的，而是只能通过标准的入栈`push`和出栈`pop`来完成一次数据访问

8. 如果被调用的方法带有返回值的话，其返回值将会被压入当前栈帧的操作数栈中，并更新`PC`寄存器中下一条需要执行的字节码指令

9. 操作数栈中元素的数据类型必须与字节码指令的序列严格匹配，这由编译器在编译器期间进行验证，同时在类加载过程中的类检验阶段的数据流分析阶段再次验证

10. `Java`虚拟机的解释引擎是基于栈的执行引擎，其中的栈指的就是**操作数栈**

> **案例演示**

```java
public class OperationTest {
    public void test() {
        int a = 0;
        int b = 1;
        int k = a + b;
    }
}
```

字节码

```class
0 iconst_0
1 istore_1
2 iconst_1
3 istore_2
4 iload_1
5 iload_2
6 iadd
7 istore_3
8 return
```

#### 4.3.3 栈顶缓存

由于操作数是存储在内存中的，因此频繁地执行内存读/写操作必然会影响执行速度。为了解决这个问题，`HotSpot JVM`的设计者们提出了栈顶缓存`Top-of-Stack Cashing`技术，将栈顶元素全部缓存在物理`CPU`的寄存器中，以此降低对内存的读/写次数，提升执行引擎的执行效率

#### 4.3.4 动态链接

1. 每一个栈帧内部都包含一个**指向运行时常量池中该帧所属方法的引用**。包含这个引用的目的就是为了当前方法的代码能够实现动态链接`Dynamic Linking`。比如：`invokedynamic`指令

2. 在`Java`源文件被编译到字节码文件中时，所有的变量和方法引用都作为符号引用`Symbolic Reference`保存在`class`文件的常量池里。比如：描述一个方法调用了另外的其他方法时，就是通过常量池中指向方法的符号引用来表示的，那么动态链接的作用就是为了将这些符号引用转换为调用方法的直接引用

3. 为什么需要常量池？

   常量池的作用，就是为了提供一些符号和常量，便于指令的识别

#### 4.3.5 方法调用

在`JVM`中，将符号引用转换为调用方法的直接引用与方法的绑定机制相关

> **链接方式**

**静态链接**：当一个字节码文件被装载进`JVM`内部时，如果被调用的目标方法在编译期可知，且运行期保持不变时。这种情况下将调用方法的符号引用转换为直接引用的过程称之为静态链接

**动态链接**：如果被调用的方法在编译期无法确定下来，也就是说，只能能够程序运行期将调用方法的符号引用转换为直接引用，由于这种引用转换过程具备动态性，因此也就称之为动态链接

> **绑定机制**

对应的方法绑定机制：早期绑定和晚期绑定。绑定是一个字段、方法或者类在符号引用被替换为直接引用的过程，这仅仅发生一次

**早期绑定**：指被调用的目标方法如果在编译期可知，且运行期保持不变时，即可将这个方法与所属的类型进行绑定，这样一来，由于明确了被调用的目标方法究竟是哪一个，因此也就可以使用静态链接的方式将符号引用替换为直接引用

**晚期绑定**：如果被调用的方法在编译期无法被确定下来，只能够在程序运行期根据实际的类型绑定相关的方法，珍重绑定方式就称为晚期绑定

```java
public class HuntableTest {
    public void test(Huntable huntable) {
        huntable.hunt(); // 晚期绑定
    }
}


class Dog implements Huntable {
    @Override
    public void hunt() {
        System.out.println("狗吃骨头");
    }
}
class Cat implements Huntable {

    @Override
    public void hunt() {
        System.out.println("猫吃鱼");
    }
}


interface Huntable{
    void hunt();
}
```

> **虚方法与非虚方法**

**非虚方法**：如果方法在编译期就确定了具体的调用版本，这个版本在运行时是不可变的。这样的方法被称为非虚方法

静态方法、私有方法、`final`方法、实例构造器、父类方法都是非虚方法

> **方法调用指令**

虚拟机中提供了以下几条方法调用指令

1. 普通调用指令

   ```
   invokestatic	# 调用静态方法，解析阶段确定唯一方法版本
   invokespecial	# 调用<init>方法、私有及父类方法，解析阶段确定唯一方法版本
   invokeVirtual	# 调用所有虚方法
   invokeinterface # 调用接口方法
   ```

2. 动态调用指令

   ```
   invokedynamic	# 动态解析出需要调用的方法，然后执行
   ```

   前四条指令固化在虚拟机内部，方法的调用执行不可人为干涉，而`invokedynamic`指令则支持由用户确定方法版本。其中`invokestatic`指令和`invokespecial`指令调用的方法称为非虚方法，其余的(`final`修饰的除外)称为虚方法

   `invokedynamic`指令是`Java7`中出现的指令，这是`Java`为了实现动态类型语言支持而做的一种改进。但是`Java7`中并没有提供直接生成`invokeddynamic`指令的方法，需要借助`ASM`这种底层字节码工具来产生`invokeddynamic`指令。直到`Java8`的`Lambda`表达式的出现，`invokedymic`指令的生成，在`Java`中才有了直接的生成方式

示例

```java
public class Father {
    public Father() {
        System.out.println("father的构造器");
    }

    public static void staticTest(String str) {
        System.out.println("father " + str);
    }

    public final void finalTest() {
        System.out.println("father final方法");
    }

    public void generalTest() {
        System.out.println("father 普通方法");
    }
}

class Son extends Father{
    public Son() {
        super(); // invokespecial
    }

    // 不是重写的静态方法,因为静态方法不能被重写
    public static void staticTest(String str) {
        System.out.println("son " + str);
    }

    private void privateTest() {
        System.out.println("son 私有方法");
    }

    public void show() {
        // invokestatic
        staticTest("good");
        // invokestatic
        super.staticTest("hello");
        // invokevirtual
        privateTest();
        // invokespecial
        super.generalTest();
        // invokevirtual
        finalTest();
        // invokevirtual
        generalTest();
    }

    public void generalTest() {
        System.out.println("son 普通方法");
    }
}
```

> **方法重写的本质**

1. 找到操作数栈顶的第一个元素所执行的对象的实际类型，记作`C`
2. 如果类型`C`中找到与常量中的描述符合简单名称都相符的方法，则进行访问权限校验，如果通过则返回这个方法的直接引用，查找过程结束；如果不通过则返回`java.lang.IllegalAccessError`异常
3. 否则按照继承关系从下往上依次对`C`的各个父类进行第2步的搜索和验证过程
4. 如果始终没有找到合适的方法，则抛出`java.lang.AbstractMethodError`异常

> **虚方法表**

1. 在面向对象的编程中，会很频繁的使用到动态分配，如果每次动态分配的过程中都要重新在类的方法元数据中搜索合适的目标的话可能影响到执行效率。因此，为了提高性能，`JVM`采用在类的方法区建立一个虚方法表`virtual method table`(非虚方法不会出现在表中)来实现，使用索引表来代替查找
2. 每个类中都有一个虚方法表，表中存放着各个方法的实际入口
3. 创建时机：虚方法表会在类加载的链接阶段被创建并开始初始化，类的变量初始值准备完成之后，`JVM`会把该类的方法表也初始化完毕

<img src="https://gitee.com/dingwanli/picture/raw/master/20210527201731.png" style="zoom:60%;" />

#### 4.3.6 方法返回地址

方法返回地址、动态链接地址和一些附加信息又被称为**栈数据区**

1. 存放调用该方法的`PC`寄存器的值

2. 一个方法的结束，有两种方式

   正常执行完成

   出现未处理的异常，非正常退出

3. 无论通过哪种方式退出，在方法退出后都返回到该方法被调用的位置。方法正常退出时，调用者的`PC`计数器的值作为返回地址，即调用该方法的指令的下一条指令的地址。而通过异常退出的，返回地址是要通过异常表来确定，栈帧中一般不会保存这部分信息

4. 一个方法在正常调用完成之后究竟需要使用哪一个返回指令还需要根据方法返回值的实际数据类型而定

5. 在字节码指令中，返回指令包含`ireturn`(当返回值是`boolean`、`byte`、`char`、`short`和`int`类型时使用)、`lreturn`、`freturn`、`dreturn`以及`areturn`，另外还有一个`return`指令提供声明为`void`的方法、实例初始化方法、类和接口的初始化方法使用

6. 在方法执行的过程中国年遇到了异常`Exception`，并且这个异常没有在方法内进行处理，也就是只要在本方法的异常表中没有搜索到匹配的异常处理器，就会导致方法退出。简称异常完成出口

   方法执行过程中抛出异常时的异常处理，存储一个异常处理表，方便在发生异常的时候找到处理异常的代码

```java
public class ReturnAddressTest {	// 3
    public void methodA() {			// 4
        try {						// 5
            int i = 1 / 0;			// 6
        } catch (Exception e) {		// 7
            e.printStackTrace();	// 8
        }							// 9
    }								// 10
}									// 11
```

![](https://gitee.com/dingwanli/picture/raw/master/20210527204544.png)

![](https://gitee.com/dingwanli/picture/raw/master/20210527204609.png)

## 5. 本地方法接口

### 5.1 什么是本地方法

本地方法`Native Method`：一个`Native Method`就是一个`Java`调用非`Java`代码的接口。

一个`Native Method`是这样的一个`Java`方法：该方法的实现由非`Java`语言实现，比如`C`。这个特征并非`Java`所特有，有很多其他的编程语言都有这一机制，比如在`C++`中，可以`extern`告知`C++`编译器去调用一个`C`的函数。本地接口的作用是融合不同的编程语言为`Java`所用，它的初衷是融合`C/C++`程序

### 5.2 为什么使用本地方法

`Java`使用起来非常方便，然而有些层次的任务用`Java`实现起来不容易，或者我们对程序的效率要求特别高时，就可考虑使用本地方法

> **与Java环境交互**

有时`Java`应用需要与`Java`外面的环境交互，这是本地方法存在的主要原因。`Java`需要与一些底层系统，如操作系统或某些硬件交换信息时的情况。本地方法正是这样一种交流机制：它为我么提供了一个非常简洁的接口，而且我们无需去了解`java`应用之外的繁琐的细节

> **与操作系统交互**

`JVM`支持着`Java`语言本身和运行时库，它是`Java`程序赖以生存的平台，它由一个解释器（解释字节码）和一些连接到本地代码的库组成。然而不管怎样，它毕竟不是一个完整的系统，它经常依赖与一些底层系统的支持。这些底层系统常常是强大的操作系统。通常使用本地方法，我们得以用`Java`实现了`jre`的与底层系统的交互，甚至`JVM`的一些部分就是使用`C`写的。还有，如果我们要使用一些`Java`语言本身没有提供封装的操作系统特性时，我们也需要使用本地方法

> **Sun' s Java**

`Sun`的解释器是用`C`实现的，这使得它能像一些普通的`C`一样与外部交互。`jre`大部分是用`Java`实现的，它也通过一些本地方法与外界交互。例如；类`java.lang.Thread`的`setPriority()`方法是用`java`实现的，但是它实现调用的是该类里的本地方法`setPriority0()`。这个本地方法是用`C`实现的，并被植入`JVM`内部，在`Windows 95`的平台上，这个本地方法最终调用`Win32 SetPriority() API`。这是一个本地方法的具体实现由`JVM`直接提供，更多的情况是本地方法由外部的动态链接库`external dynamic link library`提供，然后被`JVM`调用

## 6. 本地方法栈

<img src="https://gitee.com/dingwanli/picture/raw/master/20210527214017.png" style="zoom:50%;" />

1. `Java`虚拟机栈用于管理`Java`方法的调用，而本地方法栈用于管理本地方法的调用

2. 本地方法栈，也是线程私有的

3. 允许被实现成固定或者是可动态扩展的内存大小(在内存溢出方面是相同的)

   如果线程请求分配的栈容量超过本地方法栈允许的最大容量，`Java`虚拟机将会抛出一个`StackOverflowError`异常。

   如果本地方法栈可以动态扩展，并且在尝试扩展的时候无法申请到足够的内存，或者创建新的线程时没有足够的内存去创建对应的本地方法栈，那么`java`虚拟机将会抛出一个`OutOfMemoryError`异常

4. 本地方法是使用`C`语言实现的

5. 它的具体做法是`Native Method Stack`中登记`native`方法，在`Execution Engine`执行时加载本地方法库

6. 当某个线程调用一个本地方法时，它就进入了一个全新的并且不再受虚拟机限制的世界。它和虚拟机拥有同样的权限

   本地方法可以通过本地方法接口访问虚拟机内部的运行时数据区

   它甚至可以直接使用本地处理器中的寄存器

   直接从本地内存的堆中分配任意数量的内存

7. 并不是所有的`JVM`都支持本地方法。因为`Java`虚拟机规范并没有明确要求本地方法栈的使用语言、具体实现方式、数据结构等。如果`JVM`产品不打算支持`native`方法，也可以无需实现本地方法栈

8. 在`Hotspot JVM`中，直接将本地方法栈和虚拟机栈合二为一

## 7. 堆

### 7.1 基本概念

#### 7.1.1 概述

1. 一个`JVM`实例只存在一个堆内存，堆也是`Java`内存管理的核心区域
2. `Java`堆区在`JVM`启动的时候即被创建，其空间大小也就确定了。是`JVM`管理的最大一块内存空间(堆内存的大小是可以调整的)
3. 《Java虚拟机规范》规定，堆可以处于物理上不连续的内存空间中，但在逻辑上它应该被视为连续的
4. 所有的线程共享`Java`堆，在这里还可以划分线程私有的缓冲区`Thread Local Allocation Buffer, TLAB`
5. 《Java虚拟机规范》中对`Java`堆的描述是：所有的对象实例以及数组都应当在运行时分配在堆上
6. 数组和对象可能永远不会存储在栈上，因为栈帧中保存引用，这个引用指向对象或者数组在堆中的位置
7. 在方法结束后，堆中的对象不会马上被移除，仅仅在垃圾收集的时候才会被移除
8. 堆，是`GC`(`Garbage Collection`，垃圾收集器)执行垃圾回收的重点区域

#### 7.1.2 内存细分

现代垃圾收集器大部分都基于分代收集理论设计，堆空间细分为

`Java 7`及之前堆内存逻辑上分为三部分：新生区+养老区+永久区

`Java 8`及之后堆内存逻辑上分为三部分：新生区+养老区+元空间

### 7.2 堆空间大小的设置

1. `Java`堆区用于存储`Java`对象实例，那么堆的大小在`JVM`启动时就已经设定好了，可以通过`-Xmx`和`-Xms`来进行设置

   `-Xms`堆的起始内存

   `-Xmx`堆的最大内存

2. 一旦堆区中的内存超过`-Xmx`所指定的最大内存时，将会抛出`OutOfMemoryError`异常

3. 通常会将`-Xms`和`-Xmx`两个参数配置相同的，其目的就是为了能够在`Java`垃圾回收机制清理完堆区后不需要重新分割计算堆区的大小，从而提高性能

4. 默认情况下

   初始内存大小：物理电脑内存大小/64

   最大内存大小：物理电脑内存大小/4

### 7.3 年轻代与老年代

<img src="https://gitee.com/dingwanli/picture/raw/master/20210528123057.png" style="zoom:60%;" />

#### 7.3.1 概述

1. 存储在`JVM`中的`Java`对象可以划分为两类

   一类是生命周期较短的瞬时对象，这类对象的创建和消亡都非常迅速

   另外一类对象的声明周期却非常长，在某些极端的情况下还能够与`JVM`的生命周期保持一致

2. `Java`堆区进一步细分的话，可以划分为年轻代`YoungGen`和老年代`OldGen`

3. 其中年代又可以划分为`Eden`空间、`Survivor0`空间和`Survivor1`空间(有时也叫做`from`区、`to`区)

#### 7.3.2 默认大小

<img src="https://gitee.com/dingwanli/picture/raw/master/20210528123456.png" style="zoom:70%;" />

1. 默认`-XX:NewRatio=2`，表示新生代占1，老年代占2，新生代占整个堆的`1/3`
2. 可以修改`-XX:NewRation=4`，表示新生代占1，老年代占4，新生代占整个堆的`1/5`

> **Survivor**

1. 在`HotSpot`中，`Eden`空间和另外两个`Survivor`空间缺省所占的比例是`8:1:1`
2. 可以通过选项`-XX:SurvivorRatio`调整整个空间比例。比如`-XX:SurvivorRatio=8`
3. 几乎所有的`Java`对象都是在`Eden`区被`new`出来的
4. 绝大部分的`Java`对象的销毁都在新生代进行
5. 可以使用选项`-Xmn`设置新生代最大内存大小

### 7.4 对象分配过程

<img src="https://gitee.com/dingwanli/picture/raw/master/20210528131609.png" style="zoom:50%;" />

1. `new`的对象先放伊甸园。此区有大小限制

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210528130750.png" style="zoom:60%;" />

2. 当伊甸园的空间被填满时，程序又需要创建对象，`JVM`的垃圾回收器将对伊甸园区进行垃圾回收`Minor GC`，将伊甸园区中的不再被其他对象所引用的对象进行销毁。再加载新的对象放到伊甸园区

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210528131254.png" style="zoom:60%;" />

3. 然后将伊甸园中剩余对象移动到幸存者0区

4. 如果再次触发垃圾回收，此时在上次幸存下来的放到幸存者0区的对象，如果没有回收，就会放到幸存者1区

5. 如果再次触发垃圾回收，此时会重新放回幸存者0区，接着再去幸存者1区

6. 对象在幸存者区中的每一次移动都会使它的年龄加1当年龄达到15时便会移去养老区，可以通过参数`-XX:MaxTenuringThreshold=<N>`进行设置

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210528131020.png" style="zoom:60%;" />

### 7.5 MinorGC、Major GC、Full GC

`JVM`在进行`GC`，并非每次都对上面三个内存区域(新生代、老年代、方法区)一起回收的，大部分时候回收的都是指新生代

针对`HotSpot VM`的实现，它里面的`GC`按照回收区域又分为两大类型：一种是部分收集`Partial GC`，一种是整体收集`Full GC`

> **部分收集**

不是完整收集整个`Java`堆的垃圾收集。其中又分为

1. 新生代收集`Minor GC / Young GC`：只是新生代的垃圾收集

2. 老年代收集`Major GC / Old GC`：只是老年代的垃圾收集

   目前，只有`CMS GC`会有单独收集老年代的行为

   注意，很多时候`Major GC`会和`Full GC`混淆使用，需要具体分辨是老年代回收还是整堆回收

3. 混合收集`Mixed GC`：收集整个新生代以及部分老年代的垃圾收集

   目前，只有`G1 GC`会有这种行为

> **整堆收集**

整堆收集`Full GC`：收集整个`Java`堆和方法区的垃圾收集

#### 7.5.1 年轻代GC

年轻代`GC(Minor GC)`触发机制

1. 当年轻代空间不足时，就会触发`Minor GC`，这里的年轻代满指的是`Eden`区满，`Survior`满不会引发`GC`。每次`Minor GC`会清理年轻代的内存
2. 因为`Java`对象大多都具备朝生夕灭的特性，所以`Minor GC`非常频繁，一般回收速度也比较快
3. `Minor GC`会引发`STW`，暂停其他用户的线程，等垃圾回收结束，用户线程才恢复运行

#### 7.5.2 老年代GC

老年代`GC(Major GC/Full GC)`触发机制

1. 指发生在老年代的`GC`，对象从老年代消失时，我们说`Major GC`或`Full GC`发生了

2. 出现了`major GC`，经常会伴随着至少一次的`minor GC`(但非绝对的，在`Parallel Scavenge`收集器的收集策略这里就有直接进行`Major GC`的策略选择过程)

   也就是则老年代空间不足时，会先尝试触发`Minor GC`。如果之后空间还不足，则触发`Major GC`

3. `Major GC`的速度一般会比`Minor GC`慢10倍以上，`STW`的时间更长

4. 如果`Major GC`后，内存还是不足，就报`OOM`了

5. `Major GC`的速度一般会比`Minor GC`慢10倍以上

#### 7.5.3 Full GC

`Full GC`触发机制有以下五种

1. 调用`System.gc()`时，系统建议执行`Full GC`，但不是必然执行
2. 老年代空间不足
3. 方法区空间不足
4. 通过`Minor GC`后进入老年代的平均大小大于老年代的可用内存
5. 由`Eden`区、`Survior space0(From Space)`区向`Survior space1(To Space)`区复制时，对象大小大于`To Space`可用内存，则把该对象转存到老年代，且老年代的可用内存小于该对象大小 

### 7.6 堆空间分代

为什么需要把`Java`堆分代？不分代就不能正常工作了吗？

经研究，不同对象的声明周期不同。`70%-99%`的对象是临时对象

1. 新生代：有`Eden`、两块大小相同的`Survivor`(又称为`from/to`，`s0/s1`)构成，`to`总为空
2. 老年代：存放新生代中经历多次`GC`仍然存活的对象

不分代完全可以，分代的唯一理由就是优化`GC`性能

### 7.7 内存分配策略

如果对象在`Eden`出生并经过第一次`MinorGC`后任然存活，并且能被`Survior`容纳的话，将被移动到`Survivor`空间中，并将对象年龄设为1.对象在`Survivor`区中每熬过一次`MinorGC`，年龄就增加1岁，当它的年龄增加到一定程度(默认为15岁，其实每个`JVM`、每个`GC`都有所不同)时，就会被晋升到老年代中。

内存分配策略(或对象提升)

1. 优先分配到`Eden`

2. 大对象直接分配到老年代

   尽量避免程序中出现过多的大对象

3. 长期存活的对象分配到老年代

4. 动态对象年龄判断

   如果`Survivor`区中相同年龄的所有对象大小的总和大于`Survivor`空间的一半，年龄大于或等于该年龄的对象可以直接进入老年代，无需等到`MaxTenuringThreshold`中要求的年龄

5. 空间分配担保

   `-XX:HandlePromotionFailure`

### 7.8 TLAB

<img src="https://gitee.com/dingwanli/picture/raw/master/20210528193615.png" style="zoom:50%;" />

什么是`TLAB`？

1. 从内存模型而不是垃圾收集的角度，对`Eden`区域继续进行划分，`JVM`为每个线程分配了一个私有缓存区域，它包含在`Eden`空间内
2. 多线程同时分配内存时，使用`TLAB`可以避免一系列的非线程安全问题。同时还能够提升内存分配的吞吐量，因此我们可以将这种内存分配方式称为快速分配策略

为什么有`TLAB(Thread Loacl Allocation Buffer)`

1. 堆区是线程共享区域，任何线程都可以访问到堆区中的共享数据
2. 由于对象实例的创建在`JVM`中非常频繁，因此在并发环境下从堆区中划分内存空间是线程不安全的
3. 为避免多个线程操作同一地址，需要使用加锁等机制，进而影响分配速度

`TLAB`的说明

1. 尽管不是所有的对象实例都能够在`TLAB`中成功分配内存，但`JVM`确实是将`TLAB`作为内存分配的首选
2. 在程序中，开发人员可以通过选项`-XX:UseTLAB`设置是否开启`TLAB`空间
3. 默认情况下，`TLAB`空间的内存非常小，仅占有整个`Eden`空间的`1%`，当我们可以通过选项`-XX:TLABWasteTargetPercent`设置`TLAB`空间所占用空间的百分比大小
4. 一旦对象在`TLAB`空间分配内存失败时，`JVM`就会尝试着通过使用加锁机制确保数据操作的原子性，从而直接在`Eden`空间中分配内存

### 7.9 堆空间参数设置

1. 查看所有的参数的默认初始值

   ```shell
   -XX:+PrintFlagesInitial
   ```

2. 查看所有的参数的最终值

   ```shell
   -XX:+PrintFlagsFinal
   ```

3. 初始堆空间内存(默认为物理内存的1/64)

   ```shell
   -Xms
   ```

4. 最大堆空间内存(默认为物理内存的1/4)

   ```shell
   -Xmx
   ```

5. 设置新生代的大小

   ```shell
   -Xmn
   ```

6. 配置新生代与老年代在堆结构的占比

   ```shell
   -XX:NewRatio
   ```

7. 设置新生代中`Eden`和`S0`和`S1`空间的比例

   ```shell
   -XX:SurvivorRatio
   ```

8. 设置新生代垃圾的最大年龄

   ```shell
   -XX:+MaxTenuringThreshold
   ```

9. 输出详细的`GC`处理日志

   ```shell
   -XX:+PrintGC
   -verbose:gc
   ```

10. 是否设置空间分配担保

    ```shell
    -XX:HandlePromotionFailure
    ```

在发生`Minor GC`之前，虚拟机会检查老年代最大可用的连续空间是否大于新生代所有对象的总空间

- 如果大于，则此次`Minor GC`是安全的

- 如果小于，则虚拟机会查看`-XX:HandlePromotionFailure`设置值是否允许担保失败

  如果`handlePromotionFailure=true`，那么继续检查老年代最大可用连续空间是否大于历次晋升到老年代的对象的平均大小

  1. 如果大于，则尝试进行一次`Minor GC`，但这次`Minor GC`依然是有风险的
  2. 如果小于，则改为进行一次`Full GC`

  如果`HandlePromotionFailure=false`，则改为进行一次`Full GC`

在`JDK6 Update24`之后，`HandlePromotionFailure`参数不会影响到虚拟机的空间分配担保策略，观察`OpenJDK`中的源码变化，虽然源码中还定义了`HandlePromotionFailure`参数，但是在代码中已经不会在使用它。`JDK6 Update24`之后的规则变为只要老年代的连续空间大于新生代对象总大小或者历次晋升的平均大小就会进行`Minor GC`，否则将进行`Full GC`

### 7.10 堆不是分配对象的唯一选择

在《深入理解Java虚拟机》中：随着`JIT`编译期的发展与逃逸分析技术逐渐成熟，栈上分配、标量替换优化技术将会导致一些微妙的变化，所有的对象都分配到堆上也就渐渐变得不那么“绝对了”

#### 7.10.1 概述

在`Java`虚拟机中，对象是在`Java`堆中分配内存的，这是一个普遍的常识。但是，有一种特殊情况，那就是若干经过逃逸分析`Escape Analysis`后发现，一个对象并没有逃逸出方法的话，那么就可能被优化成栈上分配。这样就无需在堆上分配内存，也无需进行垃圾回收了。这也是最常见的堆外存储技术

此外，前面提到的基于`OpenJDK`深度定制的`TaoBaoVM`，其中创新的`GCIH(GC invisible heap)`技术实现`off-heap`，将生命周期较长的`Java`对象从`heap`中移至`heap`外，并且`GC`不能管理`GCIH`内部的`Java`对象，以此达到降低`GC`的回收频率和提升`GC`的回收效率的目的

#### 7.10.2 逃逸分析

1. 如果将堆上的对象分配到栈，需要使用逃逸分析手段

2. 这是一种可以有效减少`Java`程序中同步负载和内存堆分配压力的跨函数全局数据流分析算法

3. 通过逃逸分析，`Java Hotspot`编译器能够分析出一个新的对象的引用的使用范围从而决定是否要将这个对象分配到堆上

4. 逃逸分析的基本行为就是对象动态作用域：

   当一个对象在方法中被定义后，对象只能在方法内部使用，则认为没有发生逃逸，栈上分配

   当一个对象在方法中被定义后，它被外部方法所引用，则认为发生逃逸。例如作为调用参数传递到其他地方中

```java
public class EscapeAnalysis {
    private EscapeAnalysis obj;

    public EscapeAnalysis getInstance() {
        // 发生逃逸
        return obj == null ? new EscapeAnalysis() : obj;
    }

    public void setObj() {
        // 发生逃逸
        this.obj = new EscapeAnalysis();
    }
    
    public void useEscapeAnalysis1() {
        // 没有发生逃逸
        EscapeAnalysis e = new EscapeAnalysis();
    }
    
    public void useEscapeAnalysis2() {
        // 发生逃逸
        EscapeAnalysis e = getInstance();
    }
}
```

`JDK 6u23`之后，`Hotspot`默认开启逃逸分析

#### 7.10.3 代码优化

使用逃逸分析，编译器可以对代码做出如下优化

> **栈上分配**

栈上分配。将堆分配转化为栈分配。如果一个对象在子程序中被分配，要使指向该对象的指针永远不会逃逸，对象可能是栈分配的候选，而不是堆分配

`JIT`编译器在编译期间根据逃逸分析的结果，发现如果一个对象没有逃逸出方法的话，就可能被优化成栈上分配。分配完成后。继续在调用栈内执行，最后线程结束，栈空间被回收，局部变量也被回收。这样就无需进行垃圾回收了

> **同步省略**

同步省略。如果一个对象被发现只能从一个线程被访问，那么对于这个对象的操作可以不考虑同步

线程同步的代价是相当高的，同步的后果是降低并发性和性能

在动态编译同步块的时候，`JIT`编译器可以借助逃逸分析来判断同步块所使用的锁对象是否只够一个线程访问而没有被发布到其他线程。如果没有，那么`JIT`编译器在编译这个同步块的时候就会取消对这部分代码的同步。这样就能大大提高并发性和性能。这个取消同步的过程就叫同步省略，也叫锁消除

> **分离对象或标量替换**

分离对象或标量替换。有的对象可能不需要作为一个连续的内存结构存在也可以被访问到，那么对象的部分(或全部)可以不存储在内存，而是存储在`CPU`寄存器中

标量`Scalar`是指一个无法再分解更小的数据的数据。`Java`中**原始的数据类型**就是标量。

相对的，那些还可以分解的数据叫做聚合量`Agggregate`，`Java`中的**对象**就是聚合量，因为它可以分解成其他聚合量和标量

在`JIT`阶段，如果经过逃逸分析，发现一个对象不会被外界访问的话，那么经过`JIT`优化，就会把这个对象拆解成若干个其中包含的若干个成员变量来代替。这个过程就是标量替换

下面`alloc`方法可以被替换

```java
public class ScalarReplace {
    public static class User{
        private int id;
        private String name;
    }
    
    public static void alloc() {
        User user = new User();
        user.id = 1;
        user.name = "标量替换";
    }
}
```

被替换为

```java
public class ScalarReplace {
    public static class User{
        private int id;
        private String name;
    }
    
    public static void alloc() {
        int id = 1;
        String name = "标量替换";
    }
}
```

