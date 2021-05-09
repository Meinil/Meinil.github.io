---
title: 设计模式
date: '2021-05-06'
sidebar: 'auto'
categories:
 - java
tags:
 - java
 - 设计模式
---

## 1. 概述

### 1.1 设计模式的目的

1. 代码重用性高：相同功能的代码，不用多次编写
2. 可读性强：便于其他程序员的阅读和理解
3. 可扩展性高：增减新功能时十分方便
4. 可靠性强：增减新功能，对原来的功能没有影响
5. 高内聚、低耦合

设计模式共分三类，23种

1. 创建型模式：**单例模式**、抽象工厂模式、原型模式、建造者模式、**工厂模式**
2. 结构型模式：适配器模式、桥接模式、**装饰模式**、组合模式、外观模式、享元模式、**代理模式**
3. 行为型模式：模板方法模式、命令模式、访问者模式、迭代器模式、**观察者模式**、中介者模式、备忘录模式、解释器模式、状态模式、策略模式、职责链模式

### 1.2 UML类图

`UML`：统一建模语言，是一种用于软件系统分析和设计的语言工具，它用于帮助软件开发人员进行思考和记录思路的结果

> **分类**

1. 用例图
2. 静态结构图：**类图**、对象图、包图、组件图、部署图
3. 动态行为图：交互图(时序图与协作图)、状态图、活动图

#### 1.2.1 基本含义

```mermaid
classDiagram
classA --|> classB : 泛化(继承)
classC --* classD : 组合
classE --o classF : 聚合
classG -- classH : 关联
classI --> classJ : 关联
classK ..> classL : 依赖
classM ..|> classN : 实现
classO .. classP : Link(Dashed)
```

`UML`类图可以用来表示类本身，以及类和类之间的联系

类和类之间的联系包括：依赖、泛化(继承)、实现、关联、聚合与组合

#### 1.2.2 类图示例

```java
public class Person {
    private Integer id;
    private String name;

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
}
```

```mermaid
classDiagram
class Person {
	-id: Interger
	-name: String
	+getName() String
	+setName(String name)
}
```

#### 1.2.3 依赖

只要在一个类中用到了另外的类，就会构成依赖关系，主要有以下几种情况

1. 类中用到了对方
2. 类的的成员属性
3. 方法的返回类型
4. 方法的参数类型
5. 方法中使用的局部变量

有以下依赖关系

```java
class PersonDao {}
class Person {}
class IDCard {}
class Department {}

public class PersonServiceBean {
    private PersonDao personDao;
    public void save(Person person) {}
    public IDCard getIDCard(Integer id) {
        return null;
    }
    public void modify() {
        Department department = new Department();
    }
}
```

对于`PersonServiceBean`这个类来说，它就依赖了其余的四个类

```mermaid
classDiagram
class PersonDao {
	
}
class Person {
	
}
class IDCard {
	
}
class Department {
	
}
class PersonServiceBean {
	-personDao: PersonDao
	+save(Person person) void
	+getIDCard(Integer id) IDCard
	+modify() void
}
PersonServiceBean ..> PersonDao
PersonServiceBean ..> Person
PersonServiceBean ..> IDCard
PersonServiceBean ..> Department
```

#### 1.2.4 泛化(继承)

有以下关系

```java
abstract class DaoSupport {
    public void save(Object entity) {}
    public void delete(Object id) {}
}
public class PersonServiceBean extends DaoSupport{}
```

```mermaid
classDiagram
class DaoSupport {
	+save(Object entity) void
	+delete(Object id) void
}
class PersonServiceBean {
	
}
DaoSupport <|-- PersonServiceBean
```

泛化关系就是继承关系

#### 1.2.5 实现

有以下关系

```java
interface PersonService {
    public void delete(Integer id);
}
public class PersonServiceImpl implements PersonService{
    @Override
    public void delete(Integer id) { }
}
```

```mermaid
classDiagram
class PersonService {
	<<interface>>
	+delete(Integer id) void
}
class PersonServiceImpl {
	+delete(Integer id) void
}
PersonService <|.. PersonServiceImpl
```

#### 1.2.6 关联

关联具有导航性：即双向关系或单向关系。

关系具有多重性：一对一、一对多、多对一

**单向多对一**

```java
public class Person{
	private IDCard card;
}
public class IDCard{}
```

```mermaid
classDiagram
class Person {
	-card: IDCard
}
class IDCard {
	
}
Person --> IDCard
```

**双向一对一**

```java
public class Person{
	private IDCard card;
}
public class IDCard{
	private Person person;
}
```

```mermaid
classDiagram
class Person {
	-card: IDCard
}
class IDCard {
	-person: Person
}
Person -- IDCard
```

#### 1.2.7 聚合

聚合关系表示的是整体和部分的关系，整体与部分可以分开。聚合关系是关联关系的特例，所以它具有关联关系的导航性与多重性

> **示例**

```java
class Mouse {
}
class Monitor {
}

public class Computer {
    private Monitor monitor;
    private Mouse mouse;

    public void setMonitor(Monitor monitor) {
        this.monitor = monitor;
    }

    public void setMouse(Mouse mouse) {
        this.mouse = mouse;
    }
}
```

```mermaid
classDiagram
class Mouse {
	
}
class Monitor {
	
}
class Computer {
	-monitor: Monitor
	-mouse: Mouse
	+setMonitor(Monitor monitor) void
    +setMouse(Mouse mouse) void
}
Computer o-- Mouse
Computer o-- Monitor
```

#### 1.2.8 组合

对于[1.2.7](#1.2.7 聚合)的例子，如果认为`Mouse`、`Monitor`和`Computer`是不可分离的，则为组合关系。

```java
class Mouse {
}
class Monitor {
}

public class Computer {
    private Monitor monitor = new Monitor();
    private Mouse mouse = new Mouse();
}
```

```mermaid
classDiagram
class Mouse {
	
}
class Monitor {
	
}
class Computer {
	-monitor: Monitor
	-mouse: Mouse
}
Computer *-- Mouse
Computer *-- Monitor
```

### 1.3 七大原则

七大原则是设计模式的基础

#### 1.3.1 单一职责

对类来说，即一个类应该只负责一项职责

```java
public class SingleResponsibility {
    public static void main(String[] args) {
        Vehicle vehicle = new Vehicle();
        vehicle.runAir("飞机");
        vehicle.runRoad("汽车");
    }
}
class Vehicle {
    public void runRoad(String vehicle) {
        System.out.println(vehicle + "在公路上运行");
    }

    public void runAir(String vehicle) {
        System.out.println(vehicle + "在天上飞行");
    }
}
```

> **注意**

1. 提高类的可读性，可维护性
2. 降低变更引起的风险
3. 通常情况下，我们应当遵守单一职责原则，只有逻辑足够简单，才可以在代码码级别违反单一职责原则，只有类中方法数量足够少，可以i在方法级别保持单一职责原则(比如上述的例子，一般都是写为多个类)

#### 1.3.2 接口隔离

客户端不应该依赖它不需要的接口，即一个类对另一个类的依赖应该建立在最小的接口上

```mermaid
classDiagram

class Interface{
    <<interface>>
    operation1();
    operation2();
    operation3();
    operation4();
    operation5();
}
class A{
	+ operation1();
    + operation2();
    + operation3();
    + operation4();
    + operation5();
}
Interface <|.. A

class B{
	+ operation1();
    + operation2();
    + operation3();
    + operation4();
    + operation5();
}
Interface <|.. B

class C{
	+ depend1(Interface);
    + depend2(Interface);
    + depend3(Interface);
}
Interface <.. C

class D{
	+ depend1(Interface);
    + depend4(Interface);
    + depend5(Interface);
}
Interface <.. D
```

A、B类实现接口`Interface`，C中的方法通过接口使用A，但只用到了1、2、3。D中的方法通过接口使用B，但只用到了1、4、5。

接口隔离：将`Interface`拆解成几个子接口，其他类根据需要来实现

```mermaid
classDiagram

class Interface{
    <<interface>>
    operation1();
}

class Interface1{
    <<interface>>
    operation2();
    operation3();
}

class Interface2{
    <<interface>>
    operation4();
    operation5();
}
class A{
	+ operation1();
    + operation2();
    + operation3();
}
Interface <|.. A
Interface1 <|.. A
class B{
	+ operation1();
    + operation4();
    + operation5();
}
Interface <|.. B
Interface2 <|.. B
class C{
	+ depend1(Interface);
    + depend2(Interface1);
    + depend3(Interface1);
}
Interface <.. C
Interface1 <.. C
class D{
	+ depend1(Interface);
    + depend4(Interface2);
    + depend5(Interface2);
}
Interface <.. D
Interface2 <.. D
```

具体实现

```java
interface Interface{
    void operation1();
}

interface Interface1{
    void operation2();
    void operation3();
}

interface Interface2{
    void operation4();
    void operation5();
}

class A implements Interface, Interface1 {
    @Override
    public void operation1() { }
    @Override
    public void operation2() { }
    @Override
    public void operation3() { }
}

class B implements Interface, Interface2 {
    @Override
    public void operation1() { }
    @Override
    public void operation4() { }
    @Override
    public void operation5() { }
}

// 通过接口使用A类或B类但只会用到1，2，3
class C {
    public void depend1(Interface i) {
        i.operation1();
    }
    public void depend2(Interface1 i) {
        i.operation2();
    }
    public void depend3(Interface1 i) {
        i.operation3();
    }
}

// 通过接口使用A类或B类但只会用到1，4，5
class D{
    public void depend1(Interface i) {
        i.operation1();
    }
    public void depend4(Interface2 i) {
        i.operation4();
    }
    public void depend5(Interface2 i) {
        i.operation5();
    }
}
```

#### 1.3.3 依赖倒转(倒置)

设计理念：相对于细节的多变性，抽象的东西要稳定的多。以抽象为基础搭建的架构比以细节为基础的架构要稳定的多。在`java`中，抽象指的就是接口或抽象类，细节就是具体的实现类。使用接口或抽象类的目的是制定好规范，而不涉及任何具体的操作，把展现细节的任务交给他们的实现类去完成

> **基本原则**

1. 高层模块不应该依赖底层模块，二者都应该依赖其抽象
2. 抽象不应该依赖细节，细节应该依赖抽象
3. 依赖倒转的中心思想是面向接口编程
4. 底层模块(一般是实现类)尽量都要有接口或抽象类，或两者都有
5. 方法的参数类型尽量是抽象类或接口，便于程序的扩展和优化
6. 继承时遵循里氏替换原则

```mermaid
classDiagram

class Receiver{
    <<interface>>
    getInfo() String
}
class Email{
    +getInfo() String
}
Receiver <|.. Email

class WeChat{
    +getInfo() String
}
Receiver <|.. WeChat
```

> **具体实现**

```java
interface Receiver {
    String getInfo();
}

class Email implements Receiver{
    public String getInfo() {
        return "电子邮件信息: Hello, World";
    }
}

class WeChat implements Receiver{
    public String getInfo() {
        return "电子邮件信息: Hello, World";
    }
}

class Person {
    public void receive(Receiver receiver) {
        System.out.println(receiver.getInfo());
    }
}
```

> **依赖传递的方法**

1. 通过接口的实现类进行传递，比如上述方法

2. 也可以通过构造器来实现依赖的传递，将接口变成类本身的一个属性，通过构造器传入

   ```java
   interface Receiver {
       String getInfo();
   }
   public class Person {
       private Receiver receiver;
       
       public Person(Receiver receiver) { // 构造器传入
           this.receiver = receiver;
       }
       public void receive() {
           System.out.println(receiver.getInfo());
       }
   }
   ```

3. 通过`setter`方法，此时的接口也是类本身的一个属性，通过`setter`给其赋值

   ```java
   interface Receiver {
       String getInfo();
   }
   public class Person {
       private Receiver receiver;
       
       public void setReceiver(Receiver receiver) { // setter传入
           this.receiver = receiver;
       }
       public void receive() {
           System.out.println(receiver.getInfo());
       }
   }
   ```

#### 1.3.4 里氏替换

继承性：继承给程序设计带来便利的同时，也带来了弊端。比如使用集成会给程序带来**侵入性**，程序的可移植性降低，会增加对象间的耦合性。如果一个类被其他的类所继承，则当这个类需要修改时，必须考虑到所有的子类，并且父类修改后，所有涉及到子类的功能都有可能产生故障

> **基本原则**

1. 如果对每个类型为`T1`的对象`o1`，都有类型为`T2`的对象`o2`，使得以`T1`定义的所有程序`P`在所有的对象`o1`都代换为`o2`时，程序`P`的行为没有发生变化，那么类型`T2`是类型`T1`的子类型。即，所有引用基类的地方必须能透明地使用其子类的对象
2. 使用继承时，遵循里氏替换原则，在子类中尽量**不要**重写父类的方法
3. 继承实际上让两个类耦合性增强了，在适当的情况下，可以通过聚合，组合，依赖来解决问题

> **具体实例**

```java
class A {
    // 返回两个数的差
    public int func1(int num1, int num2) {
        return num1 - num2;
    }
}

class B extends A {
    @Override
    public int func1(int num1, int num2) {
        return num1 + num2;
    }
}
```

`A`类中有个求取两个数差的方法，`B`类继承`A`类后，重写了方法。当通过`B`的对象调用方法并想要实现原来的方法时，就有可能出错

> **里氏替换改写**

```mermaid
classDiagram

class Base {
	
}
class A{
    +func() int
}
Base <-- A

class B{
	-a: A
	+func() int
}
A *-- B
Base <-- B
```

```java
// 基类
class Base {}

class A extends Base{
    // 返回两个数的差
    public int func(int num1, int num2) {
        return num1 - num2;
    }
}

class B extends Base {
    // 使用A中的方法进行组合A
    private A a;

    public int func(int num1, int num2) {
        if (a == null) {
            a = new A();
        }
        return a.func(num1, num2);
    }
}
```

#### 1.3.5 开闭原则

一个软件实体(比如类)，模块和函数应该对扩展开放(提供方)，对修改关闭(使用方)。用抽象构建框架，用实现扩展细节

> **基本原则**

1. 当软件需要变化时，尽量通过扩展软件实体的行为来实现变化，而不是通过修改已有的代码来实现变化
2. 使用设计模式的目的之一就是遵循开闭原则

> **案例分析**

```mermaid
classDiagram
class GraphicEditor{
	+drawShape(Shape shape)
}
GraphicEditor ..> Rectangle
GraphicEditor ..> Shape
class Shape {
	+draw()
}

class Rectangle{
    +draw()
}
Shape <|-- Rectangle

class Circle{
	+draw()
}
Shape <|-- Circle
GraphicEditor ..> Circle
```

`GraphicEditor`一个绘画类，内部调用`shape`方法进行绘画

```java
abstract class Shape{
    public abstract void draw();
}

// 绘图类[提供方]
class GraphicEditor{
    public void drawShape(Shape shape) {
        shape.draw();
    }
}

class Rectangle extends Shape {
    @Override
    public void draw() {
        System.out.println("矩形");
    }
}

class Circle extends Shape {
    @Override
    public void draw() {
        System.out.println("圆形");
    }
}
```

当新增加其他图形类时，并不需要修改`GraphicEditor`

#### 1.3.6 迪米特法则

> **基本原则**

1. 一个对象应该对其他对象保持最少的了解，即类和类之间的耦合度应该越低越好

2. 一个类对自己依赖的类知道的越少越好。对于依赖的类不管怎么复杂，都应该将逻辑封装在类的内部，对外只提供公共方法进行访问

3. 只与直接朋友通信

   直接朋友：每个对象都会与其他对象有耦合关系，只要两个对象之间有耦合关系，我们就说这两个对象之间是朋友关系。耦合的方式很多，依赖，关联，组合，聚合等。其中，出现成员变量，方法参数，方法返回值中的类为直接的朋友，而出现在局部变量中的类不是直接的朋友，而陌生类不要出现在局部变量中

#### 1.3.7 合成复用

原则是尽量使用过**合成/聚合**的方式，而不是使用继承

```mermaid
classDiagram

class A {
    operation1() void
    operation2() void
}
class B {
	
}
A <-- B
```

如果只是想要使用`A`类中的方法，使用继承会让`B`和`A`的耦合性增强，可以采用**合成/聚合**的方式

**组合**

即在B类的内部直接使用`new`的方式将A合成进去

```mermaid
classDiagram

class A {
    operation1() void
    operation2() void
}
class B {
	-a: A
}
A *-- B
```

**聚合**

通过`setter`的方式将A合成进去

```mermaid
classDiagram

class A {
    operation1() void
    operation2() void
}
class B {
	-a: A
	+setA(A a)
}
A o-- B
```

## 2. 单例模式

类的单例设计模式，就是采取一定的方法保证在整个的软件系统中，对某个类只能存在一个对象实例，并且该类就只提供一个取得其对象实例的方法(静态方法)

应用场景：需要频繁的进行创建和销毁的对象，创建对象时耗时过多或耗费资源过多，但又经常用到的对象，工具类对象、频繁访问数据库或文件的对象

### 2.1 饿汉式

#### 2.2.1 静态常量

1. 构造器私有化
2. 类的内部创建对象实例
3. 提供一个共有的静态方法，返回实例对象

```java
public class Singleton {
    private Singleton() {}
    
    private final static Singleton instance = new Singleton();

    public static Singleton getInstance() {
        return instance;
    }
}
```

> **优缺点**

- 优点：这种写法比较简单，就是在类装载的时候就完成实例化，避免线程同步问题
- 缺点：在类装载时就完成实例化，没有达到懒加载的效果，如果没有使用过这个实例，则会造成内存的浪费
- 这种方式基于`classloader`机制避免了多线程的同步问题

#### 2.1.2 静态代码块

```java
class Singleton {
    private final static Singleton instance;
    
    private Singleton() {}
    static {
        instance = new Singleton();
    }
    public static Singleton getInstance() {
        return instance;
    }
}
```

与[静态常量](#2.2.1 静态常量)的方式类似，只不过将实例化的过程放在了静态代码块中

### 2.3 懒汉式

#### 2.2.1 线程不安全

```java
public class Singleton {
    private static Singleton instance;
    
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

> **优缺点**

- 有懒加载效果，但是只能在单线程下使用
- 不推荐使用

#### 2.2.2 线程安全

```java
public class Singleton {
    private static Singleton instance;
    
    private Singleton() {}
    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```

> **优缺点**

- 解决了线程不安全的问题
- 效率底下，不推荐使用

#### 2.2.3 双重检查

```java
class Singleton {
    private static volatile Singleton instance;
    
    private Singleton() {}
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```

> **优缺点**

- 既保证了线程安全，又保证了效率
- 推荐使用:star:

#### 2.2.4 静态内部类

```java
class Singleton {
    private Singleton() {}

    private static class SingletonInstance {
        private final static Singleton INSTANCE = new Singleton();
    }

    public static Singleton getInstance() {
        return SingletonInstance.INSTANCE;
    }
}
```

> **优缺点**

- 静态内部类不会应为类的装载而装载，只会在使用到它的时候进行装载，且类的装载是线程安全的
- 效率高，推荐使用:star:

#### 2.2.5 枚举

```java
enum Singleton {
    INSTANCE;
}
```

> **优缺点**

- 枚举能够避免多线程同步问题，而且还能防止反序列化重新对象
- 推荐使用:star:

## 3. 工厂模式

工厂模式的意义：将实例化对象的代码提取出来，放到一个类中同一管理和维护，达到和主项目的依赖关系的解藕，从而提高项目的扩展和维护性

一个披萨制作的例子：

```mermaid
graph LR
准备原材料 --> 烘烤 --> 切片 --> 打包
```

```mermaid
classDiagram
class Pizza {
	#name: String
	+prepare() void
	+bake() void
	+cut() void
	+box() void
}
class CheessPizza {
	+prepare() void
}
class GreekPizza {
	+prepare() void
}
class OrderPizza {
	+OrderPizza() void
}
Pizza <|-- CheessPizza
OrderPizza ..> CheessPizza
OrderPizza ..> Pizza
OrderPizza ..> GreekPizza
Pizza <|-- GreekPizza
```

客户会使用订单类`OrderPizza`来订购不同的披萨

**具体的类编写**

1. 披萨类

   ```java
   public abstract class Pizza {
       protected String name;
   
       public abstract void prepare();
       public void bake() {
           System.out.println(name + "baking");
       }
       public void cut() {
           System.out.println(name + "cutting");
       }
       public void box() {
           System.out.println(name + "boxing");
       }
       public void setName(String name) {
           this.name = name;
       }
   }
   ```

2. 奶酪披萨

   ```java
   public class CheesePizza extends Pizza{
       @Override
       public void prepare() {
           System.out.println("给奶酪披萨准备原材料");
       }
   }
   ```

3. 希腊披萨

   ```java
   public class GreekPizza extends Pizza{
       @Override
       public void prepare() {
           System.out.println("给希腊披萨准备原材料");
       }
   }
   ```

4. `OrderPizza`

   ```java
   public class OrderPizza {
       public OrderPizza() {
           Pizza pizza = null;
           String name = "";
           Scanner scanner = new Scanner(System.in);
           tag:while (true) {
               name = scanner.next();
               switch (name) {
                   case "cheese":
                       pizza = new CheesePizza();
                       pizza.setName("奶酪披萨");
                       break;
                   case "greek":
                       pizza = new GreekPizza();
                       pizza.setName("希腊披萨");
                       break;
                   default:
                       break tag;
               }
               pizza.prepare();
               pizza.bake();
               pizza.cut();
               pizza.box();
           }
       }
   }
   ```

### 3.1 简单工厂

1. 简单工厂模式是属于创建型模式的一种。简单工厂模式是由一个工厂对象决定创建出哪一种产品类的实例。
2. 定义一个创建对象的类，有关这个类封装实例化对象的行为

```mermaid
classDiagram
class Pizza {
	#name: String
	+prepare() void
	+bake() void
	+cut() void
	+box() void
}
class CheessPizza {
	+prepare() void
}
class GreekPizza {
	+prepare() void
}
class OrderPizza {
	+OrderPizza() void
}
class SimpleFactory {
	+createPizza(String type) Pizza
}
Pizza <|-- CheessPizza
SimpleFactory ..> CheessPizza
SimpleFactory ..> Pizza
SimpleFactory ..> GreekPizza
Pizza <|-- GreekPizza
OrderPizza *-- SimpleFactory
```

定义简单工厂类，将制造披萨的方法封装其中

```java
public class SimpleFactory {
    public Pizza createPizza(String type) {
        Pizza pizza = null;
        switch (type) {
            case "cheese":
                pizza = new CheesePizza();
                pizza.setName("奶酪披萨");
                break;
            case "greek":
                pizza = new GreekPizza();
                pizza.setName("希腊披萨");
                break;
        }
        return pizza;
    }
}
```

重新编写订单类

```java
public class OrderPizza {
    // 定义一个简单工厂对象
    private final SimpleFactory simpleFactory = new SimpleFactory();
    public OrderPizza() {
        String orderType = "";
        Pizza pizza = null;
        Scanner scanner = new Scanner(System.in);
        do {
            orderType = scanner.next();
            pizza = simpleFactory.createPizza(orderType);
            if (pizza != null) {
                pizza.prepare();
                pizza.bake();
                pizza.cut();
                pizza.box();
            } else {
                break;
            }
        } while (true);
    }
}
```

简单工厂也叫静态工厂，一般工厂类创建对象的方法为静态的

### 3.2 工厂方法

工厂方法模式：实例化方法放在其父类的抽象方法中，由子类决定要实例化的类，工厂方法模式将对象的实例化推迟到子类

新的需求，甲方现在要求添加如下需求：客户能够点不同地区的风味披萨，比如：北京奶酪披萨、伦敦希腊披萨等。如果使用简单工厂模式，要根据不同的地区创建不同的工厂类，不利于代码的可扩展性

工厂方法模式解决：将披萨项目的实例化的功能抽象成抽象方法，在不同的口味点餐子类中具体实现

```mermaid
classDiagram
class Pizza {
	#name: String
	+prepare() void
	+bake() void
	+cut() void
	+box() void
}
class BJCheessPizza {
	+prepare() void
}
class BJGreekPizza {
	+prepare() void
}
class LDCheessPizza {
	+prepare() void
}
class LDGreekPizza {
	+prepare() void
}
class OrderPizza {
	<<abstract>>
	+createPize(String type) Pizza
}
class BJOrderPizza {
	+createPize(String type) Pizza
}
class LDOrderPizza {
	+createPize(String type) Pizza
}
Pizza <|-- BJCheessPizza
BJCheessPizza <.. BJOrderPizza
BJGreekPizza <.. BJOrderPizza
Pizza <|-- BJGreekPizza
OrderPizza <|-- BJOrderPizza
OrderPizza <|-- LDOrderPizza
Pizza <|-- LDCheessPizza
LDCheessPizza <.. LDOrderPizza
LDGreekPizza <.. LDOrderPizza
Pizza <|-- LDGreekPizza
```

> **具体实现**

修改披萨的种类

```java
public class BJCheesePizza extends Pizza{
    @Override
    public void prepare() {
        setName("北京奶酪披萨");
        System.out.println("北京奶酪披萨 准备原材料");
    }
}

public class BJGreekPizza extends Pizza{
    @Override
    public void prepare() {
        setName("北京希腊披萨");
        System.out.println("北京希腊披萨 准备原材料");
    }
}
```

```java
public class LDCheesePizza extends Pizza{
    @Override
    public void prepare() {
        setName("伦敦奶酪披萨");
        System.out.println("伦敦奶酪披萨 准备原材料");
    }
}

public class LDGreekPizza extends Pizza{
    @Override
    public void prepare() {
        setName("伦敦希腊披萨");
        System.out.println("伦敦希腊披萨 准备原材料");
    }
}
```

修改`OrderPizza`为抽象类

```java
public abstract class OrderPizza {
    public OrderPizza() {
        String type = "";
        Pizza pizza = null;
        Scanner scanner = new Scanner(System.in);
        do {
            orderType = scanner.next();
            pizza = createPizza(type);

            if (pizza != null) {
                pizza.prepare();
                pizza.bake();
                pizza.cut();
                pizza.box();
            } else {
                break;
            }
        } while (true);
    }

    public abstract Pizza createPizza(String type);
}
```

创建北京披萨订单类与伦敦披萨订单类

```java
public class BJOrderPizza extends OrderPizza{
    @Override
    public Pizza createPizza(String type) {
        if (type.equals("cheese")) return new BJCheesePizza();
        if (type.equals("greek")) return new BJGreekPizza();
        return null;
    }
}

public class LDOrderPizza extends OrderPizza{
    @Override
    public Pizza createPizza(String type) {
        if (type.equals("cheese")) return new LDCheesePizza();
        if (type.equals("greek")) return new LDGreekPizza();
        return null;
    }
}
```

使用订单类时，可以根据需要创建不同的订单类

### 3.3 抽象工厂

1. 定义一个接口用于创建相关或有关依赖关系的对象簇，而无需指明具体的类
2. 使用者根据具体的需要去创建具体的子类

```mermaid
classDiagram
class Pizza {
	#name: String
	+prepare() void
	+bake() void
	+cut() void
	+box() void
}
class BJCheessPizza {
	+prepare() void
}
class BJGreekPizza {
	+prepare() void
}
class LDCheessPizza {
	+prepare() void
}
class LDGreekPizza {
	+prepare() void
}
class AbsFactory {
	<<interface>>
	+createPize(String type) Pizza
}
class BJFactory {
	+createPize(String type) Pizza
}
class LDFactory {
	+createPize(String type) Pizza
}
Pizza <|-- BJCheessPizza
Pizza <|-- BJGreekPizza
Pizza <|-- LDCheessPizza
Pizza <|-- LDGreekPizza
BJCheessPizza <.. BJFactory
BJGreekPizza <.. BJFactory
LDCheessPizza <.. LDFactory
LDGreekPizza <.. LDFactory
BJFactory ..|> AbsFactory
AbsFactory --o OrderPizza
LDFactory ..|> AbsFactory
```

披萨类与[工厂方法](#3.2 工厂方法)的披萨类相同

添加抽象层的接口`AbsFactory`

```java
public interface AbsFactory {
    public Pizza createPizza(String type);
}
```

添加`BJFactory`与`LDFactory`

```java
// BJFactory.java
public class BJFactory implements AbsFactory{
    @Override
    public Pizza createPizza(String type) {
        if (type.equals("cheese")) return new BJCheesePizza();
        if (type.equals("greek")) return new BJGreekPizza();
        return null;
    }
}

// LDFactory.java
public class LDFactory implements AbsFactory{
    @Override
    public Pizza createPizza(String type) {
        if (type.equals("cheese")) return new LDCheesePizza();
        if (type.equals("greek")) return new LDGreekPizza();
        return null;
    }
}
```

订单类

```java
public class OrderPizza {
    private final AbsFactory factory; // 聚合

    public OrderPizza(AbsFactory factory) {
        this.factory = factory;
        handleOrder();
    }

    private void handleOrder() {
        String type = "";
        Pizza pizza = null;
        Scanner scanner = new Scanner(System.in);
        do {
            type = scanner.next();
            pizza = factory.createPizza(type);

            if (pizza != null) {
                pizza.prepare();
                pizza.bake();
                pizza.cut();
                pizza.box();
            } else {
                break;
            }
        } while (true);
    }
}
```

## 4. 原型模式

1. 原型模式是指用原型实例指定创建对象的种类，并且通过拷贝这些原型，创建新的对象
2. 原型模式是一种创建型的设计模式，允许一个对象再创建另外一个可定制的对象，无需知道如何创建的细节
3. 工作原理：通过将一个原型对象传给那个要发动创建的对象，这个要发动创建的对象请求原型对象拷贝他们自己来实现创建

```mermaid
classDiagram
class Sheep {
	-name: String
    -color: String
	-age: Interger
	+Sheep(String name, String color, Integer color)
}
```

克隆羊问题：创建十只属性相同的克隆羊

```java
public class Sheep implements Cloneable{
    private String name;
    private String color;
    private Integer age;

    public Sheep(String name,
                 String color,
                 Integer age) {
        this.name = name;
        this.color = color;
        this.age = age;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

测试

```java
public class SheepTest {
    public static void main(String[] args) throws CloneNotSupportedException {
        Sheep sheep1 = new Sheep("Tom", "黄色", 3);
        Sheep sheep2 = (Sheep) sheep1.clone();
    }
}
```

浅拷贝和深拷贝：`java`的`clone`方法默认是浅拷贝，如果要进行深拷贝推荐使用序列化的方式

## 5.建造者模式

### 5.1 简介

建造者模式：又叫生成器模式，是一种对象构建模式。它可以将复杂对象的建造过程抽象出来(抽象类别)，使这个抽象过程的不同实现方法可以构造出不同表现(属性)的对象。简单来说，建造者模式就是一步一步创建一个复杂的对象，它允许用户只通过指定复杂对象的类型和内容就可以构建他们，用户不需要知道内部的具体构建细节

> **四个角色**

1. `Product`产品角色：一个具体的产品对象

2. `Builder`抽象建造者：创建一个`Product`对象的各个部件指定的接口/抽象类

3. `ConcreteBuilder`具体建造者：实现接口，构建和装配各个部件

4. `Director`指挥者：构建一个使用`Builder`接口/抽象类的对象。它有两个作用

   隔离了客户与对象的生产过程

   负责控制产品对象的生产过程

**项目需求**：建造一座房子，建造房子有打地基、砌墙、封顶操作，房子则有普通房子、高楼等

### 5.2 传统实现

```mermaid
classDiagram
class AbstractHouse {
	<<abstract>>
	#buildBasic() void
	#buildWalls() void
	#roofed() void
	+bulid() void
}
class CommonHouse {
	#buildBasic() void
	#buildWalls() void
	#roofed() void
}
class HighBuilding {
	#buildBasic() void
	#buildWalls() void
	#roofed() void
}
AbstractHouse <|-- CommonHouse
AbstractHouse <|-- HighBuilding
```

```java
// AbstractHouse.java
public abstract class AbstractHouse {
    protected abstract void buildBasic();
    protected abstract void buildWalls();
    protected abstract void roofed();
    public void build() {
        buildBasic();
        buildWalls();
        roofed();
    }
}

// CommonHouse.java
public class CommonHouse extends AbstractHouse{
    @Override
    protected void buildBasic() {
        System.out.println("普通房子打地基");
    }

    @Override
    protected void buildWalls() {
        System.out.println("普通房子砌墙");
    }

    @Override
    protected void roofed() {
        System.out.println("普通房子封顶");
    }
}
```

### 5.3 建造者实现

```mermaid
classDiagram
class HouseBuilder {
	<<abstract>>
	-house: House
	+buildBaisc() void
	+buildWalls() void
	+roofed() void
	+bulid() House
}
class House {
	<<产品>>
	-basic: String
    -wall: String
    -roofed: String
}
class CommonHouse {
	+buildBaisc() void
	+buildWalls() void
	+roofed() void
}
class HighBuilding {
	+buildBaisc() void
	+buildWalls() void
	+roofed() void
}
class HouseDirector {
	<<指挥者>>
	-houseBuilder: HouseBuilder
	+setHouseBuilder(HouseBuilder houseBuilder) void
}
HouseDirector o-- HouseBuilder
House --* HouseBuilder
HouseBuilder <|-- CommonHouse
HouseBuilder <|-- HighBuilding

```

1. 产品`House`

   ```java
   public class House {
       private String basic;
       private String wall;
       private String roofed;
   }
   ```

2. 抽象建造者

   ```java
   public abstract class HouseBuilder {
       protected House house = new House();
   
       // 建造房子
       public abstract void buildBasic();
       public abstract void buildWall();
       public abstract void roofed();
   
       // 将房子返回
       public House build() {
           return house;
       }
   }
   ```

3. 具体产品

   ```java
   public class CommonHouse extends HouseBuilder{
       @Override
       public void buildBasic() {
           System.out.println("普通房子打地基");
       }
   
       @Override
       public void buildWall() {
           System.out.println("普通房子砌墙");
       }
   
       @Override
       public void roofed() {
           System.out.println("普通房子封顶");
       }
   }
   ```

4. 指挥者

   ```java
   public class HouseDirector {
       private HouseBuilder houseBuilder = null;
   
       public HouseDirector(HouseBuilder houseBuilder) {
           this.houseBuilder = houseBuilder;
       }
   
       public void setHouseBuilder(HouseBuilder houseBuilder) {
           this.houseBuilder = houseBuilder;
       }
   
       // 建造房子
       public House constructHouse() {
           houseBuilder.buildBasic();
           houseBuilder.buildWall();
           houseBuilder.roofed();
           return houseBuilder.build();
       }
   }
   ```

5. 测试

   ```java
   @DisplayName("测试建造者模式")
   @Test
   public void testHouse() {
       // 房子
       CommonHouse commonHouse = new CommonHouse();
   
       // 指挥者
       HouseDirector houseDirector = new HouseDirector(commonHouse);
   
       // 建造房子
       House house = houseDirector.constructHouse();
   }
   ```

## 6. 适配器模式

> **简介**

1. 适配器`Adapter Pattern`将某个类的接口转换成客户端期望的另一个接口表示，主要迷弟是兼容性，让原本因接口不匹配不能在一起工作的两个类可以协同工作。别名为包装器`wrapper`
2. 适配器模式属于结构型模式
3. 主要分为三类：类适配器模式、对象适配器模式、接口适配器模式

> **工作原理**

1. 适配器模式：将一个类的接口转换成另一个接口。让原本接口不兼容的类可以兼容
2. 从用户的角度看不到被适配着，是解藕的
3. 用户调用适配器转化出来的目标接口方法，适配器再调用被适配者的相关接口方法

```mermaid
graph LR
source[被适配者src,需要被适配的类,接口,对象]--> adapter(适配器,Adapter) -->目标dist
```

### 6.1 类适配器

基本介绍：`Adapter`类，通过继承`src`类，实现`dist`类接口，完成`src`->`dist`的适配

案例分析：手机充电器，可以将`220V`的交流点变为`5V`的直流电，供手机使用

```mermaid
classDiagram
class Voltage220V {
	<<src>>
	+output220V() int
}
class Voltage5V {
	<<interface>>
	+output5V() void
}
class VoltageAdapter {
	<<适配器类>>
	+output5V() int
}
class Phone {
	+charging() void
}
Voltage220V <|-- VoltageAdapter
Voltage5V <.. Phone
Voltage5V <|.. VoltageAdapter
```

> **具体实现**

1. 被适配的类

   ```java
   public class Voltage220V {
       public int output220V() {
           System.out.println("电压为: 220V");
           return 220;
       }
   }
   ```

2. 适配接口

   ```java
   public interface Voltage5V {
       public int output5V();
   }
   ```

3. 适配器

   ```java
   public class VoltageAdapter extends Voltage220V implements Voltage5V{
       @Override
       public int output5V() {
           int src = output220V(); // 获取原本的结果
           int dist = src / 44;    // 处理转换
           return dist;
       }
   }
   ```

4. 手机类

   ```java
   public class Phone {
       public void charging(Voltage5V v) {
           if (v.output5V() == 5) {
               System.out.println("可以充电了");
               return;
           }
           System.out.println("电压大于5V不能充电");
       }
   }
   ```

5. 测试

   ```java
   @Test
   public void testPhone() {
       Phone phone = new Phone();
       phone.charging(new VoltageAdapter());
   }
   ```

> **注意事项**

1. `java`是单继承机制，所以类适配器需要`src`类是一个缺点，因为要求`dist`必须是接口
2. `src`类的方法在`Adapter`中都会暴露出来，也增加了使用的成本

### 6.2 对象适配器

1. 和类适配器模式相同，只是将`Adapter`类作修改，不是继承`src`类，而是持有`src`类的实例，已解决兼容性的问题。即：持有`src`类，实现`dist`接口
2. 根据**合成复用原则**，在系统中尽量使用关联关系来代替继承关系

```mermaid
classDiagram
class Voltage220V {
	<<src>>
	+output220V() int
}
class Voltage5V {
	<<interface>>
	+output5V() void
}
class VoltageAdapter {
	<<适配器类>>
	-voltage220V: Voltage220V
	+output5V() int
	+VoltageAdapter(Voltage220V voltage220V) void
}
class Phone {
	+charging() void
}
Voltage220V --o VoltageAdapter
Voltage5V <.. Phone
VoltageAdapter ..|> Voltage5V
```

> **具体实现**

修改`VoltageAdapter`

```java
// 适配器
public class VoltageAdapter implements Voltage5V{
    private final Voltage220V voltage220V;

    public VoltageAdapter(Voltage220V voltage220V) {
        this.voltage220V = voltage220V;
    }

    @Override
    public int output5V() {
        int dist = 0;
        if (voltage220V != null) {
            int src = voltage220V.output220V(); // 获取原本的结果
            dist = src / 44;    // 处理转换
            return dist;
        }
        return dist;
    }
}

// Phone
public class Phone {
    public void charging(Voltage5V v) {
        if (v.output5V() == 5) {
            System.out.println("可以充电了");
            return;
        }
        if (v.output5V() > 5 ) {
            System.out.println("电压大于5V不能充电");
        }
    }
}
```

测试

```java
@DisplayName("测试对象适配器模式")
@Test
public void testPhone() {
    Phone phone = new Phone();

    phone.charging(new VoltageAdapter(new Voltage220V()));
}
```

### 6.3 接口适配器

当不需要全部实现接口提供的方法时，可先设计一个抽象类实现接口，并未该接口中每个方法提供一个默认实现(空方法)，那么该抽象类的子类可有选择地覆盖父类的某些方法来实现需求

```mermaid
classDiagram
class Interface {
	<<Interface>>
	+operation1() void
    +operation2) void
    +operation3) void
    +operation4) void
}
class AbsAdapter {
	+operation1() void
    +operation2) void
    +operation3) void
    +operation4) void
}
Interface <|.. AbsAdapter
```

> **具体实现**

```java
// Interface
public interface Interface {
    void operation1();
    void operation2();
    void operation3();
    void operation4();
}

// AbsAdapter
public class AbsAdapter implements Interface{
    @Override
    public void operation1() {}

    @Override
    public void operation2() {}

    @Override
    public void operation3() {}

    @Override
    public void operation4() {}
}
```

测试使用 

```java
public class Client {
    @Test
    @DisplayName("接口适配器")
    public void testAbs() {
        AbsAdapter adapter = new AbsAdapter() {
            @Override
            public void operation1() {
                // 只需要重写要使用的方法即可
                System.out.println("使用了m1的方法");
            }
        };
        adapter.operation1();
    }
}
```

## 7. 桥接模式

> **基本介绍**

1. 桥接模式`Bridge`是指：将现实与抽象放在两个不同的类的层次中，使两个层次可以独立改变，它是一种结构型设计模式
2. `Bridge`模式基于类的最小设计原则，通过使用封装、聚合及继承等行为让不同的类承担不同的职责。它的主要特点是把抽象`Abstraction`与行为实现分离开来，从而可以保持各部分的独立性以及应对他们的功能扩展

> **案例分析**

现在对不同的手机类型(直立式、折叠式、滑盖式)实现编程：开机、关机、上网、打电话等

```mermaid
classDiagram
class Brand {
	<<Interface>>
    +open() void
    +close() void
    +call() void
}
class Vivo {
	+open() void
    +close() void
    +call() void
}
class XiaoMi {
	+open() void
    +close() void
    +call() void
}
class Phone {
	<<abstarct>>
	-brand: Brand
    #open() void
    #close() void
    #call() void
}
class FoldedPhone {
	+open() void
    +close() void
    +call() void
}
class UpRightPhone {
	+open() void
    +close() void
    +call() void
}
Brand --o Phone
Brand <|-- Vivo
Brand <|-- XiaoMi
Phone <|.. FoldedPhone
Phone <|.. UpRightPhone
```

> **具体实现**

1. `Brand`接口

   ```java
   public interface Brand {
       void open();
       void close();
       void call();
   }
   ```

2. `Brand`的实现类

   ```java
   // Vivo
   public class Vivo implements Brand{
       @Override
       public void open() {
           System.out.println("Vivo手机开机了");
       }
   
       @Override
       public void close() {
           System.out.println("Vivo手机关机了");
       }
   
       @Override
       public void call() {
           System.out.println("Vivo手机打电话");
       }
   }
   
   // XiaoMi
   public class XiaoMi implements Brand{
       @Override
       public void open() {
           System.out.println("小米手机开机了");
       }
   
       @Override
       public void close() {
           System.out.println("小米手机关机了");
       }
   
       @Override
       public void call() {
           System.out.println("小米手机打电话");
       }
   }
   ```

3. 桥接器`Phone`

   ```java
   public abstract class Phone {
       private final Brand brand;
   
       public Phone(Brand brand) {
           this.brand = brand;
       }
   
       protected void open() {
           brand.open();
       }
   
       protected void close() {
           brand.close();
       }
   
       protected void call() {
           brand.call();
       }
   }
   ```

4. 桥接器的实现类

   ```java
   // FoldedPhone
   public class FoldedPhone extends Phone{
       public FoldedPhone(Brand brand) {
           super(brand);
       }
   
       public void open() {
           super.open();
           System.out.println("折叠手机");
       }
   
       public void close() {
           super.close();
           System.out.println("折叠手机");
       }
   
       public void call() {
           super.call();
           System.out.println("折叠手机");
       }
   }
   
   // UpRightPhone
   public class UpRightPhone extends Phone{
       public UpRightPhone(Brand brand) {
           super(brand);
       }
   
       public void open() {
           super.open();
           System.out.println("直立手机");
       }
   
       public void close() {
           super.close();
           System.out.println("直立手机");
       }
   
       public void call() {
           super.call();
           System.out.println("直立手机");
       }
   }
   ```

5. 测试

   ```java
   public class Client {
       @Test
       @DisplayName("测试桥接模式")
       public void test () {
           Phone phone = new FoldedPhone(new XiaoMi());
           phone.open();
           phone.call();
           phone.close();
       }
   }
   ```

> **注意事项**

1. 实现了抽象和实现部分的分离，从而极大的提供了系统的灵活性，让抽象部分和实现独立开来，这有助于系统进行分层设计，从而阐述更好的结构化系统
2. 对于系统的高层部分，只需要知道抽象部分和实现部分的接口就可以了，其他的部分有具体业务来完成
3. 桥接模式替代多层继承方案，可以减少子类的个数，降低系统的管理和维护成本
4. 桥接模式的引入增加了系统的理解和设计难度，由于聚合关联关系建立在抽象层，要求开发者针对抽象进行设计和编程
5. 桥接模式要求正确识别出系统中两个独立变化的维度，因此其使用范围有一定的局限性，即需要有这样的应用场景

## 8. 装饰者模式

装饰者模式：动态的将新功能附加到对象上。在对象功能扩展方面，它比继承更加有弹性，装饰者模式体现了开闭原则

> **案例分析**

星巴克咖啡订单

1. 咖啡种类/单品咖啡：`Espresso`意大利浓咖啡、`ShortBlack`、`LongBlack`美式咖啡、`Decaf`无因咖啡
2. 调料：`Milk`、`Soy`豆浆、`Chocolate`
3. 用户可以点单品咖啡、也可以是单品咖啡+调料组合

```mermaid
classDiagram
class Drink {
	<<abstract>>
	-description: String
	-price: Double
    +getDescription() String
    +getPrice() double
    +setDescription(String description) String
    +setPrice(double price) String
    +cost() void
}
class ShortBlack {
	+cost()
}
class Decaf {
	+cost()
}
class Espresso {
	+cost()
}
class LongBlack {
	+cost()
}
class Coffee {
	+cost()
}
class Decorator {
	-drink: Drink
	+Decorator(Drink drink) void
    +getDescription() String
	+cost()
}
class Chocolate {
	+Chocolate(Drink drink) void
    +getDescription() String
	+cost()
}
class Milk {
	+Milk(Drink drink) void
    +getDescription() String
	+cost()
}
class Soy {
	+Soy(Drink drink) void
    +getDescription() String
	+cost()
}
Coffee --|> Drink

ShortBlack --|> Coffee
Decaf --|> Coffee
Espresso --|> Coffee
LongBlack --|> Coffee

Drink --* Decorator

Decorator <|-- Chocolate
Decorator <|-- Milk
Decorator <|-- Soy
```

**说明**

1. `Drink`类就是`Component`抽象类
2. `ShortBlack`、`Decaf`、`Espresso`、`LongBlack`就是单品咖啡
3. `Decorator`是一个装饰类，含一个被装饰的对象`Drink`
4. `Decorator`的`cost`方法用于计算费用

> **具体实现**

1. 顶层抽象类

   ```java
   public abstract class Drink {
       private String description;
       private double price;
   
       // 子类实现
       public abstract double cost();
   
       public void setDescription(String description) {
           this.description = description;
       }
   
       public void setPrice(double price) {
           this.price = price;
       }
   
       public String getDescription() {
           return description;
       }
   
       public double getPrice() {
           return price;
       }
   }
   ```

2. `Coffee`用于提取单品咖啡的共有特点

   ```java
   public class Coffee extends Drink{
       @Override
       public double cost() {
           return super.getPrice();
       }
   }
   ```

3. 单品咖啡类

   ```java
   // Espresso
   public class Espresso extends Coffee{
       public Espresso() {
           setDescription("意大利咖啡 ");
           setPrice(6.0);
       }
   }
   
   // LongBlack
   public class LongBlack extends Coffee{
       public LongBlack() {
           setDescription("LongBack咖啡 ");
           setPrice(7.0);
       }
   }
   
   // ShortBlack
   public class ShortBlack extends Coffee{
       public ShortBlack() {
           setDescription("ShortBlack咖啡 ");
           setPrice(8.0);
       }
   }
   ```

4. 装饰器

   ```java
   public class Decorator extends Drink{
       private final Drink drink;
   
       public Decorator(Drink drink) {
           this.drink = drink;
       }
   
       @Override
       public double cost() {
           // 自己的价格加上调料的价格
           return super.getPrice() + drink.cost();
       }
   
       @Override
       public String getDescription() {
           return super.getDescription() + " "
                   + super.getPrice() + " " 
                   + drink.getDescription();
       }
   }
   ```

5. 配料类

   ```java
   // Chocolate
   public class Chocolate extends Decorator{
       public Chocolate(Drink drink) {
           super(drink);
           setDescription("巧克力 ");
           setPrice(3.0);
       }
   }
   
   // Milk
   public class Milk extends Decorator{
       public Milk(Drink drink) {
           super(drink);
           setDescription("牛奶 ");
           setPrice(4.0);
       }
   }
   
   // Soy
   public class Soy extends Decorator{
       public Soy(Drink drink) {
           super(drink);
           setDescription("豆浆 ");
           setPrice(5.0);
       }
   }
   ```

6. 测试

   ```java
   public class Client {
       @Test
       @DisplayName("测试装饰者模式")
       public void test() {
           // 2份巧克力，一份牛奶的LongBlack
           Drink coffee = new LongBlack(); // 7
   
           coffee = new Milk(coffee); // 4
   
           coffee = new Chocolate(coffee); // 3
           coffee = new Chocolate(coffee); // 3
   
           System.out.println(coffee.cost()); // 17.0
           System.out.println(coffee.getDescription()); 
           // 巧克力  3.0 巧克力  3.0 牛奶  4.0 LongBack咖啡 
       }
   }
   ```

## 9.组合模式

> **基本介绍**

1. 组合模式`Composite Pattern`，又叫部分整体模式，它创建了对象组的树形结构，将对象组合成树状结构以表示"整体-部分"的层次关系
2. 组合模式依据树形结构来组合对象，用来表示部分以及整体层次，属于结构型模式
3. 组合模式使得用户对单个和组合对象的访问具有一致性，即：组合能让客户以一致的方式处理个别对象以及组合对象

```mermaid
classDiagram
class Component {
	<<Interface>>
	+operation() void
	+add(Component component) void
	+remove(Component component) void
	+getChild(int id) void
}
class Leaf {
	+operation() void
}
class Composite {
	+operation() void
	+add(Component component) void
	+remove(Component component) void
	+getChild(int id) void
}
Component <|-- Leaf
Component <|-- Composite
Composite o-- Component
```

**上图介绍**

1. `Component`：这是组合中对象声明接口，在适当情况下，实现所有类共有的接口默认行为，用于访问和管理`Component`子部件，`Component`可以是抽象类或者接口
2. `Leaf`：在组合中表示叶子节点，叶子节点没有子节点
3. `Composite`：非叶子节点，用于存储子部件，在`Component`接口中实现子部件的相关操作，增删改查

组合模式主要用于解决：要处理的对象可以生成一棵树形结构，而我们要对树上的节点和叶子节点进行操作时，它能够提供一致的方式，而不考虑它是节点还是叶子

> **需求分析**

编写程序展示一个学校院系结构：在一个页面中展示出学校的院系组成，一个学校有多个院校，一个学院有多个系

```mermaid
classDiagram
class OrganizationComponent {
	<<abstract>>
	#add(OrganizationComponent organizationComponent) void
	#remove(OrganizationComponent organizationComponent) void
    #print() void
}
class Department {
	
}
class College {
	
}
class University {
	
}

OrganizationComponent <|-- Department
OrganizationComponent <|--o College
OrganizationComponent <|--o University
```

1. `OrganizationComponent`

   ```java
   public abstract class OrganizationComponent {
       private String name; // 名字
       private String des; // 说明
   
       public OrganizationComponent(String name, String des) {
           this.name = name;
           this.des = des;
       }
   
       protected void add(OrganizationComponent organizationComponent) {
           throw new UnsupportedOperationException();
       }
   
       protected void remove(OrganizationComponent organizationComponent) {
           throw new UnsupportedOperationException();
       }
   
       protected abstract void print();
   
       public String getName() {
           return name;
       }
   
       public String getDes() {
           return des;
       }
   
       public void setName(String name) {
           this.name = name;
       }
   
       public void setDes(String des) {
           this.des = des;
       }
   }
   ```

2. `Department`

   ```java
   public class Department extends OrganizationComponent{
   
       public Department(String name, String des) {
           super(name, des);
       }
   
       @Override
       public String getName() {
           return super.getName();
       }
   
       @Override
       public String getDes() {
           return super.getDes();
       }
   
       @Override
       protected void print() {
           System.out.println(getName());
       }
   }
   ```

3. `College`

   ```java
   public class Department extends OrganizationComponent{
   
       public Department(String name, String des) {
           super(name, des);
       }
   
       @Override
       public String getName() {
           return super.getName();
       }
   
       @Override
       public String getDes() {
           return super.getDes();
       }
   
       @Override
       protected void print() {
           System.out.println(getName());
       }
   }
   ```

4. `University`

   ```java
   public class University extends OrganizationComponent{
   
       private final List<OrganizationComponent> organizationComponents = new ArrayList<>();
   
       public University(String name, String des) {
           super(name, des);
       }
   
       @Override
       protected void add(OrganizationComponent organizationComponent) {
           organizationComponents.add(organizationComponent);
       }
   
       @Override
       protected void remove(OrganizationComponent organizationComponent) {
           organizationComponents.remove(organizationComponent);
       }
   
       @Override
       public String getName() {
           return super.getName();
       }
   
       @Override
       public String getDes() {
           return super.getDes();
       }
   
       @Override
       protected void print() {
           System.out.println("-------------" + getName() + "-------------");
           for (OrganizationComponent organizationComponent : organizationComponents) {
               organizationComponent.print();
           }
       }
   }
   ```

5. 测试

   ```java
   public class Client {
       @Test
       @DisplayName("测试组合模式")
       public void test() {
           // 创建学校
           OrganizationComponent university = new University("清华大学", "中国顶尖院校");
   
           // 创建学院
           OrganizationComponent college1 = new College("计算机学院", "计算机学院");
           OrganizationComponent college2 = new College("信息工程学院", "信息工程学院");
   
           // 创建专业
           college1.add(new Department("软件工程", "软件工程不错"));
           college1.add(new Department("网络工程", "网络工程不错"));
           college1.add(new Department("计算机科学与技术", "计算机科学与技术不错"));
           college2.add(new Department("网络安全", "网络安全"));
           college2.add(new Department("通信工程", "通信工程不过好学"));
   
           // 将学院加入到学校中
           university.add(college1);
           university.add(college2);
   
           university.print();
       }
   }
   ```

   