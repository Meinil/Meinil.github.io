---
title: JVM(二)
date: '2021-06-03'
sidebar: 'auto'
categories:
 - java
tags:
 - java
---

## 1. 字节码

`Java`语言：跨平台的语言

1. 当`Java`源代码成功编译成字节码后，如果想在不同的平台上运行，则无需再次编译
2. 这个优势已经不再那么吸引人了。`Python`、`PHP`、`Perl`、`Ruby`、`Lisp`等有强大的解释器
3. 跨平台似乎已经称为了一门必选的特性

`JVM`：跨语言的平台

`Java`虚拟机不包括`Java`在内的任何语言的绑定，它只与`Class`文件这种特定的二进制文件格式所关联。无论使用何种语言进行软件开发，只要将源文件编译为正确的`Class`文件，那么这种语言就可以在`Java`虚拟机上执行。可以说，统一而强大的`Class`文件结构，就是`Java`虚拟机的基石、桥梁

### 1.1 Class文件

字节码文件是什么？

- 源代码经过编译器编译之后便会生成一个字节码文件，字节码是一种二进制的类文件，它的内容是`JVM`的指令，而不是像`C/C++`经由编译器直接生成机器码

什么是字节码指令`byte code`？

- `Java`虚拟机的指令由一个字节长度的、代表着某种特定操作含义的操作码`opcode`以及跟随其后的零至多个代表此操作所需参数的操作数`operand`所构成。虚拟机中许多指令并不包含操作数，只有一个操作码

### 1.2 字节码文件结构

以下的所有分析都是针对这个例子

```java
package com.valid;

public class Demo {
    private int num = 10;

    public int add () {
        num = num + 2;
        return num;
    }
}
```

`class`类的本质：任何一个`Class`文件都对应着唯一一个类或接口的定义信息，但反过来说，`Class`文件实际上它并不一定以磁盘文件的形式存在。`Class`文件是一组以8位字节为基础单位的二进制流

> **class文件格式**

`Class`的结构不像`XML`等描述语言，由于它没有任何分隔符号。所以在其中的数据项，无论是字节顺序还是数量，都是被严格限定的，哪个字节代表什么含义，长度是多少，先后顺序如何，都不允许改变

`Class`文件采用一种类似于`C`语言结构体的方式进行数据存储，这种结构中只有两种数据类型：无符号数和表

- 无符号数属于基本的基本类型，以`u1`、`u2`、`u4`、`u8`来分别代表1个字节、2个字节、4个字节和8个字节的无符号数，无符号数可以用来描述数字、索引引用、数量值或者按照`UTF-8`编码构成字符串值
- 表是由多个无符号数或者其他表作为数据项构成的复合数据类型，所有表都习惯地以`_info`结尾。表用于描述有层次关系的复合结构的数据，整个`Class`文件本质上就是一张表。由于表没有固定长度，所以通常会在其前面加上个数说明

```java
ClassFile {
    u4             magic;									// 魔数
    u2             minor_version;							// Class文件副版本
    u2             major_version;							// Class文件主版本
    u2             constant_pool_count;						// 常量池的长度
    cp_info        constant_pool[constant_pool_count-1];	// 常量池
    u2             access_flags;							// 访问标志
    u2             this_class;								// 类索引
    u2             super_class;								// 父类索引
    u2             interfaces_count;						// 接口数量
    u2             interfaces[interfaces_count];			// 接口
    u2             fields_count;							// 字段数量
    field_info     fields[fields_count];					// 字段
    u2             methods_count;							// 方法数量
    method_info    methods[methods_count];				·	// 方法
    u2             attributes_count;						// 属性数量
    attribute_info attributes[attributes_count];			// 属性
}
```

| 类型           | 名称                                 | 说明                    | 长度/字节 | 数量                  |
| -------------- | ------------------------------------ | ----------------------- | --------- | --------------------- |
| u4             | magic                                | 魔数，识别Class文件格式 | 4         | 1                     |
| u2             | minor_version                        | 副版本号(小版本)        | 2         | 1                     |
| u2             | major_version                        | 主版本号(大版本)        | 2         | 1                     |
| u2             | constant_pool_count                  | 常量池计数器            | 2         | 1                     |
| cp_info        | constant_pool[constant_pool_count-1] | 常量池表                | n         | constant_pool_count-1 |
| u2             | access_flags                         | 访问标识                | 2         | 1                     |
| u2             | this_class                           | 类索引                  | 2         | 1                     |
| u2             | super_class                          | 父类索引                | 2         | 1                     |
| u2             | interfaces_count                     | 接口计数器              | 2         | 1                     |
| u2             | interfaces[interfaces_count]         | 接口索引集合            | 2         | interfaces_count      |
| u2             | fields_count                         | 字段计数器              | 2         | 1                     |
| field_info     | fields[fields_count]                 | 字段表                  | n         | fields_count          |
| u2             | methods_count                        | 方法计数器              | 2         | 1                     |
| method_info    | methods[methods_count]               | 方法表                  | n         | methods_count         |
| u2             | attributes_count                     | 属性计数器              | 2         | 1                     |
| attribute_info | attributes[attributes_count]         | 属性表                  | n         | attributes_count      |

#### 1.2.1 魔数

魔数`Magic Number`

每个`Class`文件开头的4个字节的无符号整数称为魔数，它的唯一作用就是确定这个文件是否为一个能被虚拟机接受的有效合法的`Class`文件。即：魔数是`Class`文件的标识。

魔数的值固定为`oXCAFEBABE`，不会改变

如果一个`Class`文件不以魔数开头，虚拟机在进行文件校验的时候会抛出以下错误

```
Error: A JNI error has occurred, please check your installation and try again
Exception in thread "main" java.lang.ClassFormatError: Incompatible magic value 3884495332 in class file 包名
```

使用魔数而不是扩展名来进行识别主要是基于安全方面的考虑，因为扩展名可以随意地改动

#### 1.2.2 文件版本号

紧接着魔数的4个字节存储的是`Class`文件的版本号。同样也是4个字节。第五个和第六个字节所代表的含义就是编译的副版本号`minor_version`，而第七个和第八个字节就是编译的主版本号`major_version`

它们共同构成了`class`文件的格式版本号。譬如某个`Class`文件的主版本号为`M`，副版本号为`m`，那么这个`Class`文件的版本号确定为`M.m`

版本号和`Java`编译器的对应关系

| 主版本(十进制) | 副版本(十进制) | 编译器版本 |
| -------------- | -------------- | ---------- |
| 45             | 3              | 1.1        |
| 46             | 0              | 1.2        |
| 47             | 0              | 1.3        |
| 48             | 0              | 1.4        |
| 49             | 0              | 1.5        |
| 50             | 0              | 1.6        |
| 51             | 0              | 1.7        |
| 52             | 0              | 1.8        |
| 53             | 0              | 1.9        |
| 54             | 0              | 1.10       |
| 55             | 0              | 1.11       |

不同版本的`Java`编译器编译的`Class`文件对应的版本是不一样的。目前，高版本的`Java`虚拟机可以执行由低版本编译器生成的字节码，但是低版本的`Java`虚拟机不能执行由高版本编译器生成的`Class`文件。

#### 1.2.3 常量池

常量池是`Class`文件中内容最为丰富的区域之一。常量池对于`Class`文件中的字段和方法解析也有着至关重要的作用。随着`Java`虚拟机的不断发展，常量池的内容也日渐丰富。可以说，常量池是整个`Class`文件的基石。

在版本号之后，紧跟着的是常量池的数量，以及若干个常量池表项。

常量池中常量的数量是不固定的，所以在常量池的入口需要放置一项`u2`类型的无符号数，代表常量池容量计数值`constant_pool_count`。与`Java`中语言习惯不一样的是，这个容量计数是从1而不是0开始的

| 类型    | 名称                                 | 数量                  |
| ------- | ------------------------------------ | --------------------- |
| u2      | constant_pool_count                  | 1                     |
| cp_info | constant_pool[constant_pool_count-1] | constant_pool_count-1 |

由上表可以看出，`Class`文件使用了一个前置的容量计数器`constant_pool_count`加若干个连续的数据项`constant_pool`的形式来描述常量池的内容。我们把这一系列连续常量池数据称为常量池集合

- 常量池表项中，用于存放编译时期生成的各种字面量和符号引用，这部分内容将在类加载后进入**方法区的运行时常量池**中存放

> **常量池计数器**

由于常量池的数量不固定，时长时短，所以需要放置两个字节来表示常量池容量计数值

常量池容量计数值`u2`类型：从1开始，表示常量池中有多少项常量。即`constant_pool_count = 1`表示常量池中有`0`个常量池项

通常我们写代码时都是从0开始的，但是这里的常量池却是从1开始，因为它把第0项常量空出来了。这是为了满足后面某些执行常量池的索引值的数据在特定情况下需要表达“不引用任何一个常量池项目”的含义，这种情况可用索引值0来表示

> **常量池表**

`constant_pool`示一种表结构，以`1~constant_pool_count - 1`为索引。表明了后面有多少个常量项

常量池主要存放两大类常量：字面量`Literal`和符号引用`Symbolic References`

它包含了`class`文件结构及其子结构中引用的所有字符串常量、类或接口名、字段名和其他常量。常量池中的每一项都具备相同的特征。第一个字节作为类型标记，用于确定该项的格式，这个字节被称为`tag byte`(标记字节、标签字节)

| 类型                             | 标志(或标识) | 描述                   |
| -------------------------------- | ------------ | ---------------------- |
| CONSTANT_Utf8_info               | 1            | UTF-8编码的字符串      |
| CONSTANT_Integer_info            | 3            | 整型字面量             |
| CONSTANT_Float_info              | 4            | 浮点型字面量           |
| CONSTANT_Long_info               | 5            | 长整型字面量           |
| CONSTANT_Double_info             | 6            | 双精度浮点型字面量     |
| CONSTANT_Class_info              | 7            | 类或接口的符号引用     |
| CONSTANT_String_info             | 8            | 字符串类型字面量       |
| CONSTANT_Fieldref_info           | 9            | 字段的符号引用         |
| CONSTANT_Methodref_info          | 10           | 类中方法的符号引用     |
| CONSTANT_InterfaceMethodref_info | 11           | 接口中方法的符号引用   |
| CONSTANT_NameAndType_info        | 12           | 字段或方法的符号引用   |
| CONSTANT_MethodHandle_info       | 15           | 表示方法句柄           |
| CONSTANT_MethodType_info         | 16           | 标志方法类型           |
| CONSTANT_InvokeDynamic_info      | 18           | 表示一个动态方法调用点 |

标志中所包含的详细信息

<img src="https://gitee.com/dingwanli/picture/raw/master/20210604160614.png" style="zoom:60%;" />

<img src="https://gitee.com/dingwanli/picture/raw/master/20210604161631.png" style="zoom:60%;" />

1. 这14种表(或者常量项结构)的共同特点是：表开始的第一位是一个`u1`类型的标志位`tag`，代表当前这个常量项使用的是哪种表结构，即哪种常量类型
2. 在常量池列表中，`CONSTANT_Utf8_info`常量项是一种使用改进过的`UTF-8`编码格式来存储诸如文字字符串、类或者接口的全限定名、字段或者方法的简单名称以及描述符等常量字符串信息
3. 这14种常量项结构还有一个特点是，其中13个常量项占用的字节固定，只有`CONSTANT_Utf8_info`占用字节不固定，其大小由`length`决定。为什么呢？因为从常量池存放的内容可知，其存放的是字面量和符号引用，最终这些内容都会是一个字符串，这些字符串的大小是在编写程序时才确定

>**字面量和符号引用**

字面量包含两类，文本字符串和声明为`final`的常量值

```java
String str = "Hello World!";
final int NUM = 10;
```

符号引用包含三类：类和接口的全限定名，字段的名称和秒舒服，方法的名称和描述符

- 全限定名：`java/util/List`这个就是类的全限定名，仅仅是把包名的"."替换成"/"，为了使连续的多个全限定名之间不产生混淆，在使用时最后一般会加入一个";"表示全限定名结束

- 简单名称：简单名称是指没有类型和参数修饰的方法或者字段名称，比如下面例子中，`add`和`num`就是名称

  ```java
  public class Demo {
      private int num = 10;
  
      public int add () {
          num = num + 2;
          return num;
      }
  }
  ```

- 描述符：描述符的作用是用来描述字段的数据类型、方法的参数列表(包括数量、类型以及顺序)和返回值。根据描述规则，基本数据类型(`byte`、`char`、`double`、`float`、`int`、`long`、`short`、`boolean`)以及代表无返回值的`void`类型都用一个大写字符来表示，而对象类型则用字符`L`加对象的全限定名来表示

  | 标志符 | 含义                                              |
  | ------ | ------------------------------------------------- |
  | B      | 基本数据类型byte                                  |
  | C      | 基本数据类型char                                  |
  | D      | 基本数据类型double                                |
  | F      | 基本数据类型float                                 |
  | I      | 基本数据类型int                                   |
  | J      | 基本数据类型long                                  |
  | S      | 基本数据类型short                                 |
  | Z      | 基本数据类型boolean                               |
  | V      | 代表void类型                                      |
  | L      | 对象类型，比如：Ljava/lang/Object                 |
  | [      | 数组类型，代表一维数组。比如：double\[][] is [[[D |

  用描述符描述方法时，按照先参数列表，后返回值的顺序描述，参数列表按照参数的严格顺序放在一组小括号`()`之内。如方法`java.lang.String toString()`的描述符为`()Ljava/lang/String;`方法`int abc(int[] x, int y)`的描述符为`([II) I`

  补充：虚拟机在加载`Class`文件时才会进行动态链接，也就是说。`Class`文件中不会保存各个方法和字段的最终内存布局信息，因此，这些字段和方法引用不经过转换时无法直接被虚拟机使用的。当虚拟机运行时，需要从常量池中获得对应的符号引用，在类加载过程中将其替换为直接引用，并翻译到具体的内存地址中

  符号引用和直接引用的区别和联系

  - 符号引用：符号引用以一组符号来描述所引用的目标，符号可以是任何形式的字面量，只要使用时能无歧义地定位到目标即可。符号引用与虚拟机实现的内存布局无关，应用的目标并不一定已经加载到了内存中
  - 直接引用：直接引用可以是直接指向目标的指针、相对偏移量或是一个能间接定位到目标的句柄。直接引用是与虚拟机实现的内存布局相关的，同一个符号一弄可以是直接指向目标的指针、相对偏移量或是一个能间接定位到目标的句柄。直接引用是与虚拟机实现的内存布局相关的，同一个引用在不同虚拟机实例上翻译出来的直接引用一般不会相同。如果有个直接引用，那说明引用的目标必定已经存在于内存之中了

> **常量池分析**

对应的常量池字节码

<img src="https://gitee.com/dingwanli/picture/raw/master/20210604163037.png" style="zoom:60%;" />

```
#1 = Methodref          #4.#18         // java/lang/Object."<init>":()V
#2 = Fieldref           #3.#19         // com/valid/Demo.num:I
#3 = Class              #20            // com/valid/Demo
#4 = Class              #21            // java/lang/Object
#5 = Utf8               num
#6 = Utf8               I
#7 = Utf8               <init>
#8 = Utf8               ()V
#9 = Utf8               Code
#10 = Utf8              LineNumberTable
#11 = Utf8              LocalVariableTable
#12 = Utf8              this
#13 = Utf8              Lcom/valid/Demo;
#14 = Utf8              add
#15 = Utf8              ()I
#16 = Utf8              SourceFile
#17 = Utf8              Demo.java
#18 = NameAndType       #7:#8          // "<init>":()V
#19 = NameAndType       #5:#6          // num:I
#20 = Utf8              com/valid/Demo
#21 = Utf8              java/lang/Object
```

总结：

1. 常量池：可以理解为`Class`文件之中的资源仓库，它是`Class`文件结构中与其他项目关联最多的数据类型(后面的很多数据类型都会指向此处)，也是占用`Class`文件空间最大的数据项目之一

2. 常量池中为什么要包含这些内容?

   `java`代码在进行`Javac`编译的时候，并不像`C/C++`那样有“连接”这一步骤，而是在虚拟机加载`Class`文件的时候进行动态链接。也就是说，在`Class`文件中不会保存各个方法、字段的最终内存布局信息，因此这些字段、方法的符号引用不经过运行期转换的话无法得到真正的内存入口地址，也就无法直接被虚拟机使用。当虚拟机运行的时候，需要从常量池中获得对应的符号引用，再在类创建时或运行时解析、翻译到具体的内存地址之中。

#### 1.2.4 访问标识

访问标识(`access_flag`、访问标志、访问标记)：在常量池后，紧跟着访问标记。该标记使用两个字节表示，用于识别一些类或者接口层次的访问信息，包括：这个`Class`是类还是接口；是否定义为`public`类型；是否定位为`abstract`类型；如果是类的话，是否被声明为`final`等。各种访问标记如下

| 标志名称       | 标志值 | 含义                                                         |
| -------------- | ------ | ------------------------------------------------------------ |
| ACC_PUBLIC     | 0x0001 | 标志为public类型                                             |
| ACC_FINAL      | 0x0010 | 标志被声明为final，只有类可以设置                            |
| ACC_SUPER      | 0x0020 | 标志允许使用invokespecial字节码指令的新语义，JDK1.0.2之后编译出的文件这个标志为默认为真(使增强方法调用父类方法) |
| ACC_INTERFACE  | 0x0200 | 标志这是一个接口                                             |
| ACC_ABSTRACT   | 0x0400 | 是否为abstract类型，对于接口或者抽象类来说，次标志值为真，其他类型为假 |
| ACC_SYNTHETIC  | 0x1000 | 标志此类并非由用户代码产生(即：由编译器产生的类，没有源码对应) |
| ACC_ANNOTATION | 0x2000 | 标志这是一个注解                                             |
| ACC_ENUM       | 0x4000 | 标志这是一个枚举                                             |

类的访问权限通常为`ACC_`开头的常量

每一种类型的都表示是通过设置访问标记的32位中的特定位来实现的。比如，若是`public final`的类，则该标记为`ACC_PUBLIC | ACC_FINAL`

使用`ACC_SUPER`可以让类更准确地定位到父类的方法`super.method()`，现代编译器都会设置并且使用这个标记

> **补充说明**

1. 带有`ACC_INTERFACE`标志的`class`文件表示的是接口而不是类，反之则表示的是类而不是接口

   如果一个`class`文件被设置了`ACC_INTERFACE`标志，那么同时也得设置`ACC_ABSTRACT`标志。同时它不能再设置`ACC_FINAL`、`ACC_SUPER`或`ACC_ENUM`标志

   如果没有设置`ACC_INTERFACE`标志，那么这个`class`文件可以具有上表除`ACC_ANNOTATION`外的其他的所有标志。当然，`ACC_FINAL`和`ACC_ABSTRACT`这类互斥的标志除外。这两个标志不得同时设置

2. `ACC_SUPER`标志用于确定类或接口里面的`invokespecial`指令使用的哪一种执行语义。针对`Java`虚拟机指令集的编译器都应当设置这个标志。对于`JDK8`及后续版本来说，无论`class`文件中这个标志的实际值是什么，也不管`class`文件的版本

3. 注解类型必须设置`ACC_ANNOTATION`标志。如果设置了`ACC_ANNOTATION`标志，那么也必须设置`ACC_INTERFACE`标志

#### 1.2.5 类、父类、接口索引集合

在访问标记之后，会指定该类的类型、父类类别以及实现的接口

| 长度 | 符号                         | 含义         |
| ---- | ---------------------------- | ------------ |
| u2   | this_class                   | 当前类索引   |
| u2   | super_class                  | 父类索引     |
| u2   | interfaces_count             | 接口数量     |
| u2   | interfaces[interfaces_count] | 接口索引集合 |

这三项数据来确定这个类的继承关系

1. 类索引用于确定这个类的全限定名
2. 父类索引用于确定这个类的父类的全限定名。由于`Java`语言不允许多重继承，所以父类索引只有一个，除了`java.lang.Object`之外，所有的`Java`类都有父类，因此出了`java.lang.Object`外，所有`Java`类的父类索引都不为0
3. 接口索引集合就是用来描述这个类实现了哪些接口，这些被实现的接口将按`implements`语句(如果这个类本身是一个接口，则应当是`extends`语句)后的接口顺序从左到右排列在接口索引集合中

> **this_class(类索引)**

2字节无符号整数，指向常量池的索引。它提供了类的全限定名。如`com/valid/Demo`。`this_class`的值必须是对常量池表中某项的一个有效索引值。常量池在这个索引处必须为`CONSTANT_Class_info`累心结构体，该结构体表示这个`class`文件所定义的类或接口

> **super_class(父类索引)**

2字节无符号整数，指向常量池的索引。它提供了当前类的父类的全限定名。如果我们没有继承任何类，其默认继承的是`java/lang/Object`类，同时，由于`java`不支持多继承，所以其父类只能有一个

`super_class`指向的父类不能是`final`

> **interfaces**

指向常量池索引集合，它提供了一个符号引用到所有已实现的接口

由于一个类可以实现多个接口，因此需要以数组形式保存多个接口的索引，表示接口的每个索引也是一个指向常量池的`CONSTANT_CLASS`(当然这里必须是接口，而不是类)

1. `interfaces_count`接口计数器：值表示当前类或接口的直接接口数量

2. `interfaces[]`接口索引集合

   `interfaces[]`中每个成员的值必须是对常量池表中某项的有效索引值，它的长度为`interfaces_count`。每个成员`interfaces[i]`必须为`CONSTANT_Class_info`结构，其中`0 <= i < interfaces_count`。在`intefaces[]`中，个成员所表示的接口顺序和对应的源代码中给定的接口顺序(从左至右)一样，即`interfaces[0]`对应的是源代码中最左边的接口

#### 1.2.6 字段表集合

`fields`字段表集合

用于描述接口或类中声明的变量。字段`field`包括类级变量以及实例变量，但是不包括方法内部、代码块内部声明的局部变量

字段叫什么名字、字段被定义为什么数据类型，这些都是无法固定的，只能引用常量池中的常量来描述

它指向常量池索引集合，它描述了每个字段的完整信息。比如字段的标识符、访问修饰符(`public`、`private`或`protected`)、是类变量还是实例变量(`static`修饰符)、是否是常量(`final`修饰符)

> **注意**

字段表集合中不会列出从父类或者实现的接口中继承而来的字段，但有可能列出原本`Java`代码中不存的字段。譬如在内部类中为了保持对外部类的访问性，会自动添加指向外部实例的字段

在`Java`语言中字段是无法重载的，两个字段的数据类型、修饰符不管是否相同，都必须使用不一样的名称，但是对于字节码来讲，如果两个字段的描述符不一致，那字段重名就是合法的

> **字段计数器**

`fields_count`字段计数器

`fields_count`的值表示当前`class`文件`fields`表的成员个数。使用两个字节来表示

`fields`表中每个成员都是一个`field_info`结构，用于表示该类或接口所声明的所有类字段或者实例字段，不包括方法内部声明的变量，也不包括从父类或从父接口继承的那些字段

> **字段表**

`fields[]`字段表

`fields`表中的每个成员都必须是一个`fields_info`结构的数据项，用于表示当前类或接口中某个字段的完整描述

一个字段的信息包括如下信息，这些信息中国年，各个修饰符都是布尔值，要么有，要么没有

- 作用域(`public`、`private`、`protected`修饰符)
- 是实例变量还是类变量(是否有`static`修饰)
- 可变性
- 并发可见性(`volatile`修饰符，是否强制从主存读写)
- 是否可序列化(`transient`修饰符)
- 字段数据类型(基本数据类型、对象、数组)
- 字段名称

字段表结构

| 类型           | 名称             | 含义       | 数量             |
| -------------- | ---------------- | ---------- | ---------------- |
| u2             | access_flages    | 访问标志   | 1                |
| u2             | name_index       | 字段名索引 | 1                |
| u2             | descriptor_index | 描述符索引 | 1                |
| u2             | attributes_count | 属性计数器 | 1                |
| attribute_info | attributes       | 属性集合   | attributes_count |

1. **访问标识**：这些访问标识用于记录字段是否被某个关键字所修饰

    | 标志名称      | 标志值 | 含义                 |
    | ------------- | ------ | -------------------- |
    | ACC_PUBLIC    | 0x0001 | 字段是否为public     |
    | ACC_PRIVATE   | 0x0002 | 字段是否为private    |
    | ACC_PROTECTED | 0x0004 | 字段是否为protected  |
    | ACC_STATIC    | 0x0008 | 字段是否为static     |
    | ACC_FINAL     | 0x0010 | 字段是否为final      |
    | ACC_VOLATILE  | 0x0040 | 字段是否为volatile   |
    | ACC_TRANSTENT | 0x0080 | 字段是否为transient  |
    | ACC_SYNCHETIC | 0x1000 | 字段是否由编译器产生 |
    | ACC_ENUM      | ox4000 | 字段是否为enum       |

2. 字段名索引：根据字段名索引的值，查询常量池中的指定索引项即可

3. 描述符索引

    描述符的作用是用来描述字段的数据类型、方法的参数列表(包含数量、类型以及顺序)和返回值。根据描述符的规则，基本数据类型(`byte`、`char`、`double`、`float`、`int`、`long`、`short`、`boolean`)及代表无返回值的`void`类型都用一个大写字母来表示，而对象则用字符`L`加对象的全限定名来表示

4. 属性表集合

    一个字段还可能拥有一些属性，用于存储更多的额外信息，比如初始化值、一些注释信息等。属性个数存放在`attribute_count`中，属性具体内容存放在`attributes`数组中

    以常属性为例，结构为：

    ```
    ConstantValue_attribute{
    	u2 attribute_name_index;
    	u4 attribute_length;
    	u2 constantValue_index;
    }
    ```

    对于常属性而言，`attribute_length`值恒为2

#### 1.2.7 方法表集合

方法表集合`methods`：指向常量池索引集合，它完整描述了每个方法的签名

- 在解码文件中，每一个`method_info`项都对应着一个类或者接口中的方法信息。比如方法的访问修饰符(`public`、`private`、`protected`)，方法的返回值类型以及方法的参数信息等
- 如果这个方法不是抽象的或者不是`native`的，那么字节码中会体现出来
- 一方面，`method`表只描述当前类或接口中声明的方法，不包括从父类或父接口继承的方法。另一方面，`methods`表有可能会出现由编译器自动添加的方法，最典型的便是编译器产生的方法信息(比如：类(接口)初始化方法\<clinit>()和实例初始化方法\<init>())

> **注意**

在`Java`语言中，要重载`overload`一个方法，出了要与原方法具有相同的简单名称之外，还要求必须拥有一个与原方法不同的特征签名，特征签名就是一个方法中各个参数在常量池中的字段符号引用的集合，也就是因为返回值不会包含在特征签名之中，因此`Java`语言里无法仅仅依靠返回值的不同来对一个已有的方法进行重载。但是在`Class`文件格式中，特征签名的范围更大一些，只要描述符不是完全一致的两个方法就可以共存。也就是如果两个方法有相同的名称和特征签名，但返回值不同，那么也是可以合法共存于同一个`class`文件中国年

也就是说，尽管`Java`语法规范中并不允许在一个类或者接口中声明多个方法签名相同的方法，但是和`Java`语法规范相反，字节码文件中却恰恰允许存放多个方法签名相同的方法，唯一的条件就是这些方法之间的返回值不能相同

> **方法表**

`methods[]`方法表

`methods`表中的每个成员都必须是一个`method_info`结构，用于表示当前类或接口中某个方法的完整描述。如果某个`method_info`结构的`access_flags`项既没有设置`ACC_MATIVE`标志也没有设置`ACC_ABSTRACT`标志，那么该结构中也应包含实现这个方法所用的`Java`虚拟机指令

`method_info`结构可以表示类和接口中定义的所有方法，包括实例方法、类方法、实例初始化方法和类或接口初始化方法

方法表的结构实际跟字段表是一样的，方法表结构如下

| 类型           | 名称              | 含义       | 数量             |
| -------------- | ----------------- | ---------- | ---------------- |
| u2             | access_flages     | 访问标志   | 1                |
| u2             | name_index        | 方法名索引 | 1                |
| u2             | descriptior_index | 描述符索引 | 1                |
| u2             | attributes_count  | 属性计数器 | 1                |
| attribute_info | attributes        | 属性集合   | attributes_count |

方法表访问标志，跟字段表一样，方法表也有访问标志，而且他们的标志有部分相同，部分不同，方法表的具体访问标志如下

| 标记名        | 值     | 说明                                |
| ------------- | ------ | ----------------------------------- |
| ACC_PUBLIC    | 0x0001 | public，方法可以从包外访问          |
| ACC_PRIVATE   | 0x0002 | private，方法只能本类中访问         |
| ACC_PROTECTED | 0x0004 | protected，方法在自身和子类可以访问 |
| ACC_STATIC    | 0x0008 | static，静态方法                    |

#### 1.2.8 属性表集合

属性表集合`attributes`

方法表集合之后的属性表集合，指的是`class`文件所携带的辅助信息，比如该`class`文件的源文件的名称。以及任何带有`RetentionPolicy.CLASS`或者`RetentionPolicy.RUNTIME`的注解。这类信息通常被用于`Java`虚拟机的验证和运行，以及`Java`程序的调试，一般无需深入了解

此外，字段表、方法表都可以有自己的属性表。用于描述某些场景专有的信息

属性表集合的限制没有那么严格，不要求各个属性具有严格的顺序，并且只要不与已有的属性名重复，任何人实现的编译器都可以向属性表中写入自己定义的属性信息，但是`Java`虚拟机运行时会忽略它不认识的属性

> **属性的通用格式**

| 类型 | 名称                 | 数量             | 含义       |
| ---- | -------------------- | ---------------- | ---------- |
| u2   | attribute_name_index | 1                | 属性名索引 |
| u4   | attribute_length     | 1                | 属性长度   |
| u1   | info                 | attribute_length | 属性表     |

只需说明属性的名称以及占用位数的长度即可，属性表具体的结构可以去自定义

> **属性类型**

属性表实际上可以有很多类型，上面看到的`Code`属性只是其中一种，`Java8`里面定义了23中属性，下面这些属性是虚拟机中预定义的属性

| 属性名称                            | 使用位置           | 含义                                                         |
| ----------------------------------- | ------------------ | ------------------------------------------------------------ |
| Code                                | 方法表             | Java代码编译成的字节码指令                                   |
| ConstantValue                       | 字段表             | final关键字定义的常量池                                      |
| Deprecated                          | 类、方法，字段表   | 被声明为deprecated的方法和字段                               |
| Exceptions                          | 方法表             | 方法抛出的异常                                               |
| EnclosingMethod                     | 类文件             | 仅当一个类为局部类或者匿名类时才能拥有这个属性，这个属性用于标识这个类所在的外围方法 |
| InnerClass                          | 类文件             | 内部类列表                                                   |
| LineNumberTable                     | Code属性           | Java源码的行号与字节码指令的对应关系                         |
| LocalVariableTable                  | Code属性           | 方法的局部变量描述                                           |
| StackMapTable                       | Code属性           | JDK1.6中新增的属性，提供新的类型检查检验器和处理目标方法的局部变量和操作数与所需要的类是否匹配 |
| Signature                           | 类，方法表，字段表 | 用于支持泛型情况下的方法签名                                 |
| SourceFile                          | 类文件             | 记录源文件名称                                               |
| SourceDebugExtension                | 类文件             | 用于存储额外的调试信息                                       |
| Synthetic                           | 类，方法表，字段表 | 标志方法或字段为编译器自动生成的                             |
| LocalVariableTypeTable              | 类                 | 使用特征签名代替描述符，是为了引入泛型语法之后能描述泛型参数化类型而添加的 |
| RuntimeVisibleAnnotations           | 类，方法表，字段表 | 为动态注解提供支持                                           |
| RuntimeInvisibleAnnotations         | 类，方法表，字段表 | 用于指明哪些注解是运行时不可见的                             |
| RuntimeVisibleParameterAnnotation   | 方法表             | 作用与RuntimeVisibleAnnotations属性类似，只不过作用对象为方法 |
| RuntimeInvisibleParameterAnnotation | 方法表             | 作用与RuntimeInvisibleAnnotations属性类似，作用对象哪个为方法参数 |
| AnnotationDefault                   | 方法表             | 用于记录注解类元素的默认值                                   |
| BootstrapMethods                    | 类文件             | 用于保存invokeddynamic指令引用的引导方法限定符               |

> **Code属性**

`Code`属性就是存放方法体里面的代码。但是，并非所有方法表都有`Code`属性。像接口或者抽象方法，它们没有具体的方法体，因此也就不会有`Code`属性了

| 类型           | 名称                   | 数量             | 含义                   |
| -------------- | ---------------------- | ---------------- | ---------------------- |
| u2             | attribute_name_index   | 1                | 属性名索引             |
| u4             | attribute_length       | 1                | 属性长度               |
| u2             | max_stack              | 1                | 操作数栈深度的最大值   |
| u2             | max_locals             | 1                | 局部变量所需的存续空间 |
| u4             | code_length            | 1                | 字节码指令的长度       |
| u1             | code                   | code_length      | 存储字节码指令         |
| u2             | exception_table_length | 1                | 异常表长度             |
| exception_info | exception_table        | exception_length | 异常表                 |
| u2             | attributes_count       | 1                | 属性集合计数器         |
| attribute_info | attributes             | attributes_count | 属性集合               |

### 1.3 javap的使用

#### 1.3.1 javac

解析字节码文件得到的信息中，有些信息(如局部变量表，指令和代码偏移量映射表、常量池中方法的参数名称等等)需要在使用`javac`编译成`class`文件时，指定参数才能输出

比如：`javac xx.java`，就不会生成对应的局部变量表信息，如果使用`javac -g xx.java`就可以生成所有相关的信息了

#### 1.3.2 javap的参数

格式

```
javap [options] xx.class
```

具体的参数

```shell
-version 	# 当前JDK的版本
-public 	# 仅显示公共类和成员
-protected	# 显示受保护的/公共类和成员
-p/-private	# 显示所有类和成员
-package	# 显示程序包/受保护的/公共类和成员(默认)
-sysinfo	# 显示正在处理的类的系统信息(路径、大小、日期、MD5，散列，源文件名)

-s			# 输出内部类型签名
-l			# 输出行号和本地变量表
-c			# 对代码进行反汇编
-v/-verbose # 输出附加信息
```

## 2. 字节码指令

`Java`字节码对于虚拟机，就好像汇编语言对于计算机，属于基本执行指令

`Java`虚拟机的指令由**一个字节**长度、代表着某种特定操作含义的数字(操作码)以及紧跟其后的零或多个代表此操作所需的参数(称为操作数)而构成。由于`Java`虚拟机采用面向操作数栈而不是寄存器的结构，所以大多数指令都不包含操作数，只有一个操作码

由于限制了`Java`虚拟机操作码的长度为一个字节(即0~255)，这意味着指令集的操作码总数不可能超过256条

[官方地址](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)

### 2.1 概述

在`Java`虚拟机的指令集中，大多数的指令都包含了其操作所对应的数据类型信息。例如，`iload`指令用于从局部变量表中加载`int`型的数据到操作数栈中，而`fload`指令加载的则是`float`类型的数据

对于大部分与数据类型相关的字节码指令，它们的操作码助记符中都有特殊的字符来表明专门为哪种数据类型服务

1. `i`代表对`int`类型的数据操作
2. `l`代表`long`
3. `s`代表`short`
4. `b`代表`byte`
5. `c`代表`char`
6. `f`代表`float`
7. `d`代表`double`
8. `a`引用类型

也有一些指令的助记符中没有明确地指明操作类型的字母，如`arraylength`指令，它没有代表数据类型的特殊字符，但操作数永远只能是一个数组类型的对象

还有另外一些指令，如无条件跳转指令`goto`则是与数据类型无关的

大部分的指令都没有支持数据类型`byte`、`char`和`short`，甚至没有任何指令支持`boolean`类型。编译器会在编译期或运行期将`byte`和`short`类型的数据待符号扩展`Sign-Extend`为相应的`int`类型数据，将`boolean`和`char`类型数据零位扩展`Zero-Extend`为相应的`int`类型数据。与之相似，在处理`boolean`、`byte`、`short`和`char`类型的数组时，也会转换为使用对应的`int`类型的字节码指令来处理。因此，大多数对于`boolean`、`byte`、`short`、`char`类型数据的操作，实际上都使用相应的`int`类型作为运算符类型

> **指令分类**

按用途大致分为9类

- 加载与存储指令
- 算术指令
- 类型转换指令
- 对象的创建与访问指令
- 方法调用与返回指令
- 操作数栈管理指令
- 比较控制指令
- 异常处理指令
- 同步控制指令

一个指令，可以从局部变量表、常量池、堆中对象、方法调用、系统调用中取得数据，这些数据(可能是指，可能是对象的引用)被压入操作数栈

一个指令，也可以从操作数栈中国年取出一到多个值(`pop`多次)，完成赋值、加减乘除、方法传参、系统调用等等操作

### 2.2 加载与存储指令

**作用**：加载和存储指令用于将数据从栈帧的局部变量表和操作数栈之间来回传递

**常用指令**

1. 局部变量压栈指令：将一个局部变量加载到操作数栈：`xload`、`xload_<n>`(其中`x`为`i`、`l`、`f`、`d`、`a`、`n`为`0~3`)
2. 常用入栈指令：将一个常量加载到操作数栈：`bipush`、`sipush`、`ldc`、`ldc_w`、`ldc2_w`、`aconst_null`、`iconst_m1`、`iconst_<i>`、`fconst_<f>`、`dconst_<d>`
3. 出栈装入局部变量表指令：将一个数值从操作数栈存储到局部变量表中：`xstore`、`xstore_<n>`(其中`x`为`i`、`l`、`f`、`d`、`a`、`n`为`0~3`)；`xastore`(其中`x`为`i`、`l`、`f`、`d`、`a`、`b`、`c`、`s`)
4. 扩充局部变量表的访问索引的指令`wide`

#### 2.2.1 局部变量压栈指令

`load`局部变量压栈指令：将给定的局部变量表中的数据压入栈中

测试方法

```java
public void load(int num, Object obj, long count, boolean flag, short[] arr) {
    System.out.println(num);
    System.out.println(obj);
    System.out.println(count);
    System.out.println(flag);
    System.out.println(arr);
}
```

对应的字节码

```asm
 0 getstatic 		#2 <java/lang/System.out>
 3 iload_1				# 将num加载到栈中
 4 invokevirtual 	#3 <java/io/PrintStream.println>
 7 getstatic 		#2 <java/lang/System.out>
10 aload_2				# 将obj加载到栈中
11 invokevirtual 	#4 <java/io/PrintStream.println>
14 getstatic 		#2 <java/lang/System.out>
17 lload_3				# 将count加载到栈中
18 invokevirtual 	#5 <java/io/PrintStream.println>
21 getstatic 		#2 <java/lang/System.out>
24 iload 5				# 将flag加载到栈中
26 invokevirtual 	#6 <java/io/PrintStream.println>
29 getstatic 		#2 <java/lang/System.out>
32 aload 6				# 将数组arr加载到栈中
34 invokevirtual 	#4 <java/io/PrintStream.println>
37 return
```

局部变量表

![](https://gitee.com/dingwanli/picture/raw/master/20210605102015.png)

#### 2.2.2 常量入栈指令

常量入栈指令的功能是将常数压入操作数栈，根据数据类型和入栈内容的不同，又可以分为`const`系列、`push`系列和`ldc`指令

指令`const`系列：拥有对特定的常量入栈，入栈的常量隐含在指令本身里。指令有：`iconst_<i>`(`i`的范围为`-1~5`)、`lconst_<1>`(`l`的范围`0~1`)、`fconst_<f>`(`f`的范围`0~2`)、`dconst_<d>`(`d`的范围`0~1`)、`aconst_null`

比如，

1. `inconst_m1`将`-1`压入栈

2. `inconst_x`(`x`的范围为`0~5`)将`x`压入栈

3. `lconst_0`、`lconst_1`分别将长整数`0`和`1`压入栈
4. `fconst_0`、`fconst_1`、`fconst_2`分别将浮点数`0~2`压入栈
5. `dconst_0`和`dconst_1`分别将`double`型的`0`和`1`入栈
6. `aconst_null`将`null`压入操作数栈

从指令的命名上不难找出规律，指令助记符的第一个字符总喜欢表示数据类型，`i`表示整数，`l`表示长整数，`f`表示浮点数，`d`表示双精度浮点，习惯上用`a`表示对象引用。如果指令隐含操作的参数，会以下划线的形式给出

指令`push`系列：主要包括`bipush`和`sipush`。它们的区别在于接收数据类型的不同，`bipush`接受8位整数作为参数，`sipush`接受16位整数，它们都将参数压入栈

指令`ldc`系列：如果以上指令都不能满足需求，则可以使用万能的`ldc`指令，它可以接受一个8位的参数，该参数指向常量池中的`int`、`float`或者`String`的索引，将指定的内容压入堆栈

| 类型                            | 常数指令 | 范围                          |
| ------------------------------- | -------- | ----------------------------- |
| int(boolean, byte, char, short) | iconst   | [-1,5]                        |
|                                 | bipush   | [-128,127]                    |
|                                 | sipush   | [-32768,32767]                |
|                                 | ldc      | 任何数据                      |
| long                            | lconst   | 0, 1                          |
|                                 | ldc      | 任何数据                      |
| double                          | dconst   | 0, 1                          |
|                                 | ldc      | 任何数据                      |
| reference                       | aconst   | null                          |
|                                 | ldc      | String literal, Class literal |

整型

```java
public void pushConstLdc() {
    int a = 5;
    int b = 6;
    int c = 127;
    int d = 128;
    int e = 32767;
    int f = 32768;
}
```

字节码

```asm
 0 iconst_5
 1 istore_1
 2 bipush 6
 4 istore_2
 5 bipush 127
 7 istore_3
 8 sipush 128
11 istore 4
13 sipush 32767
16 istore 5
18 ldc #7 <32768>
20 istore 6
22 return
```

长整型

```java
public void constLdc() {
    long a1 = 1;
    long a2 = 2;
    float b1 = 2;
    float b2 = 3;
    double c1 = 1;
    double c2 = 2;
    Date date = null;
}
```

字节码

```asm
 0 lconst_1
 1 lstore_1
 2 ldc2_w #8 <2>
 5 lstore_3
 6 fconst_2
 7 fstore 5
 9 ldc #10 <3.0>
11 fstore 6
13 dconst_1
14 dstore 7
16 ldc2_w #11 <2.0>
19 dstore 9
21 aconst_null
22 astore 11
24 return
```

#### 2.2.3 出栈装入局部变量表指令

出栈装入局部变量表指令用于将操作数栈中栈顶元素弹出后，装入局部变量表的指定位置，用于给出局部变量赋值

这类指令主要以`store`的形式存在，比如`xstore`(`x`为`i`、`l`、`d`、`a`)、`xstore_n`(`x`为`i`、`l`、`f`、`d`、`a`、`n`的范围为`0~3`)

- 其中，指令`istore_n`将从操作数栈中弹出一个整数，并把它赋值给局部变量索引`n`位置
- 指令`xstore`由于没有隐含参数信息，故需要提供一个`byte`类型的参数类指定目标局部变量表的位置

> **说明**

一般来说，类似像`store`这样的命令需要带一个参数，用来指明将弹出的元素放在局部变量表的第几个位置。但是，为了尽可能压缩指令的大小，使用专门的`istore_1`指令表示将弹出的元素放置在局部变量表第一个位置。类似的还有`istore_0`、`istore_2`、`istore_3`，他们分表表示从操作数栈顶弹出一个元素，存放在局部变量表第`0`、`2`、`3`个位置

由于局部变量表前几个位置总是非常常用，因此这种做法虽然增加了指令的数量，但是可以大大压缩生成的字节码的体积。如果局部变量表很大，需要存储的槽位大于3，那么可以使用`istore`指令，另加一个参数，用来表示需要存放的槽位位置

> **示例**

```java
public void store(int k, double d) {
    int m = k + 2;
    long l = 12;
    String str = "Hello World";
    float f = 10.0F;
    d = 10;
}
```

字节码

```asm
 0 iload_1
 1 iconst_2
 2 iadd
 3 istore 4
 5 ldc2_w #13 <12>
 8 lstore 5
10 ldc #15 <Hello World>
12 astore 7
14 ldc #16 <10.0>
16 fstore 8
18 ldc2_w #17 <10.0>
21 dstore_2
22 return
```

### 2.3 算术指令

算术指令用于对两个操作数栈上的值进行某种特定的运算，并把结果重新压入操作数栈。大体上算术指令可以分为两种：对整型数据进行运算的指令与对浮点类型数据进行运算的指令

**类型说明**：在每一 大类中，都有针对`Java`虚拟机具体数据类型的专用运算指令。但没有直接支持`byte`、`short`、`char`和`boolean`类型的算术指令，对于这些数据的运算，都使用`int`类型的指令来处理。此外，在处理`boolean`、`byte`、`short`和`char`类型的数组时，也会转换为使用对应的`int`类型的字节码指令来处理

| 实际类型      | 运算符类型    | 分类 |
| ------------- | ------------- | ---- |
| boolean       | int           | 一   |
| byte          | int           | 一   |
| char          | int           | 一   |
| short         | int           | 一   |
| int           | int           | 一   |
| float         | float         | 一   |
| reference     | reference     | 一   |
| returnAddress | returnAddress | 一   |
| long          | long          | 二   |
| double        | double        | 二   |

**运算时的溢出**：数据运算可能会导致溢出，例如两个很大的正整数相加，结果可能是一个负数。其实`Java`虚拟机规范并无明确规定过整型数据溢出的具体结果，仅规定了在处理整型数据时，只有除法指令以及求余指令中出现除数为0时会导致虚拟机抛出异常`ArithmeticException`

**运算模式**

1. 向最接近数舍入模式：`JVM`要求在进行浮点数计算时，所有的运算结果都必须舍入到适当的精度，非精确结果必须舍入为可表示的最接近的精确值，如果有两种可表示的形式与该值一样接近，将优先选择最低有效位为零的
2. 向零舍入模式：将浮点数转换为整数时，采用该模式，该模式将在目标数值类型中选择一个最接近但是不大于原值的数字作为最精确的舍入结果

**NaN值的使用**：当一个操作产生溢出时，将会使用有符号的无穷大表示，如果某个操作没有明确的数学定义的话，将会使用`NaN`值来表示。而且所有使用`NaN`值作为操作数的算术操作，结果都会返回`NaN`

```java
@Test
@DisplayName("测试运算溢出")
public void method() {
    double num1 = 10 / 0.0;
    System.out.println(num1); // Infinity 无穷大

    double num2 = 0.0 / 0.0;
    System.out.println(num2); // NaN
}
```

| 分类         | 符号                                 |
| ------------ | ------------------------------------ |
| 加法指令     | iadd、ladd、fadd、dadd               |
| 减法指令     | isub、lsub、fsub、dsub               |
| 乘法指令     | imul、lmul、fmul、dmul               |
| 除法指令     | idiv、ldiv、fdiv、ddiv               |
| 求余指令     | irem、lrem、frem、drem               |
| 取反指令     | ineg、lneg、fneg、dneg               |
| 自增指令     | iinc                                 |
| 位移指令     | ishl、ishr、iushr、lshl、lshr、lushr |
| 按位或指令   | ior、lor                             |
| 按位与指令   | iand、land                           |
| 按位异或指令 | ixor、lxor                           |
| 比较指令     | dcmpg、dcmpl、fcmpg、fcmpl、lcmp     |

#### 2.3.1 示例

```java
public void method() {
    int i = 100;
    i = i + 10;
}
```

对应的字节码

```asm
0 bipush 100
2 istore_1
3 iload_1
4 bipush 10
6 iadd
7 istore_1
8 return
```

```java
public void method() {
    int i = 100;
    i += 10;
}
```

对应的字节码

```java
0 bipush 100
2 istore_1
3 iinc 1 by 10
6 return
```

#### 2.3.2 ++操作

1. 不涉及运算，前置++和后置++相同

    ```java
    public void method1() {
        int i = 10;
        i++;
    }
    ```

    字节码

    ```asm
    0 bipush 10
    2 istore_1
    3 iinc 1 by 1
    6 return
    ```

2. 覆盖情况

    ```java
    public void method2() {
        int i = 10;
        i = i++;
        System.out.println(i); // 10
    }
    ```

    字节码

    ```asm
     0 bipush 10
     2 istore_1
     3 iload_1
     4 iinc 1 by 1
     7 istore_1
     8 getstatic #2 <java/lang/System.out>
    11 iload_1
    12 invokevirtual #3 <java/io/PrintStream.println>
    15 return
    ```

#### 2.3.3 比较指令

> **说明**

- 比较指令的作用是比较栈顶两个元素的大小，并将比较结果入栈
- 对于`double`和`float`类型的数字，由于`NaN`的存在，各有两个版本的比较指令。以`float`为例，有`fcmpg`和`fcmpl`两个指令，它们的区别在于数字比较时，若遇到`NaN`值，处理结果不同。`double`的`fcmpg`和`dcmpl`类似
- 指令`lcmp`针对`long`型整数，由于`long`型整数没有`NaN`值，故无需准备两套指令

> **举例**

指令`fcmpl`和`fcmpg`都从占中弹出两个操作数，并将它们做比较，设栈顶的元素为`v2`，栈顶顺序第二位的元素为`v1`，若`v1=v2`，则压入0；若`v1<v2`则压入`-1`。

两个指令的不同之处在于，如果遇到`NaN`值，`fcmpg`会压入1，而`fcmpl`会压入-1

```java
public void compare(double d1, double d2) {
    if (d1 > d2) {
        d1 = 20;
    } else {
        d2 = 20;
    }
}
```

对应的字节码

```asm
 0 dload_1
 1 dload_3
 2 dcmpl
 3 ifle 13 (+10)
 6 ldc2_w #6 <20.0>
 9 dstore_1
10 goto 17 (+7)
13 ldc2_w #6 <20.0>
16 dstore_3
17 return
```

### 2.4 类型转换指令

类型转换指令可以将两种不同的数值类型进行相互转换

这些转换操作一般用于实现用户代码中的**显式类型转换**操作，或者用来处理字节码指令集中数据类型相关指令无法与数据类型一一对应的问题

#### 2.4.1 宽化类型转换

宽化类型转换`Widening Numeric Conversions`

> **转换规则**

`Java`虚拟机直接支持以下数值的宽化类型转换(小范围类型向大范围类型的安全转换)。并不需要指令执行

- 从`int`类型到`long`、`float`或者`double`类型。对应的指令为：`i2l`、`i2f`、`i2d`
- 从`long`类型到`float`、`double`类型。对应的指令为：`l2f`、`l2d`
- 从`float`类型到`double`类型。对应的指令为：`f2d`

```java
public void upCast() {
    int i = 10;
    long l = i;
    float f = i;
    double d = i;

    float f1 = l;
    double d1 = l;

    double d2 = f1;
}
```

对应字节码

```asm
 0 bipush 10
 2 istore_1
 3 iload_1
 4 i2l
 5 lstore_2
 6 iload_1
 7 i2f
 8 fstore 4
10 iload_1
11 i2d
12 dstore 5
14 lload_2
15 l2f
16 fstore 7
18 lload_2
19 l2d
20 dstore 8
22 fload 7
24 f2d
25 dstore 10
27 return
```

> **精度损失问题**

宽化类型转化是不会因为超过目标类型最大值而丢失信息，例如，从`int`转换到`long`，或者从`int`转换到`double`，都不会丢失任何信息，转换前后的值是精确相等的

从`int`、`long`类型数值转换到`float`，或者`long`类型数值转换到`double`时，可能会发生精度丢失，转换后的浮点数值是根据`IEEE754`最接近舍入模式所得的正确整数值

尽管宽化类型转换实际上是可能发生精度丢失的，但是这种转化永远不会导致`Java`虚拟机抛出运行时异常

> **补充说明**

从`byte`、`char`和`short`类型到`int`类型的宽化类型转换实际上是不存在的。对于`byte`类型转换为`int`，虚拟机并没有做实质性的转换处理，只是简单地通过操作数栈交换了两个数据。而将`byte`转换为`long`时，使用的是`i2l`，可以看到内部`byte`在这里已经等同于`int`类型处理，类似的还有`short`类型，这种处理方式有两个特点

1. 可以减少实际的数据类型，如果为`short`和`byte`都准备一套指令，那么指令的数量就会大增，而虚拟机目前的设计上，只愿意使用一个字节来表示指令，因此指令的总数不能超过256个，为了节省指令资源，将short和byte当做int处理也在情理之中
2. 由于局部变量表中的槽位固定为32位，无论是byte或者short存入局部变量表，都会占用32位空间，从这个角度来说，也没有必要特意区分这几种数据类型

```java
public void upCast(byte b) {
    int i = b;
    long l = b;
    double d = b;
}
```

对应的字节码

```asm
0 iload_1
1 istore_2
2 iload_1
3 i2l
4 lstore_3
5 iload_1
6 i2d
7 dstore 5
9 return
```

#### 2.4.2 窄化类型转换

窄化类型转换`Narrowing Numeric Conversion`

> **转换规则**

`Java`虚拟机支持以下的窄化类型转换

1. 从`int`类型至`byte`、`short`和`char`类型。对应的指令有：`i2b`、`i2c`、`i2s`
2. 从`long`类型到`int`类型。对应的指令有`l2i`
3. 从`float`类型到`int`或者`long`类型。对应的指令有`f2i`、`f2l`
4. 从`double`类型到`int`、`long`或者`float`类型。对应的指令有：`d2i`、`d2l`、`d2f`

示例

```java
public void downCast(int i) {
    byte b = (byte) i;
    short s = (short) i;
    char c = (char) i;

    long l = 10L;
    int i1 = (int)l;
    byte b1 = (byte) l;
}
```

对应字节码

```asm
 0 iload_1
 1 i2b
 2 istore_2
 3 iload_1
 4 i2s
 5 istore_3
 6 iload_1
 7 i2c
 8 istore 4
10 ldc2_w #4 <10>
13 lstore 5
15 lload 5
17 l2i
18 istore 7
20 lload 5
22 l2i
23 i2b
24 istore 8
26 return
```

从上述可以看出，`long`转换为`byte`的话需要先转换成`int`再从`int`转换为`byte`

> **精度损失问题**

窄化类型转换可能会导致转换结果具备不同的正负号、不同的数量级，因此，转换过程很可能会导致数值丢失精度

尽管数据类型窄化可能会发生上限溢出、下限溢出和精度丢失等问题，但是`Java`虚拟机规范中明确规定数值类型的窄化转换指令永远不可能导致虚拟机抛出运行时异常

> **补充说明**

当一个浮点值窄化转换为整数类型`T`(`T`限于`int`或`long`类型之一)的时候，将遵循以下转换规则

1. 如果浮点值是`NaN`，那结果就是`int`或者`long`类型的`0`
2. 如果浮点值不是无穷大的话，浮点值使用`IEEE754`的向零舍入模式取整，获得整数值`v`，如果`v`在目标类型`T`(`int`或`long`)的表示范围之内，那转换结构就是`v`。否则，将根据`v`的符号，转换为`T`所能表示的最大或者最小整数

当一个`double`类型转换为`float`类型时，将遵循以下转换规则，通过向最接近数舍入模式舍入一个可以使用`float`类型表示的数字。最后结果根据下面3条规则判断

1. 如果转换结果的绝对值太小而无法使用`float`来表示，将返回的`float`类型的正负零
2. 如果转换结果的绝对值太大而无法使用`float`来表示，将返回的`float`类型的正负无穷大
3. 对于`double`类型的`NaN`值将按规定转换为`float`类型的`NaN`值

```java
@Test
public void downCast() {
    double d1 = Double.NaN;

    int i = (int) d1;

    float f = (float) d1;        // NaN
    System.out.println(f);
    System.out.println(i);      // 0

    double d2 = Double.POSITIVE_INFINITY;
    long l = (long) d2;
    int j = (int) d2;
    float f1 = (float) d2;
    System.out.println(l);      // 9223372036854775807
    System.out.println(j);      // 2147483647
    System.out.println(f1);     // Infinity
}
```

### 2.5 对象的创建与访问指令

`Java`是面向对象的程序设计语言，虚拟机平台从字节码底层就对面向对象做了深层次的支持。有一系列指令专门用于对象操作，可进一步细分为创建指令、字段访问指令、数组操作指令

#### 2.5.1 创建指令

虽然类实例和数组都是对象，但`Java`虚拟机对类实例和数组的创建与操作使用了不同的字节码指令

> **创建类实例的指令**

`new`它接受一个操作数，为指向常量池的索引，表示要创建的类型，执行完成后，将对象的引用压入栈

```java
public void method() {
    Object obj = new Object();

    File file = new File("test.txt");
}
```

对应的字节码

```asm
 0 new 				#2 <java/lang/Object>
 3 dup					# 复制一份放入操作数栈中
 4 invokespecial 	#1 <java/lang/Object.<init>>
 7 astore_1
 8 new 				#3 <java/io/File>
11 dup
12 ldc 				#4 <test.txt>
14 invokespecial 	#5 <java/io/File.<init>>
17 astore_2
18 return
```

> **创建数组的指令**

1. `newarray`：创建基本类型数组
2. `anewarray`：创建引用类型数组
3. `multianewarray`：创建多维数组

上述创建指令可以用于创建对象或者数组，由于对象和数组在`Java`中的广泛使用，这些指令的使用频率也非常高

```java
public void method() {
    int[] intArray = new int[10];
    Object[] objArray = new Object[10];
    int[][] minArray = new int[10][10];
    String[][] strArray = new String[10][];
}
```

对应的字节码

```asm
 0 bipush 10
 2 newarray 10 (int)
 4 astore_1
 5 bipush 10
 7 anewarray #2 <java/lang/Object>
10 astore_2
11 bipush 10
13 bipush 10
15 multianewarray #6 <[[I> dim 2
19 astore_3
20 bipush 10
22 anewarray #7 <[Ljava/lang/String;>
25 astore 4
27 return
```

#### 2.5.2 字段访问指令

对象创建后，就可以通过对象访问指令获取对象实例或数组实例中的字段或者数组元素。

- 访问类字段(`static`字段，或者称为类变量)的指令：`getstatic`、`putstatic`
- 访问类实例字段(非`static`字段，或者称为实例变量)的指令：`getfield`、`putfield`

> **静态字段**

`out`是`System`中的一个静态字段

```java
public void sayHello() {
    System.out.println("hello");
}
```

字节码

```asm
0 getstatic #8 <java/lang/System.out>
3 ldc #9 <hello>
5 invokevirtual #10 <java/io/PrintStream.println>
8 return
```

> **非静态字段**

```java
public FieldTest{    
	public void setOrderId() {
        Order order = new Order();
        order.id = 1001;

        System.out.println(order.id);

        Order.name = "ORDER";
        System.out.println(Order.name);
    }
}

class Order{
    int id;
    static String name;
}
```

字节码

```asm
 0 new #11 <com/valid/Order>
 3 dup
 4 invokespecial #12 <com/valid/Order.<init>>
 7 astore_1
 8 aload_1
 9 sipush 1001
12 putfield #13 <com/valid/Order.id>
15 getstatic #8 <java/lang/System.out>
18 aload_1
19 getfield #13 <com/valid/Order.id>
22 invokevirtual #14 <java/io/PrintStream.println>
25 ldc #15 <ORDER>
27 putstatic #16 <com/valid/Order.name>
30 getstatic #8 <java/lang/System.out>
33 getstatic #16 <com/valid/Order.name>
36 invokevirtual #10 <java/io/PrintStream.println>
39 return
```

#### 2.5.3 数组操作指令

数组操作指令主要有：`xastore`和`xaload`指令。具体为：

1. 把一个数组元素加载到操作数栈的指令：`baload`、`caload`、`saload`、`iaload`、`laload`、`faload`、`daload`、`aaload`
2. 将一个操作数栈的值存储到数组元素中的指令：`bastore`、`castore`、`sastore`、`iastore`、`lastore`、`fastore`、`dastore`、`aastore`

| 数组类型      | 加载指令 | 存储指令 |
| ------------- | -------- | -------- |
| byte(boolean) | baload   | bastore  |
| char          | caload   | castore  |
| short         | saload   | sastore  |
| int           | iastore  | iastore  |
| long          | laload   | lastore  |
| float         | faload   | fastore  |
| double        | daload   | dastore  |
| reference     | aaload   | aastore  |

取数组长度的指令：`arraylength`，该指令弹出栈顶的数组元素，获取数组的长度，将长度压入栈

> **说明**

指令`xaload`表示将数组的元素压栈，比如`saload`、`caload`分别表示压入`short`数组和`char`数组。指令`xaload`在执行时，要求操作数中栈顶元素为数组索引`i`，栈顶顺位第2个元素为数组引用a，该指令 会弹出栈顶这两个元素，并将`a[i]`重新压入堆栈

`xastore`则专门针对数组进行操作，以`iastore`为例，它用于给一个`int`数组的给定索引赋值。在`iastore`执行前，操作数栈顶需要以此准备3个元素：值、索引、数组引用，`iastore`会弹出这3个值，并将值赋给数组中指定索引的位置

```java
public void setArray() {
    int[] intArray = new int[10];
    intArray[3] = 20;
    System.out.println(intArray[1]);
}
```

对应的字节码

```asm
 0 bipush 10
 2 newarray 10 (int)
 4 astore_1
 5 aload_1
 6 iconst_3
 7 bipush 20
 9 iastore
10 getstatic #8 <java/lang/System.out>
13 aload_1
14 iconst_1
15 iaload
16 invokevirtual #14 <java/io/PrintStream.println>
19 return
```

#### 2.5.4 类型检查指令

检查类实例或数组类型的指令：`instanceof`、`checkcast`

1. 指令`checkcast`用于检查类型强制转换是否可以进行。如果可以进行，那么`checkcast`指令不会改变操作数栈，否则它会抛出`ClassCastException`异常
2. 指令`instanceof`用来判断给定对象是否是某一个类的实例，它会将判断结果压入操作数栈

```java
public String checkCast(Object obj) {
    if (obj instanceof String) {
        return (String) obj;
    }
    return null;
}
```

字节码

```asm
 0 aload_1
 1 instanceof #17 <java/lang/String>
 4 ifeq 12 (+8)
 7 aload_1
 8 checkcast #17 <java/lang/String>
11 areturn
12 aconst_null
13 areturn
```

### 2.6 方法调用与返回指令

#### 2.6.1 方法调用指令

`invokevirtual`指令用于调用对象的实例方法，根据对象的实际类型进行分派(虚方法分派)，支持多态。这也是`Java`语言中最常用的方法分配方式

> **invokeinterface**

`invokeinterface`指令用于调用接口方法，它会在运行时搜索由特定对象所实现的这个接口方法，并找出适合的方法进行调用。接口中默认方法依然是`invoketerface`，但是如果是接口中的静态方法则是`invokestatic`

```java
public class MethodInvokeReturnTest {
    // invokeinterface
    public void invoke() {
        Thread thread = new Thread();
        ((Runnable) thread).run();

        Comparable<Integer> com = null;
        com.compareTo(123);
    }
}
```

`invoke`对应的字节码

```asm
 0 new #4 <java/lang/Thread>
 3 dup
 4 invokespecial #5 <java/lang/Thread.<init>>
 7 astore_1
 8 aload_1
 9 invokeinterface #9 <java/lang/Runnable.run> count 1
14 aconst_null
15 astore_2
16 aload_2
17 bipush 123
19 invokestatic #10 <java/lang/Integer.valueOf>
22 invokeinterface #11 <java/lang/Comparable.compareTo> count 2
27 pop
28 return
```

> **invokespecial静态分派**

`invokespecial`指令用于调用一些需要特殊处理的实例方法，包括实例初始方法构造器、私有方法和父类方法。这些方法都是静态类型绑定的，不会调用时进行动态派发

```java
public class MethodInvokeReturnTest {
    // 方法调用指令：invokespecial
    public void invoke() {
        // 类实例构造方法 <init>
        Date date = new Date();
        Thread thread = new Thread();
        
        // 父类方法
        super.toString();
        // 私有方法
        methodPrivate();
    }
    
    private void methodPrivate() {
        
    }
}
```

`invoke`方法对应的字节码

```asm
 0 new #2 <java/util/Date>
 3 dup
 4 invokespecial #3 <java/util/Date.<init>>
 7 astore_1
 8 new #4 <java/lang/Thread>
11 dup
12 invokespecial #5 <java/lang/Thread.<init>>
15 astore_2
16 aload_0
17 invokespecial #6 <java/lang/Object.toString>
20 pop
21 aload_0
22 invokespecial #7 <com/valid/MethodInvokeReturnTest.methodPrivate>
25 return
```

> **invokestatic静态分派**

`invokestatic`指令用于调用命名类中的类方法(`static`方法)。这是静态绑定的

```java
public class MethodInvokeReturnTest {
    public void invoke() {
        methodStatic();
    }
    public static void methodStatic() {

    }
}
```

`invoke`方法对应字节码

```asm
0 invokestatic #8 <com/valid/MethodInvokeReturnTest.methodStatic>
3 return
```

`invokedynamic`调用动态绑定的方法，这个是`JDK7`后新加入的指令。用于在运行时动态解析出调用点限定符所引用的方法，并执行该方法。前面4条调用指令的分派逻辑都固化在`Java`虚拟机内部，而`invokedynamic`指令的分派逻辑是由用户所设定的引导方法决定的

#### 2.6.2 方法返回指令

方法调用结束前，需要进行返回。方法返回指令是根据返回值的类型区分的

- 包括`ireturn`(当返回值是`boolean`、`byte`、`char`、`char`、`short`和`int`类型时调用)、`lreturn`、`freturn`、`dreturn`和`areturn`
- 另外还有一条`return`指令供声明为`void`的方法、实例初始化方法及类和接口的类初始化方法使用

| 返回类型                        | 返回指令 |
| ------------------------------- | -------- |
| void                            | return   |
| int(boolean, byte, char, short) | ireturn  |
| long                            | lreturn  |
| float                           | freturn  |
| double                          | dreturn  |
| reference                       | areturn  |

通过`ireturn`指令，将当前函数操作数栈的顶层元素弹出，并将这个元素压入调用者函数的操作数栈中(因为调用者非常关心函数的返回值)，所有在当前函数操作数栈中的其他元素都会被丢弃

如果当前返回的是`synchronized`方法，那么还会执行一个隐含的`monitorexit`指令，退出临界区。

最后才会丢弃这个栈帧，返回调用者

### 2.7 操作数栈管理指令

如同操作一个普通数据结构中的堆栈那样，`JVM`提供的操作数栈管理指令，可以用于直接操作操作数栈的指令

这类指令包含如下内容

- 将一个或两个元素从栈顶弹出，并且直接废弃：`pop`、`pop2`

    ```java
    public void print() {
        Object obj  =new Object();
        obj.toString();
    }
    ```

    对应的字节码

    ```asm
     0 new #2 <java/lang/Object>
     3 dup
     4 invokespecial #1 <java/lang/Object.<init>>
     7 astore_1
     8 aload_1
     9 invokevirtual #3 <java/lang/Object.toString>
    12 pop
    13 return
    ```

- 复制栈顶一个或两个数值并将复制值或双份的复制值重新压入栈顶：`dup`、`dup2`、`dup_x1`、`dup2_x1`、`dup_x2`、`dup2_x2`

    ```java
    public void print() {
        Object obj  =new Object();
        String info = obj.toString();
    }
    ```

    对应的字节码

    ```asm
     0 new #2 <java/lang/Object>
     3 dup
     4 invokespecial #1 <java/lang/Object.<init>>
     7 astore_1
     8 aload_1
     9 invokevirtual #3 <java/lang/Object.toString>
    12 astore_2
    13 return
    ```

- 将栈最顶端的两个`Slot`数值位置交换：`swap`，`Java`虚拟机没有提供交换两个64位数据类型(`long`、`double`)数值的指令

- 指令`nop`，是一个非常特殊的指令，它的字节码为`0x00`。和汇编语言中的`nop`一样，它表示什么都不做。这条指令一般用于调试、占位等

这些指令属于通用型，对栈的压入或者弹出无需指明数据类型

> **说明**

不带`_x`的指令是复制栈定数据并压入栈顶。包括两个指令，`dup`和`dup2`。`dup`的系数代表要复制的`Slot`个数

- `dup`开头的指令用于复制一个`Slot`的数据。例如1个`int`或1个`reference`类型数据
- `dup2`开头的指令用于复制`2`个`Slot`的数据。例如1个`long`，或2个`int`，或1个`int`+1个

带`_x`的指令是复制栈顶数据并插入栈顶以下的某个位置。共有四个指令，`dup_x1`，`dup2_x1`，`dup_x2`，`dup2_x2`，对于带`_x`的复制插入指令，只要将指令的`dup`和`x`的系数相加，结果即为需要插入的位置。因此

- `dup_x1`插入位置：`1+1=2`，即栈顶2个`Slot`下面
- `dup_x2`插入位置：`1+2=3`，即栈顶3个`Slot`下面
- `dup2_x1`插入位置：`2+1=3`，即栈顶3个`Slot`下面
- `dup2_x2`插入位置：`2+2=4`，即栈顶4个`Slot`下面

`pop`：将栈顶的1个`Slot`数值出栈。例如1个`short`类型数值

`pop2`：将栈顶的2个`Slot`数值出栈。例如1个`double`类型数值，或者2个`int`类型数值

### 2.8 控制转移指令

程序流程离不开程序控制，为了支持条件跳转，虚拟机提供了大量字节码指令，大体上可以分为

1. [比较指令](#2.3.3 比较指令)
2. 条件转移指令
3. 比较条件跳转指令
4. 多条件分支跳转指令
5. 无条件跳转指令等

#### 2.8.1 条件跳转指令

条件跳转指令通常和比较指令结合使用。在条件跳转指令执行前，一般可以用以前指令进行栈顶元素的准备，然后进行条件跳转

条件跳转指令有：`ifeq`、`iflt`、`ifle`、`ifne`、`ifgt`、`ifge`、`ifnull`、`ifnonnull`。这些指令都接受两个字节的操作数，用于计算跳转的位置(16位符号整数作为当前位置的`offset`)

它们的统一含义为：弹出栈顶元素，测试它是满足某一条件，如果满足条件，则跳转到给定位置

| 指令      | 含义                             |
| --------- | -------------------------------- |
| ifeq      | 当栈顶int类型数值等于0时跳转     |
| ifne      | 当栈顶int类型数值不等于0时跳转   |
| iflt      | 当栈顶int类型数值小于0时跳转     |
| ifgt      | 当栈顶int类型数组大于0时跳转     |
| ifge      | 当栈顶int类型数值大于等于0时跳转 |
| ifnull    | 为null时跳转                     |
| ifnonnull | 不为null时跳转                   |

> **注意**

与前面运算规则一致

- 对于`boolean`、`byte`、`char`、`short`类型的条件分支比较操作，都是使用`int`类型的比较指令完成
- 对于`long`、`float`、`double`类型的条件分支比较操作，则会先执行相应类型的比较运算指令，运算指令会返回一个整型值到操作数栈中，随后再执行`int`类型的条件分支比较操作来完成整个分支跳转

由于各类型的比较最终都会转为`int`类型的比较操作，所以`java`虚拟机提供的`int`类型的条件分支指令是最为丰富和强大的

> **示例**

```java
public void compare() {
    int a = 0;
    if (a == 0) {
        a = 10;
    } else {
        a = 20;
    }
}
```

对应的字节码

```asm
 0 iconst_0
 1 istore_1
 2 iload_1
 3 ifne 12 (+9)
 6 bipush 10
 8 istore_1
 9 goto 15 (+6)
12 bipush 20
14 istore_1
15 return
```

#### 2.8.2 比较条件跳转指令

比较条件跳转指令类似于比较指令和条件跳转指令的结合体，它将比较和跳转两个步骤合二为一。这类指令有：`if_icmpeq`、`if_icmpne`、`if_icmplt`、`if_icmpgt`、`if_icmple`、`if_acmpeq`和`if_acmpne`。其中指令助记符加上`if_`后，以字符"i"开头的指令针对`int`整数操作(也包括`short`和`byte`类型)，以字符`a`开头的指令表示对象引用的比较

| 指令      | 描述                                                |
| --------- | --------------------------------------------------- |
| if_icmpeq | 比较栈顶两int类型数值大小，当前者等于后者时跳转     |
| if_ifmpne | 比较栈顶两int类型数值大小，当前者不等于后者时跳转   |
| if_icmplt | 比较栈顶两int类型数值大小，当前者小于等于后者时跳转 |
| if_icmple | 比较栈顶两int类型数值大小，当前者等于后者时跳转     |
| if_icmpgt | 比较栈顶两int类型数值大小，当前者大于后者时跳转     |
| if_ifmpge | 比较栈顶两int类型数值大小，当前者大于等于后者时跳转 |
| if_acmpeq | 比较栈顶两引用类型数值，当结果相等时跳转            |
| if_acmpne | 比较栈顶两引用类型数值，当结果不相等时跳转          |

这些指令都接受两个字节的操作数作为参数，用于计算跳转的位置。同时在执行指令时，栈顶需要准备两个元素进行比较。指令执行完成后，栈顶的这两个元素被清空，且没有任何数据入栈。如果预设条件成立，则执行跳转，否则，继续执行下一条语句

> **示例**

```java
public void compare() {
    int i = 10;
    int j = 20;
    System.out.println(i < j);
}
```

对应的字节码

```asm
 0 bipush 10
 2 istore_1
 3 bipush 20
 5 istore_2
 6 getstatic #8 <java/lang/System.out>
 9 iload_1
10 iload_2
11 if_icmpge 18 (+7)
14 iconst_1
15 goto 19 (+4)
18 iconst_0
19 invokevirtual #9 <java/io/PrintStream.println>
22 return
```

#### 2.8.3 多条件分支跳转指令

多条件分支跳转指令是专为`switch-case`语句设计的，主要有`tableswitch`和`lookupswitch`

| 名称         | 描述                             |
| ------------ | -------------------------------- |
| tableswitch  | 用于switch条件跳转，case值连续   |
| lookupswitch | 用于switch条件跳转，case值不连续 |

从助记符上看，两者都是`switch`语句的实现，它们的区别是

- `tableswitch`要求多个条件分支值是连续的，它内部值存放起始值和终止值，以及若干个跳转偏移量，通过给定的操作数`index`，可以立即定位到跳转偏移量位置，因此效率比较高
- 指令`lookupswitch`内部存放着各个离散的`case-offset`对，每次执行都要搜索全部的`case-offset`对，找到匹配的`case`值，并根据对应的`offset`计算跳转地址，因此效率较低

指令`tableswitch`的示意图如下图所示。由于`tableswitch`的`case`值是连续的，因此只需要记录最低值和最高值，以及每一项对应的`offset`偏移量，根据给定的`index`值通过简单的计算即可直接定位到`offset`

> **示例**

1. 连续`tableswitch`

    ```java
    public void switch1(int select) {
        int num;
        switch (select) {
            case 1:
                num = 10;
                break;
            case 2:
                num = 20;
                break;
            case 3:
                num = 30;
                break;
            default:
                num = 40;
        }
    }
    ```

    对应的字节码

    ```asm
     0 iload_1
     1 tableswitch 1 to 3	1:  28 (+27)
    	2:  34 (+33)
    	3:  40 (+39)
    	default:  46 (+45)
    28 bipush 10
    30 istore_2
    31 goto 49 (+18)
    34 bipush 20
    36 istore_2
    37 goto 49 (+12)
    40 bipush 30
    42 istore_2
    43 goto 49 (+6)
    46 bipush 40
    48 istore_2
    49 return
    ```

2. 不连续`lookupswitch`

    ```java
    public void switch2(int select) {
        int num;
        switch (select) {
            case 3:
                num = 30;
                break;
            case 1:
                num = 10;
                break;
            case 7:
                num = 70;
                break;
            default:
                num = 100;
        }
    }
    ```

    对应的字节码

    ```asm
     0 iload_1
     1 lookupswitch 3
    	1:  42 (+41)
    	3:  36 (+35)
    	7:  48 (+47)
    	default:  54 (+53)
    36 bipush 30
    38 istore_2
    39 goto 57 (+18)
    42 bipush 10
    44 istore_2
    45 goto 57 (+12)
    48 bipush 70
    50 istore_2
    51 goto 57 (+6)
    54 bipush 100
    56 istore_2
    57 return
    ```

    指令`lookupswitch`处理的是离散的`case`值，但是出于效率的考虑，将`case-offset`对按照`case`值大小排序，给定`index`时，需要查找与`index`相等的`case`，获得其`offset`，如果找不到则跳转`default`。

    <img src="https://gitee.com/dingwanli/picture/raw/master/20210606091452.png" style="zoom:80%;" />



#### 2.8.4 无条件跳转指令

目前主要的无条件跳转指令为`goto`。指令`goto`接受两个字节的操作数，共同组成一个带符号的整数，用于指定指令的偏移量，指令执行的目的就是跳转到偏移量给定的位置处

如果指令偏移量太大，超过双字节的带符号整数的范围，则可以使用指令`goto_w`，它和`goto`有相同的作用，但是它接收4个字节的操作数，可以表示更大的地址范围

指令`jsr`、`jsr_w`、`ret`虽然也是无条件跳转的，但主要用于`try-finally`语句，且已经被虚拟机逐渐废弃。

| 指令  | 描述                                                         |
| ----- | ------------------------------------------------------------ |
| goto  | 无条件跳转                                                   |
| got_w | 无条件跳转(宽索引)                                           |
| jsr   | 跳转至指定16位offset位置，并将jsr下一条指令地址压入栈顶      |
| jsr_w | 跳转至指定32位offset位置，并将jsr_w下一条指令地址压入栈顶    |
| ret   | 返回至指定的局部变量所给出的指令位置(一般与jsr、jsr_w)联合使用 |

> **示例**

```java
public void whileTest() {
    int i = 0;
    while (i < 100){
        i++;
    }
}
```

对应的字节码

```asm
 0 iconst_0
 1 istore_1
 2 iload_1
 3 bipush 100
 5 if_icmpge 14 (+9)
 8 iinc 1 by 1
11 goto 2 (-9)
14 return
```

### 2.9 异常处理指令

#### 2.9.1 抛出异常指令

1. `athrow`指令

    在`Java`程序中显示抛出异常的操作(`throw`语句)都是由`athrow`指令来实现。除了使用`throw`语句显示抛出异常情况之外，`JVM`规范还规定了许多运行时异常会在其他`Java`虚拟机指令检测到异常状况时自动抛出。例如，在之前介绍的整数运算时，当除数为零时，虚拟机会在`idiv`或者`ldiv`指令中抛出`ArithmeticException`异常

2. 注意

    正常情况下，操作数栈的压入弹出都是一条条指令完成的。唯一的例外情况是在抛异常时，`Java`虚拟机会清除操作数栈上的所有内容，而后将异常实例压入调用者操作数栈上

> **示例**

```java
public void throwZero(int i) throws RuntimeException, IllegalArgumentException{
    if (i == 0) {
        throw new RuntimeException("参数值为0");
    }
}
```

对应的字节码

```asm
 0 iload_1
 1 ifne 14 (+13)
 4 new #10 <java/lang/RuntimeException>
 7 dup
 8 ldc #11 <参数值为0>
10 invokespecial #12 <java/lang/RuntimeException.<init>>
13 athrow
14 return
```

方法声明处显示抛出的异常会存储在方法的异常属性中

![](https://gitee.com/dingwanli/picture/raw/master/20210606100018.png)

#### 2.9.2 异常处理与异常表

在`Java`虚拟机中，处理异常(`catch`语句)不是由字节码指令实现的(早期使用`jsr`、`ret`指令)，而是采用异常表来完成的

> **异常表**

如果一个方法定义了一个`try-catch`或者`try-finally`的异常处理，就会创建一个异常表。它包含了每个异常处理或者`finally`块的信息。异常表保存了每个异常的处理信息。

1. 起始位置
2. 结束位置
3. 程序计数器记录的代码处理的偏移地址
4. 被捕获的异常类在常量池中的索引

当一个异常被抛出时，`JVM`会在当前的方法里寻找一个匹配的处理，如果没有找到，这个方法会强制结束并弹出当前栈帧，并且异常会重新抛给上层调用的方法(再调用方法栈帧)。如果所有栈帧弹出前仍然没有找到合适的异常处理，这个线程将终止。如果这个异常在最后一个非守护线程里抛出，将会导致`JVM`终止，比如这个线程是个`main`线程

不管什么时候抛出异常，如果异常处理最终匹配了所以异常类型，代码就会继续执行。在这种情况下，如果方法结束后没有抛出异常，仍然执行`finally`块，在`return`前，它直接跳到`finally`块来完成目标

> **示例**

```java
public void exceptionTable() {
    try {
        int i = 1 / 0;
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

对应的字节码

```asm
 0 iconst_1
 1 iconst_0
 2 idiv
 3 istore_1
 4 goto 12 (+8)
 7 astore_1
 8 aload_1
 9 invokevirtual #14 <java/lang/Exception.printStackTrace>
12 return
```

### 2.10 同步控制指令

`Java`虚拟机支持两种同步结构：方法级的同步和方法内部一段指令序列的同步，这两种同步都是使用`monitor`来支持的

#### 2.10.1 方法级的同步

方法级的同步：是隐式的，即无须通过字节码指令来控制，它实现在方法调用和返回操作之中，虚拟机可以从方法常量池的方法表结构中的`ACC_SYNCHRONIZED`访问标志得知一个方法是否声明为同步方法

当调用方法时，调用指令将会检查方法的`ACC_SYNCHRONIZED`访问标志是否设置

1. 如果设置了，执行线程将先持有同步锁，然后执行方法。最后在方法完成(无论是正常完成还是非正常完成)时释放同步锁
2. 在方法执行期间，执行线程持有了同步锁，其他任何线程都无法再获得同一个锁
3. 如果一个同步方法执行期间抛出了异常，并且在方法内部无法处理此异常，那么这个同步方法所持有的锁将在异常抛到同步方法之外时自动释放

> **示例**

```java
public synchronized void sync(int i) {
    i++;
}
```

对应的字节码

```asm
0 iinc 1 by 1
3 return
```

虽然字节码体现不出同步方法，但是在方法的访问标识中可以看出

![](https://gitee.com/dingwanli/picture/raw/master/20210606103715.png)

#### 2.10.2 同步代码块

同步一段指令集序列：通常是由`java`中的`synchronized`语句块来表示的。`JVM`的指令集有`monitorenter`和`monitorexit`两条指令来支持`synchronized`关键字的语义

当一个线程进入同步代码块时，它使用`monitorenter`指令请求进入。如果当前对象的监视计数器为0，则它会被准许进入，若为1，则判断持有当前监视器的线程是否为自己，如果是则进入，否则等待，知道对象的监视计数器为0，才会被允许进入同步块

当线程退出同步代码块时，需要使用`monitorexit`声明退出。在`Java`虚拟机中国年，任何对象都有一个监视器与之关联，用来判断对象是否被锁定，当监视器被持有后，对象处于锁定状态

指令`monitorenter`和`monitorexit`在执行时，都需要在操作数栈顶压入对象，之后`monitorenter`和`monitorexit`的锁定和释放都是针对这个对象的监视器进行的

下图展示了监视器如何保护临界区代码不会同时被多个线程访问，只有当线程4离开临界区后，线程1、2、3才有可能进入

![](https://gitee.com/dingwanli/picture/raw/master/20210606104624.png)

> **示例**

```java
private int i = 0;
public void subtract() {
    synchronized (Object.class) {
        i--;
    }
}
```

对应的字节码

```asm
 0 ldc #3 <java/lang/Object>
 2 dup
 3 astore_1
 4 monitorenter
 5 aload_0
 6 dup
 7 getfield #2 <com/valid/DupTest.i>
10 iconst_1
11 isub
12 putfield #2 <com/valid/DupTest.i>
15 aload_1
16 monitorexit
17 goto 25 (+8)
20 astore_2
21 aload_1
22 monitorexit
23 aload_2
24 athrow
25 return
```

异常表

![](https://gitee.com/dingwanli/picture/raw/master/20210606105634.png)

## 3. 类的加载

在`Java`中数据类型分为基本数据类型和引用数据类型。基本数据类型由虚拟机预先定义，引用数据类型则需要进行类的加载，是按照`Java`虚拟机规范，从`class`文件到加载到内存中的类，到类卸载出内存为止，它的整个声明周期包括如下7个阶段

<img src="https://gitee.com/dingwanli/picture/raw/master/20210606131008.png" style="zoom:80%;" />

从类的使用角度来看

<img src="https://gitee.com/dingwanli/picture/raw/master/20210606131150.png" style="zoom:70%;" />

### 3.1 Loading加载

> **理解**

所谓的加载，简言之就是将`Java`类的字节码加载到机器内存中，并在内存中构建出`Java`类的原型--类模板对象。类模板对象，起始就是`Java`类在`JVM`内存中的一个快照，`JVM`将从字节码文件中解析出的常量池、类字段、类方法等信息存储到类模板中，这样`JVM`在运行期便能通过类模板而获取`Java`类中的任意信息，能够对`Java`类的成员变量进行遍历，也能进行`Java`方法的调用。反射的机制即基于这一基础。如果`JVM`没有将`Java`类的声明信息存储起来，则`JVM`在运行期间也无法反射

> **加载完成的操作**

加载阶段，就是查找加载类的二进制数据，生成`Class`的实例

在加载类时，`Java`虚拟机必须完成以下3件事

- 通过类的全名，获取类的二进制流
- 解析类的二进制数据流为方法区内的数据结构(`java`类模型)
- 创建`java.lang.Class`类的实例，表示该类型，作为方法区这个类的各种数据的访问入口

#### 3.1.1 二进制流的获取方式

对于类的二进制数据流，虚拟机可以通过多种途径产生或获得

1. 虚拟机从文件系统中读取一个`class`文件
2. 读入`jar`、`zip`等归档数据包，提取类文件
3. 事先存放在数据库中的类的二进制数据
4. 使用类似`HTTP`之类的协议通过网络进行加载
5. 在运行时生成一段`Class`的二进制信息等

在获取到类的二进制信息后，`Java`虚拟机就会处理这些数据，并最终转换成一个`java.lang.Class`的实例

如果数据数据不是`ClassFile`的结构，则会抛出`ClassFormatError`

#### 3.1.2 类模型与Class实例的位置

**类模型的位置**：加载的类在`JVM`中创建相应的类结构，类结构会存储在方法区(`JDK8`之前：永久代；`JDK8`之后：元空间)

`Class`实例的位置：类将`.class`文件加载至元空间后，会在堆中创建一个`Java.lang.Class`对象，用来封装类位于方法区内的数据结构，该`Class`对象是在加载类的过程中创建的，每个类都对应有一个`Class`类型的对象

![](https://gitee.com/dingwanli/picture/raw/master/20210606153919.png)

`Class`类的构造器是私有的，只有`JVM`才能够创建

`java.lang.Class`实例是访问类型元数据的接口，也是实现反射的关键数据、入口。通过`Class`类提供的接口，可以获得目标所关联的`.class`文件中具体的数据结构：方法、字段等信息

#### 3.1.3 数组类的加载

创建数组类的情况稍微有点特殊，因为数组本身并不是由类加载器负责创建，而是由`JVM`在运行时根据需要而直接创建的，但数组的元素类型仍然需要依靠类加载器去创建。创建数组类(下述简称A)的过程

1. 如果数组的元素类型是引用类型，那么遵循定义的加载过程递归加载和创建数组A的元素类型
2. `JVM`使用指定的元素类型和数组维度来创建新的数组类

如果数组的元素类型是引用类型，数组类的可访问性就由数元素类型的可访问性决定，否则数组类的可访问性将被缺省定义为`public`

### 3.2 Linking链接

#### 3.2.1 验证

验证阶段`Verification`当类加载到系统后，就开始链接操作，验证是连接操作的第一步。它的目的是保证加载的字节码是合法、合理并符合规范的

验证的步骤比较复杂，实际要验证的项目也很多，大体上上`Java`虚拟机需要做以下检查

<img src="https://gitee.com/dingwanli/picture/raw/master/20210606155253.png" style="zoom:70%;" />



> **整体说明**

验证的内容涵盖了类数据信息的格式验证、语义检查、字节码验证，以及符号引用验证等

- 其中**格式验证会和加载阶段一起执行**。验证通过之后，类加载器才会成功将类的二进制数据信息加载到方法区中
- 格式验证之外的验证操作将会在方法区中进行

链接阶段的验证虽然拖慢了加载速度，但是它避免了在字节码运行时还需要进行各种检查

> **具体说明**

1. 格式验证：是否以魔数`oxCAFEBABE`开头，主版本号和副版本号是否在当前`Java`虚拟机的支持范围，数据中每一项是否都拥有正确的长度等

2. 语义检查：`Java`虚拟机还会进行字节码得到语义检查，但凡在语义上不符合规范的，虚拟机也不会给予验证通过。比如：

    是否所有的类都有父类的存在(在`Java`里，出了`Object`外，其他类都应该有父类)

    是否一些被定义为`final`的方法或者类被重写或继承了

    非抽象类是否实现了所有抽象方法或者接口方法

    是否存在不兼容的方法(比如方法的签名除了返回值不同，其他都一样，这种方法会让虚拟机无从下手调度；`abstract`情况下的方法，就不能是`final`的了)

3. 字节码验证：`Java`虚拟机还会进行字节码验证，字节码验证也是验证过程中最为复杂的一个过程。它试图通过对字节码流的分心，判断字节码是否可以被正确的执行，比如：

    在字节码的执行过程中，是否会跳转到一条不存在的指令

    函数的调用是否传递给了正确类型的参数

    变量的赋值是不是给了正确的数据类型等

栈映射帧`StackMapTable`就是在这个阶段，用于检测在特定的字节码处，其局部变量表和操作数栈是否有着正确的数据类型。

但遗憾的是，`100%`准确地判断一段字节码是否可以被安全执行时无法实现的，因此该过程只是尽可能地检查出可以预知的明显的问题。如果在这个阶段无法通过检查，虚拟机也不会正确装载这个类。但是，如果通过了这个阶段的检查，也不能说明这个累是完全没有问题的

在前面的3次检查中，已经排除了文件格式错误语义错误以及字节码的不正确性。但是依然不能确保类是没有问题的

4. 校验器还将进行符号引用的验证。`Class`文件在其常量池会通过字符串记录自己将要使用的其他类或者方法。因此，在校验阶段，虚拟机还会检查这些类或者方法确实是存在的，并且当前类是权限访问这些数据，如果一个需要使用类无法在系统找到，则会抛出`NoClassDefFoundError`，如果一个方法无法被找到，则会抛出`NoSuchMethodError`。**此阶段在解析环节才会执行**

#### 3.2.2 准备

准备阶段`Preparation`，简言之，为**类的静态变量**分配内存，并将其初始化为默认值

当一个类验证通过时，虚拟机就会进入准备阶段，在这个阶段，虚拟机就会为这个类分配相应的内存空间，并设置默认初始值。`Java`虚拟机为各类型变量默认的初始值如表所示

| 类型      | 默认初始值 |
| --------- | ---------- |
| byte      | (byte)0    |
| short     | (short)0   |
| int       | 0          |
| long      | 0L         |
| float     | 0.0f       |
| double    | 0.0        |
| char      | \u0000     |
| boolean   | false      |
| reference | null       |

`Java`并不支持`boolean`类型，对于`boolean`类型，内部实现是`int`，由于`int`的默认值是`0`，`boolean`的默认值就是`false`

> **注意**

1. 这里不包含基本数据类型的字段用`static final`修饰的情况，因为`final`在编译的时候就会分配了，准备阶段会显式赋值
2. 注意这里不会为实例变量分配初始化，类变量会分配下方法区中，而实例变量是会随着对象一起分配到`Java`堆中
3. 这个阶段并不会向初始化阶段那样会有初始化或者代码被执行

### 3.3 Resolution解析

解析阶段`Resolution`，简言之，将类、接口、字段和方法的符号引用转换为直接引用

> **具体描述**

符号引用就是一些字面量的引用，和虚拟机的内部数据结构和内存布局无关。比较容易理解的就是在`Class`类文件中，通过常量池进行了大量的符号引用。但是在程序实际运行时，只有符号引用是不够的，比如当下`println()`方法被调用时，系统需要明确知道该方法的位置

举例：输出操作`System.out.println()`对应的字节码。`invokevirtual #24 <java/io/PrintStream.ptintln`

<img src="https://gitee.com/dingwanli/picture/raw/master/20210606212138.png" style="zoom:60%;" />



以方法为例，`Java`虚拟机为每个类都准备了一张方法表，将 其所有的方法都列在表中，当需要调用一个类的方法的时候，只要知道这个方法在方法表中的位置，从而使得方法被成功调用。通过解析操作，符号引用就可以转变为目标方法在类中方法表中的位置，从而使得方法如果被成功调用

> **小结**

所谓解析就是将符号引用转为直接引用，也就是得到类、字段、方法在内存中的指针或者偏移量。因此，可以说，如果直接引用存在，那么可以肯定信息系统中存在该类、方法或者字段。但只存在符号引用，不能确定系统中一定存在该结构

不过`Java`虚拟机规范并没有明确要求解析阶段一定要按照顺序执行。在`HotSpot VM`中，加载、验证、准备和初始化会按照顺序有条不紊地执行，但链接阶段中的解析操作往往会伴随着`JVM`在执行完成初始化之后再执行

> **字符串的复习**

当在`Java`代码中直接使用字符串常量时，就会在类中出现`CONSTANT_String`，它表示字符串常量，并且会引用一个`CONSTANT_UTF8`的常量项。在`Java`虚拟机内部运行中的常量中，会维护一张字符串拘留表`intern`，它会保存所有出现过的字符串常量，并且没有重复项，只要以`CONSTANT_String`形式出现的字符串也都会出现在这张表中。使用`String.intern()`方法可以得到一个字符串在拘留表中的引用，因为该表中没有重复项，所以任何字面量相同的字符串的`String.intern()`方法返回总是相等的

### 3.4 Initialization初始化阶段

初始化阶段，简言之，为类的静态变量赋予正确的初始值。

> **具体描述**

类的初始化是类装载的最后一个阶段。如果前面的步骤都没有问题，那么表示类可以顺利装载到系统中 。此时，类才会开始执行`Java`字节码。(即：到了初始化阶段，才真正开始执行类中定义的`Java`程序代码)

初始化阶段的重要工作是执行类的初始化方法：`<clinit>()`方法

- 该方法仅能由`Java`编译器生成并由`JVM`调用，程序开发者无法自定义一个同名的方法，更无法直接在`Java`程序中调用该方法，虽然该方法也是由字节码指令所组成
- 它是由静态成员的赋值语句以及`static`语句块合并产生的

> **说明**

在加载一个类之前，虚拟机总是会试图加载该类的父类，因此父类的`<clinit>`总是在子类`<clinit>`之前被调用。也就是说，父类的`static`块优先级高于子类

`Java`编译器并不会为所有的类都产生`<clinit>()`初始化方法。哪些类在编译为字节码后，字节码文件中将不会包含`<clinit>()`方法？

- 一个类中并没有声明任何的类变量，也没有静态代码块时
- 一个类中声明类变量，但是没有明确使用类变量的初始化语句以及静态代码块来执行初始化操作时
- 一个类中包含`static final`修饰的基本数据类型的字段，这些类字段初始化语句采用编译时常量表达式

