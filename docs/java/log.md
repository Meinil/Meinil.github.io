---
title: Java日志
date: '2021-07-25'
sidebar: 'auto'
categories:
 - java
tags:
 - java
---

## 1. 日志简介

### 1.1 日志框架的作用

1. 控制日志输出的内容和格式
2. 控制日志输出的位置
3. 日志相关的优化，如异步操作、归档、压缩。。
4. 日志系统的维护
5. 面向接口开发

### 1.2 主流的日志框架

`JUL`(`java.util.logging`)，`java`原生框架

`log4j`，`Apache`的一个开源项目

`logback`，由`log4j`的作者的另外一个开元项目，一个可靠、通用且灵活的`java`日志框架

`log4j2`，`log4j`的第二个版本，各方面都与`logback`机器相似。具有插件式结构、配置文件优化等特征(`Springboot1.4`版本之后不再支持`log4j`)

`JCL`

`SLF4j`

## 2. JUL

`JUL`全称`Java Util Logging`，他是`java`原生的日志框架，使用时不需要另外引用第三方的依赖，相对其他的框架使用方便，学习简单

### 2.1 JUL组件

![](https://gitee.com/dingwanli/picture/raw/master/20210702193804.png)

`Logger`：被称为记录器，应用程序通过获取`Logger`对象，抵用其`API`来发布日志信息。`Logger`通常被认为是访问日志系统的入口程序。

`Handler`：处理器，每个`Logger`都会关联一个或者是一组`Handler`，`Logger`会将日志交给关联的`Handler`去做处理，由`Handler`负责将日志做记录。`Handler`具体实现了日志的输出位置，比如可以输出到控制台或者是文件中等等。

`Filter`：过滤器，根据需要定制哪些信息会被记录，哪些信息会被忽略

`Formatter`：格式化组件，它负责独立日志中的数据和信息进行转换和格式化，所以它决定了我们输出日志最终的形式

`Level`：日志的输出级别，每条日志消息都有一个关联的级别。我们根据输出级别的设置，用来展现最终所呈现的日志信息

### 2.2 快速入门

```java
@DisplayName("JULTest")
public class JULTest {

    @Test
    public void test() {
        // 参数为当前类的全路径
        Logger logger = Logger.getLogger("com.valid.jul.JULTest");

        // 第一种输出方式
        logger.info("输出info信息");

        // 第二种方式，调用通用的log方法，然后在里面通过Level类型来定义日志的级别参数，以及搭配日志输出信息的才拿书
        logger.log(Level.INFO, "输出info信息");
    }
}
// 7月 02, 2021 8:27:47 下午 com.valid.jul.JULTest test1
// 信息: 输出info信息
// 7月 02, 2021 8:27:47 下午 com.valid.jul.JULTest test1
// 信息: 输出info信息
```

打印变量

```java
@DisplayName("JULTest")
public class JULTest {
    @Test
    public void test() {
        // 打印变量
        String name = "张三";
        int age = 23;
        logger.log(Level.INFO, "学生的姓名为：{0},年龄：{1}", new Object[]{name, age});
    }
}
// 7月 03, 2021 8:17:54 上午 com.valid.jul.JULTest test1
// 信息: 学生的姓名为：张三,年龄：23
```

### 2.3 日志级别

`SEVERE`：(最高级)错误

`WARNING`：警告

`INFO`：(默认级别)消息

`CONFIG`：配置

`FINE`：详细信息(少)

`FINER`：详细信息(中)

`FINEST`：详细信息(多)

两个特殊的级别：`OFF`(可用来关闭日志记录)，`ALL`(启用所有消息的日志记录)

```java
@DisplayName("JULTest")
public class JULTest {
    @Test
    @DisplayName("日志级别")
    public void test() {
        Logger logger = Logger.getLogger("com.valid.jul.JULTest");

        // 默认只打印info以及比info高的日志信息
        // 通过setLevel设置日志级别没有效果，必须搭配handler才会生效
        logger.setLevel(Level.CONFIG);

        logger.severe("severe信息");
        logger.warning("warning信息");
        logger.info("info信息");
        logger.config("config信息");
        logger.fine("fine信息");
        logger.finest("finest信息");
    }
}
```

自定义日志级别

```java
@DisplayName("JULTest")
public class JULTest {
    @Test
    @DisplayName("自定义日志级别")
    public void test() {
        Logger logger = Logger.getLogger("com.valid.jul.JULTest");

        // 关闭默认的日志打印方式
        logger.setUseParentHandlers(false);

        // 设置处理器，此处使用控制台日志处理器
        ConsoleHandler handler = new ConsoleHandler();
        // 创建日志格式化组件对象
        SimpleFormatter formatter = new SimpleFormatter();
        // 在处理器中设置输出格式
        handler.setFormatter(formatter);

        // 在记录器中添加处理器，注意一个logger可以添加多个处理器
        logger.addHandler(handler);

        // 设置日志的打印级别
        logger.setLevel(Level.CONFIG);
        handler.setLevel(Level.CONFIG);

        logger.config("config信息");
    }
}
```

### 2.4 设置日志的输出位置

假设要把日志输出到当前项目根目录下的`/log/mylog.log`文件中，先在根目录下新建`log`目录

```java
@DisplayName("JULTest")
public class JULTest {
    @Test
    @DisplayName("设置日志的输出位置")
    public void test() throws IOException {
        Logger logger = Logger.getLogger("com.valid.jul.JULTest");
        logger.setUseParentHandlers(false);

        FileHandler handler = new FileHandler("./log/mylog.log");
        handler.setFormatter(new SimpleFormatter());

        logger.addHandler(handler);
        logger.setLevel(Level.INFO);
        handler.setLevel(Level.INFO);

        logger.info("输出日志到文件");
    }
}
```

### 2.5 父子关系

`JUL`中`Logger`之间是存在"父子"关系的，这种父子关系不是继承关系，而是通过树状结构存储的

父亲所做的设置，也能够同时作用于儿子

```java
@DisplayName("JULTest")
public class JULTest {
    @Test
    @DisplayName("父子关系")
    public void test() {
        Logger logger1 = Logger.getLogger("com.valid.jul"); // 父亲是RootLogger
        Logger logger2 = Logger.getLogger("com.valid.jul.JULTest");

        System.out.println(logger2.getParent() == logger1); // true
        System.out.println(logger2.getParent().getName()); // com.valid.jul
    }
}
```

### 2.6 配置文件

#### 2.6.1 简介

默认配置文件的位置在`JAVA_HOME/jre/lib/logging.properties`

```properties
# RootLogger使用的处理器，在获取RootLogger对象时进行的设置
# 默认的情况下，下述配置的是控制台的处理器，只能往控制台上进行输出操作
# 如果想要添加其他的处理器，在当前处理器类后面以逗号的形式进行分隔，可以添加多个处理器
handlers= java.util.logging.ConsoleHandler

# RootLogger的日志级别
# 默认的情况下，这是全局的日志级别，如果不手动配置其他的日志级别
# 则默认输出下述配置的级别以及更高的级别
.level= INFO

# 文件处理器属性的配置
# 输出日志文件的路径，windows默认是在C:\Users\用户名\java%u.log
java.util.logging.FileHandler.pattern = %h/java%u.log
# 输出日志文件的限制(50000字节)
java.util.logging.FileHandler.limit = 50000
# 日志文件的数量
java.util.logging.FileHandler.count = 1
# 输出日志的格式，默认是以XML的方式进行的输出
java.util.logging.FileHandler.formatter = java.util.logging.XMLFormatter

# 控制台处理器属性设置
# 控制台输出默认的级别
java.util.logging.ConsoleHandler.level = INFO
# 控制台默认输出的格式
java.util.logging.ConsoleHandler.formatter = java.util.logging.SimpleFormatter

# 也可以将日志级别设定到具体的某个包下
# com.xyz.foo.level = SEVERE
```

#### 2.6.2 自定义配置文件

假设要读取当前项目根目录下的`logging.properties`

1. 在当前项目根目录下新建`logging.properties`

2. 填写相关配置信息

3. 编码

    ```java
    @DisplayName("JULTest")
    public class JULTest {
        @Test
        @DisplayName("配置文件")
        public void test6() throws IOException {
            InputStream input = new FileInputStream("./logging.properties");
    
            // 获取日志管理器对象
            LogManager logManager = LogManager.getLogManager();
    
            // 读取自定义的配置文件
            logManager.readConfiguration(input);
    
            Logger logger = Logger.getLogger("com.valid.jul.JULTest");
    
    		// 打印日志
        }
    }
    ```

如果将日志设置输出到文件，应用的每一次启动产生的日志默认都会将之前的日志信息覆盖，可以设置写入到文件为追加。可以通过下列配置设置为追加

```properties
java.util.logging.FileHandler.append = true
```

## 3. Log4j

`Log4j`是`Apache`的一个开源项目，通过使用`Log4j`，我们可以控制日志信息输送的目的地是控制台、文件、`GUI`组件，甚至是套接口服务器、`NT`的时间记录器、`UNIX Syslog`守护进程等；我们也可以控制每一条日志的输出格式；通过定义每一条日志信息的级别，我们能够更加细致地控制日志的生成过程。[官网](https://logging.apache.org/log4j/1.2/)

### 3.1 组件

`Log4j`主要由`Loggers`(日志记录器)、`Appenders`(输出控制器)和`Layout`(日志格式化器)组成。其中`Loggers`控制日志的输出以及输出级别(`JUL`做日志级别`Level`)；`Appenders`指定日志的输出方式(输出到控制台、文件等);`Layout`控制日志信息的输出格式

#### 3.1.1 Loggers

日志记录器，负责收集处理日志记录，实例的命名就是类的全限定名，如`org.example.xxx`，`Logger`的名字大小写敏感，其命名有继承机制；例如：`name`为`org.example.xxx`的`logger`会继承`name`为`org.example`的`logger`。`Log4j`中有一个特殊的`logger`叫做`root`，它是所有`logger`的根，也就意味着其他所有的`logger`都会直接或者间接地继承自`root`。`root logger`可以用`Logger.getRootLogger()`方法获取。自`log4j 1.2`以来，`Logger`类已经取代了`Category`类。对于熟悉早期版本的`Log4j`的人来说，`Logger`类可以被视为`Category`类的别名

关于日志的级别信息，例如`DEBUG`、`INFO`、`WARN`、`ERROR`...级别是分大小的，

```
DEBUG < INFO < WARN < ERROR
```

级别用于指定这条日志信息的重要程度，`Log4j`输出日志的规则是：只输出级别不低于设定级别的日志信息，假设`Loggers`级别设定为`INFO`，则`INFO`、`WARN`、`ERROR`级别的日志信息都会输出，而级别比`INFO`低的`DEBUG`则不会输出

#### 3.1.2 Appenders

记录日志以及定义日志的级别仅仅是`Log4j`的基本功能，`Log4j`日志系统还提供许多强大的功能，比如允许把日志输出到不同的地方，如控制台`Console`、文件`Files`等，可以根据天数或者文件大小产生新的文件，可以以流的形式发送到其他地方等等

常用的`Appenders`

1. `ConsoleAppender`将日志输出到控制台
2. `FileAppender`将日志输出到文件中
3. `DailyRollingFileAppender`将日志输出到一个日志文件，并且每天输出到一个新的文件
4. `RollingFileAppender`将日志信息输出到一个日志文件，并且指定文件的尺寸，当文件大小达到指定尺寸时，会自动把文件改名，同时产生一个新的文件
5. `JDBCAppender`把日志信息保存到数据库中

#### 3.1.3 Layouts

有时用户希望根据自己的喜好格式化自己的日志输出，`Log4j`可以在`Appenders`的后面附加`Layouts`来完成这个功能。`Layouts`提供四种日志输出样式，如根据`HTML`样式、自由指定样式、包含日志级别与信息的样式和包含日志时间、线程、类别等信息的样式。

常用`Layouts`

1. `HTMLLayout`格式化日志输出为`HTML`表格形式
2. `SimpleLayout`简单的日志输出格式化，打印的日志格式如默认`INFO`级别的消息
3. `PatternLayout`最强大的格式化组件，可以根据自定义格式输出日志，如果没有指定转换格式，就是用默认的转换格式

`Log4j`格式化采用类似于`C`语言的`printf`函数的打印格式化日志信息，具体的占位符及其含义如下

| 占位符  | 含义                                                         |
| ------- | ------------------------------------------------------------ |
| %m      | 输出代码中指定的日志信息                                     |
| %p      | 输出优先级，及DEBUG、INFO等                                  |
| %n      | 换行符                                                       |
| %r      | 输出自应用启动到该log信息耗费的毫秒数                        |
| %c      | 输出打印语句所属的类的全名                                   |
| %t      | 输出产生该日志的线程全名                                     |
| %d      | 输出服务器当前时间，默认为ISO8601，也可以指定格式，如：%d{yyyy年MM月dd日 HH:mm:ss} |
| %l      | 输出日志时间发生的位置，包括类名、线程、及在代码中的行数。如：Test.main(Test.java:10) |
| %F      | 输出日志消息产生时所在的文件名称                             |
| %L      | 输出代码中的行号                                             |
| %%      | 输出一个"%"字符                                              |
| %5c     | 输出类的全名，最小宽度是5，默认右对齐                        |
| %-5c    | 输出类的全名，最小宽度是5，默认左对齐                        |
| %.5c    | 输出类的全名，最大宽度是5，会将左边多出的字符截掉            |
| %20.30c | 输出类的全名，名称<20补空格并且右对齐，大于30字符，从左边截掉多余的字符 |

### 3.2 快速入门

依赖

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.7.2</version>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

> 入门案例

```java
public class Log4jTest {
    @Test
    @DisplayName("快速入门")
    public void test() {
        // 加载初始化配置
        BasicConfigurator.configure();
        // 获取logger
        Logger logger = Logger.getLogger(Log4jTest.class);
        logger.info("hahhahhaha");
    }
}
```

### 3.3 日志级别

`Log4j`提供了8个级别的日志输出，分别为

1. `ALL`最低等级用于打开所有级别的日志记录
2. `TRACE`程序推进下的追踪信息，这个追踪信息的日志级别非常低，一般情况下不会使用
3. `DEBUG`指出细粒度信息事件对调试应用程序是非常有帮助的，主要是配合开发，在开发过程中打印一些重要的运行信息(默认级别)
4. `INFO`消息的粗粒度级别运行信息
5. `WARN`表示警告，程序在运行过程中会出现的有可能会发生的隐形的错误(有些信息不是错误，但是这个级别的输出的目的就是为了给程序员以提示)
6. `ERROR`系统的错误信息，发生的错误不影响系统的运行
7. `FATAL`表示严重错误，一旦出现系统就不能继续运行的严重错误，如果这种级别的错误出现了，表示程序可以停止运行了
8. `OFF`最高等级的级别，用户关闭所有的日志记录

### 3.4 配置文件

在`Logger.getLogger()`方法中可以看到`Logger`对象是由`LogManager`(日志管理器)提供。`LogManager`中包含以下集中配置文件的形式

```java
static public final String DEFAULT_CONFIGURATION_FILE = "log4j.properties";
static final String DEFAULT_XML_CONFIGURATION_FILE = "log4j.xml";  
static final public String DEFAULT_CONFIGURATION_KEY="log4j.configuration";
static final public String CONFIGURATOR_CLASS_KEY="log4j.configuratorClass";
public static final String DEFAULT_INIT_OVERRIDE_KEY ="log4j.defaultInitOverride";
```

#### 3.4.1 配置文件参考

最常用的是`log4j.properties`，通过`LoggerManager`中的静态代码块可知，系统默认是从当前类路径下找`log4j.properties`，对于`maven`而言则是`resources`。配置文件参考

```properties
# 第一个参数日志级别，之后的参数都为输出的位置(自定义的名称)
log4j.rootLogger=INFO,console
# console为自定义的appender的名字
log4j.appender.console=org.apache.log4j.ConsoleAppender
# 日志格式
log4j.appender.console.layout=org.apache.log4j.SimpleLayout
```

#### 3.4.2 输出格式

`Log4j`本身提供的日志格式并不好用，所以会用到自定义的格式`PatternLayout`

在配置文件中书写，[占位符](#3.1.3 Layouts)

```properties
log4j.appender.console.layout=org.apache.log4j.PatternLayout
log4j.appender.console.layout.conversionPattern=%d{yyyy年MM月dd日} %r [%t] %-5p %c %x - %m%n
# 2021年07月12日 1 [main] INFO  com.valid.log.Log4jTest  - info信息
```

#### 3.4.3 输出到文件

配置文件中书写

```properties
# 第一个参数日志级别，之后的参数都为输出的位置(自定义的名称)
log4j.rootLogger=DEBUG,file

# 输出到文件
log4j.appender.file=org.apache.log4j.FileAppender
# 第一个file是自定义的名称，第二个file是用来指定日志的输出位置的属性
log4j.appender.file.file=./log/log.log
# 输出的文件编码
log4j.appender.file.encoding=utf-8
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.conversionPattern=%d{yyyy年MM月dd日} %r [%t] %-5p %c %x - %m%n
```

### 3.5 日志拆分

#### 3.5.1 按文件大小拆分

当日志过多时，都输出到同一个文件中不方便管理和维护，为此`FileAppender`提供了可以进行日志拆分的子类

```properties
# 第一个参数日志级别，之后的参数都为输出的位置(自定义的名称)
log4j.rootLogger=DEBUG,file

# 输出到文件
log4j.appender.file=org.apache.log4j.RollingFileAppender
log4j.appender.file.file=./log/log.log
log4j.appender.file.encoding=utf-8
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.conversionPattern=%d{yyyy年MM月dd日} %r [%t] %-5p %c %x - %m%n
# 日志拆分的大小
log4j.appender.file.maxFileSize=1MB
# 日志文件的数量
log4j.appender.file.maxBackupIndex=5
```

上述配置表明，当文件超过1MB时会生成另外一个文件，文件的数量最多是5个。如果5个文件都存满了，则会覆盖旧的日志文件

#### 3.5.2 按时间拆分

```properties
# 第一个参数日志级别，之后的参数都为输出的位置(自定义的名称)
log4j.rootLogger=DEBUG,file

# 日志拆分 按时间拆分
log4j.appender.file=org.apache.log4j.DailyRollingFileAppender
log4j.appender.file.file=./log/log4j.log
log4j.appender.file.encoding=utf-8
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.conversionPattern=%d{yyyy年MM月dd日} %r [%t] %-5p %c %x - %m%n
# 按天拆分
log4j.appender.file.datePattern='.'yyyy-MM-dd
```

### 3.6 持久化到数据库

首先创建表结构(字段的制定可以根据需求进行调整)

```sql
CREATE TABLE tb_log (
	id INT ( 11 ) NOT NULL AUTO_INCREMENT,
	NAME VARCHAR ( 255 ) DEFAULT NULL COMMENT '项目名称',
	create_time VARCHAR ( 255 ) DEFAULT NULL COMMENT '创建时间',
	LEVEL VARCHAR ( 255 ) DEFAULT NULL COMMENT '日志级别',
	category VARCHAR ( 255 ) DEFAULT NULL COMMENT '所在类的全路径',
	fileName VARCHAR ( 255 ) DEFAULT NULL COMMENT '文件名称',
	message VARCHAR ( 255 ) DEFAULT NULL COMMENT '日志信息',
PRIMARY KEY ( id ) 
)
```

编写配置文件

```properties
# 第一个参数日志级别，之后的参数都为输出的位置(自定义的名称)
log4j.rootLogger=DEBUG,db

log4j.appender.db=org.apache.log4j.jdbc.JDBCAppender
# 驱动
log4j.appender.db.Driver=com.mysql.cj.jdbc.Driver
# URL
log4j.appender.db.URL=jdbc:mysql://localhost:3306/test
# 用户名密码
log4j.appender.db.User=root
log4j.appender.db.Password=123456
# sql语句
log4j.appender.db.layout=org.apache.log4j.PatternLayout
log4j.appender.db.Sql=INSERT INTO tb_log(name, create_time, level, category, fileName, message) VALUES('project_log', '%d{yyyy-MM-dd HH:mm:ss}', '%p', '%c', '%F', '%m')
```

### 3.7 自定义Logger

之前所创建的`Logger`默认都是继承`rootLogger`，我们可以自定义`logger`，让其他`logger`来继承这个`logger`。`Logger`的继承关系是按照包结构进行指定的

在配置文件中配置

```properties
log4j.logger.[类的全路径]=日志级别, 输出位置
```

从输出位置来看：如果根据节点的`logger`和自定义父`logger`配置的输出位置是不同的，则取二者的并集，即配置的位置都会进行输出操作。如果二者配置的日志级别不同，主要按照我们自定义的父`logger`的级别进行输出

## 4. JCL

### 4.1 JCL简介

全称为`Jakarta Commons Logging`，是`Apache`提供的一个通用日志`API`。

用户可以自由选择第三方的日志组件作为具体实现，像`log4j`，或者`JDK`的`JUL`，`common-logging`内部有一个`Simple logger`的简单实现，但是功能很弱。所以使用`common-logging`，通常是搭配着`log4j`以及其他日志框架来使用

使用它的好处就是，代码依赖是`common-logging`而非`log4j`的`API`，避免了和具体的日志`API`直接耦合，在有必要时，可以更改日志实现的第三方库 

`JCL`有两个基本的抽象类：`Log`日志记录器，`LogFactory`日志工厂

### 4.2 案例演示

依赖

```xml
<dependency>
    <groupId>commons-logging</groupId>
    <artifactId>commons-logging</artifactId>
    <version>1.2</version>
</dependency>
```

```java
public class JCLTest {
    @Test
    @DisplayName("快速入门")
    public void test1() {
        Log log = LogFactory.getLog(JCLTest.class);
        log.info("info信息");
    }
}
```

`JCL`默认情况下，会使用`JUL`日志框架做日志记录操作。使用原则：如果有`log4j`，优先使用`log4j`。如果没有任何第三方日志框架的时候，使用的就是`JUL`

## 5. SLF4J

外观模式：外部与一个子系统的通信必须通过一个统一的外观对象进行，使得子系统更容易理解。通用日志`API`所使用的正是外观模式

[SLF4J官网](http://www.slf4j.org/)

### 5.1 简介

简单日志门面(`Simple Logging Facade For Java`)`SLF4J`主要是为了给`java`日志访问提供一套标准、规范的`API`框架，其主要意义在于提供接口，具体的实现可以交给其他日志框架，例如`log4j`和`logback`等。当然`slf4j`自己也提供了功能较为简单的实现，但是一般很少用到。对于一般的`Java`项目而言，日志框架会选择`slf4j-api`作为门面，配上具体的实现框架(`log4j`、`logback`等)，中间使用桥接器完成桥接。

### 5.2 桥接技术

通常，我们依赖的某些组件依赖于`SLF4J`以外的日志`API`。我们可能还假设这些组件在不久的将来不会切换到`SLF4J`。为了处理这种情况，`SLF4J`附带了几个桥接模块，这些模块会将对`log4j`，`JCL`和`java.util.logging API`的调用重定向为行为，就好像是对`SLF4J API`进行的操作一样

### 5.3 案例

依赖

```xml
<!--核心依赖-->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.30</version>
</dependency>
<!--简单日志实现-->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-simple</artifactId>
    <version>1.7.30</version>
</dependency>
```

`SLF4J`对日志的级别划分`trace`、`debug`、`info`、`warn`、`error`五个级别

```java
public class SLF4JTest {
    @Test
    @DisplayName("SLF4J入门")
    public void test() {
        Logger logger = LoggerFactory.getLogger(SLF4JTest.class);
        logger.trace("trace信息");
        logger.debug("debug信息");
        logger.info("info信息");
        logger.warn("warn信息");
        logger.error("error信息");
    }
}
```

在没有任何日志框架集成的情况下，默认使用的是`SLF4J`自带的日志框架

> 占位符输出

```java
public class SLF4JTest {
    @Test
    public void test() {
        // 占位符动态输出
        Logger logger = LoggerFactory.getLogger(SLF4JTest.class);
        logger.info("学生信息: 姓名-{}年龄-{}", "小明", 13);
        // [main] INFO com.valid.slf4j.SLF4JTest - 学生信息: 姓名-小明年龄-13
    }
}
```

特别的：对于错误信息不需要占位符(因为有异常的专属重载方法)

```java
public class SLF4JTest {
    @Test
    public void test() {
        Logger logger = LoggerFactory.getLogger(SLF4JTest.class);
        try {
            Class.forName("xxxx");
        } catch (ClassNotFoundException e) {
            logger.error("出错了: ", e);
        }
    }
}
```

### 5.4 集成其他日志

`logback`、`simple`和`nop`是在`slf4j`之后的日志实现框架，`API`遵循`slf4j`的设计，如果想要使用它们，只需导入相关依赖即可。值得一提的是`nop`虽然也划分到实现中了，但是它是指不实现日志记录

`log4j`和`JUL`是`slf4j`之前的日志实现框架，所以`API`不遵循`slf4j`进行设计，只有通过适配桥接的技术，才能完成与`slf4j`的衔接

#### 5.4.1 logback

`logback`的依赖

```xml
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
```

`slf4j`默认使用先导入的实现，实际使用情况中也只会导入一种日志实现

#### 5.4.2 nop

`nop`不提供日志记录的功能，相当于关闭日志输出

依赖

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-nop</artifactId>
    <version>1.7.30</version>
</dependency>
```

#### 5.4.3 log4j

`log4j`是在`slf4j`之前的一个日志框架实现，所以并没有遵循`slf4j`的`API`规范，如果想要使用，需要绑定一个适配器`slf4j-log4j12`

```xml
<!--log4j适配器-->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-log4j12</artifactId>
    <version>1.7.31</version>
</dependency>
<!--log4j依赖-->
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

编写好`log4j.properties`就可以直接使用

#### 5.4.4 JUL

导入`JUL`的适配器即可

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-jdk14</artifactId>
    <version>1.7.30</version>
</dependency>
```

### 5.5 重构日志

如果对于一个系统，原本是直接使用的其他日志框架并且想要转换为`slf4j`+`logback`，重构时不需要调动源码，只需要将原来的日志依赖删除，并引入`slf4j`和原本使用的依赖对应的桥接器依赖即可

例如`log4j`的重构

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.30</version>
</dependency>
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>log4j-over-slf4j</artifactId>
    <version>1.7.31</version>
</dependency>
```

<img src="https://gitee.com/dingwanli/picture/raw/master/20210723075032.png" style="zoom:80%;" />

## 6. Logback

### 6.1 简介

`Logback`是由`log4j`创始人设计的又一个开源日志组件

`Logback`当前分为三个模块：`logback-core`，`logback-classic`和`logback-access`

- `logback-core`是其他两个模块的基础模块
- `logback-classic`是`log4j`的一个改良版本。此外`logback-classic`完整实现`SLF4J API`
- `logback-access`访问模块与`Servlet`容器集成提供`Http`来访问日志的功能

### 6.2 组件

`Logger`：日志记录器，主要用于存放日志对象，也可以定义日志类型、级别

`Appender`：用于指定日志输出的目的地，目的地可以是控制台、文件、数据库等等

`Layout`：负责把时间转换成字符串，格式化的日志信息的输出。在`Logback`中`Layout`对象被封装在`encoder`中。也就是说我们未来使用的`encoder`其实就是`Layout`

### 6.3 快速入门

依赖

```xml
<!--logback一般搭配slf4j使用-->
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.30</version>
</dependency>
<!--logback-classic包含logback-core的依赖-->
<dependency>
    <groupId>ch.qos.logback</groupId>
    <artifactId>logback-classic</artifactId>
    <version>1.2.3</version>
</dependency>
```

日志级别：`trace`<`debug`<`info`<`warn`<`error`，默认级别是`debug`

```java
public class LogbackTest {
    @Test
    public void test() {
        Logger logger = LoggerFactory.getLogger(LogbackTest.class);
        logger.error("error信息");
        logger.warn("warn信息");
        logger.info("info信息");
        logger.debug("debug信息");
        logger.trace("trace信息");
    }
}
```

### 6.4 配置文件

`Logback`提供了3种配置文件

`logback.groovy`，`logback-test.xml`，`logback.xml`:star:

如果都不存在则采用默认的配置，配置文件都是位于`resource`目录下

#### 6.4.1 输出格式

| 格式                        | 含义                           |
| --------------------------- | ------------------------------ |
| %-10level                   | 级别，设置为10个字符宽，左对齐 |
| %d{yyyy-MM-dd HH:mm:ss.SSS} | 日期                           |
| %c                          | 当前类全限定名                 |
| %M                          | 当前执行日志的方法             |
| %L                          | 行号                           |
| %thread                     | 线程名称                       |
| %m/%msg                     | 信息                           |
| %n                          | 换行                           |

#### 6.4.2 编写配置文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <!--
        property 配置文件的通用属性
        在配置文件的其他地方可以通过${name}的形式来引用
    -->
    <property name="pattern" value = "[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n" />

    <!--输出到控制台-->
    <appender name="consoleAppender" class="ch.qos.logback.core.ConsoleAppender">
        <!--
            日志字体设置
                默认：System.out 表示黑色字体输出日志
                设置：System.err 表示以红色字体输出
        -->
        <target>
            System.err
        </target>
        <!--
            日志的输出格式
        -->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--引用通用格式-->
            <pattern>
                ${pattern}
            </pattern>
        </encoder>
    </appender>
    <!--
        日志记录器
            配置root logger
            level: 配置日志级别
    -->
    <root level="ALL">
        <!--引入appender-->
        <appender-ref ref="consoleAppender"/>
        <!--<appender-ref ref="consoleAppender"/>-->
        <!--可以配置多个appender-->
    </root>
</configuration>
```

#### 6.4.3 输出到文件

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <!--
        property 配置文件的通用属性
        在配置文件的其他地方可以通过${name}的形式来引用
    -->
    <property name="pattern" value = "[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n" />
    <property name="path" value="./log"/>
    <!--配置文件的appender-->
    <appender name="fileAppender" class="ch.qos.logback.core.FileAppender">
        <!--文件的路径-->
        <file>
            ${path}/logback.log
        </file>
        <!--输出格式-->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>
                ${pattern}
            </pattern>
        </encoder>
    </appender>
    <!--
        日志记录器
            配置root logger
            level: 配置日志级别
    -->
    <root level="ALL">
        <!--引入appender-->
        <appender-ref ref="fileAppender"/>
    </root>
</configuration>
```

#### 6.4.4 输出为html

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <!--
        property 配置文件的通用属性
        在配置文件的其他地方可以通过${name}的形式来引用
    -->
    <property name="pattern" value = "%-5level%d{yyyy-MM-dd HH:mm:ss.SSS}%c%M%L%thread%m" />
    <property name="path" value="./log"/>
    <!--html的appender-->
    <appender name="htmlAppender" class="ch.qos.logback.core.FileAppender">
        <file>
            ${path}/logback.html
        </file>
        <encoder class="ch.qos.logback.core.encoder.LayoutWrappingEncoder">
            <layout class="ch.qos.logback.classic.html.HTMLLayout">
                <pattern>
                    ${pattern}
                </pattern>
            </layout>
        </encoder>
    </appender>
    <!--
        日志记录器
            配置root logger
            level: 配置日志级别
    -->
    <root level="ALL">
        <!--引入appender-->
        <appender-ref ref="htmlAppender"/>
    </root>
</configuration>
```

#### 6.4.5 拆分归档

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <!--
        property 配置文件的通用属性
        在配置文件的其他地方可以通过${name}的形式来引用
    -->
    <property name="pattern" value = "[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n" />
    <property name="path" value="./log"/>

    <!--配置文件的拆分归档-->
    <appender name="rollAppender" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <!--输出格式-->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <pattern>
                ${pattern}
            </pattern>
            <charset>UTF-8</charset>
        </encoder>
        <!--文件位置-->
        <file>
            ${path}/roll_logback.log
        </file>
        <!--指定拆分规则-->
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <!--按照时间和压缩格式声明文件名 压缩格式gz-->
            <fileNamePattern>
                ${path}/roll.%d{yyyy-MM-dd}.log%i.gz
            </fileNamePattern>
            <!--按照文件大小来进行拆分-->
            <maxFileSize>
                1KB
            </maxFileSize>
        </rollingPolicy>
    </appender>
    <!--
        日志记录器
            配置root logger
            level: 配置日志级别
    -->
    <root level="ALL">
        <!--引入appender-->
        <appender-ref ref="rollAppender"/>
        <appender-ref ref="consoleAppender"/>
    </root>
</configuration>
```

#### 6.4.6 过滤器

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <property name="pattern" value = "[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n" />

    <!--输出到控制台-->
    <appender name="consoleAppender" class="ch.qos.logback.core.ConsoleAppender">
        <!--
            日志的输出格式
        -->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--引用通用格式-->
            <pattern>
                ${pattern}
            </pattern>
        </encoder>
        <!--配置过滤器-->
        <filter class="ch.qos.logback.classic.filter.LevelFilter">
            <!--设置日志的输出级别-->
            <level>ERROR</level>
            <!--高于level中设置的级别，则打印日志-->
            <onMatch>ACCEPT</onMatch>
            <!--低于level中设置的级别，则屏蔽-->
            <onMismatch>DENY</onMismatch>
        </filter>
    </appender>
    <!--
        日志记录器
            配置root logger
            level: 配置日志级别
    -->
    <root level="ALL">
        <!--引入appender-->
        <appender-ref ref="consoleAppender"/>
    </root>
</configuration>
```

### 6.5 异步日志

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <!--
        property 配置文件的通用属性
        在配置文件的其他地方可以通过${name}的形式来引用
    -->
    <property name="pattern" value = "[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n" />
    <property name="path" value="./log"/>

    <!--输出到控制台-->
    <appender name="consoleAppender" class="ch.qos.logback.core.ConsoleAppender">
        <!--
            日志的输出格式
        -->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--引用通用格式-->
            <pattern>
                ${pattern}
            </pattern>
        </encoder>
    </appender>
    <!--异步日志-->
    <appender name="asyncAppender" class="ch.qos.logback.classic.AsyncAppender">
        <appender-ref ref="consoleAppender"/>
    </appender>
    <!--
        日志记录器
            配置root logger
            level: 配置日志级别
    -->
    <root level="ALL">
        <!--引入appender-->
        <appender-ref ref="asyncAppender"/>
    </root>
</configuration>
```

系统会为日志操作单独分配出来一条线程，原来执行当前方法的主线程会继续向下执行

异步日志中可选的配置属性:

1. 日志队列阈值：当队列的剩余容量小于这个阈值的时候，当前日志的级别`trace`、`debug`、`info`这三个级别的日志将被丢弃，设置为0说明永远不会丢弃日志

    ```xml
    <discardingThreshold>0</discardingThreshold>
    ```

2. 日志队列的深度：这个值会影响记录日志的性能，默认值是256

    ```xml
    <queueSize>256</queueSize>
    ```

这两个属性一般默认即可

### 6.6 自定义logger

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<configuration>
    <!--
        property 配置文件的通用属性
        在配置文件的其他地方可以通过${name}的形式来引用
    -->
    <property name="pattern" value = "[%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n" />
    <property name="path" value="./log"/>

    <!--输出到控制台-->
    <appender name="consoleAppender" class="ch.qos.logback.core.ConsoleAppender">
        <!--
            日志的输出格式
        -->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <!--引用通用格式-->
            <pattern>
                ${pattern}
            </pattern>
        </encoder>
    </appender>
    <!--
        日志记录器
            配置root logger
            level: 配置日志级别
    -->
    <root level="ALL">
        <!--引入appender-->
		<appender-ref ref="consoleAppender"/>
    </root>

    <!--
        配置自定义logger
            additivity="false" 表示不继承rootlogger
    -->
    <logger name="com.valid" level="info" additivity="false">
        <appender-ref ref="consoleAppender"/>
    </logger>
</configuration>
```

## 7. log4j2

`Apache Log4j2`是对`Log4j`的升级，它比前身`Log4j`提供了重大的改进，并提供了`Logback`中可用的许多改进，同时修复了`Logback`架构中的一些问题。被誉为是目前最优秀的`Java`日志框架

### 7.1 特性

性能提升：`Log4j2`包含基于`LMAX Disruptor`库的下一代异步记录器。在多线程场景中，异步记录器的吞吐量比`Log4j`和`Logback`高18倍，超低延迟

自动重新加载配置：与`Logback`一样，`Log4j2`可以在修改时自动重新加载其配置。与`Logback`不同，它会在重新配置发生时不会丢失日志事件

高级过滤：与`Logback`一样，`Log4j2`支持基于`Log`事件中的上下文数据，标记，正则表达式和其他组件进行过滤。此外过滤器还可以与记录器关联。与`Logback`不同，`Log4j2`可以咋起任何这些情况下使用通用的`Filter`类

插件架构：`Log4j`使用插件模式配置组件。因此，程序员无需编写代码来创建和配置`Appender`，`Layout`，`Pattern Converter`等。在配置了的情况下，`Log4j`自动识别插件并使用它们

无垃圾机制：在稳态日志记录期间，`Log4j2`在独立应用程序中是无垃圾的，在`Web`应用程序中是低垃圾。这减少了垃圾收集器的压力，并且可以提供更好的响应性能

### 7.2 案例

依赖

```xml
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-api</artifactId>
    <version>2.14.1</version>
</dependency>
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.14.1</version>
</dependency>
```

`Log4j2`提供了与`Logg4j`相同的日志级别

```java
public class Log4j2Test {
    @Test
    @DisplayName("快速入门")
    public void test() {
        Logger logger = LogManager.getLogger(Log4j2Test.class);
        logger.fatal("fatal信息");
        logger.error("error信息");
        logger.warn("warn信息");
        logger.info("info信息");
        logger.debug("debug信息");
        logger.trace("trace信息");
    }
}
```

### 7.3 配置文件

#### 7.3.1 快速入门

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Configuration xmlns="http://logging.apache.org/log4j/2.0/config">
        <!--
        根标签中可以配置的属性
            status="debug" 代表日志框架本身的日志输出级别
            monitorInterval="5" 自动加载配置文件的间隔时间，不低于5秒
        -->
    <Properties>
        <Property name="path">
            ./log
        </Property>
        <Property name="pattern">
            [%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n
        </Property>
    </Properties>
    <Appenders>
        <!--输出到控制台-->
        <Console name="consoleAppender" target="SYSTEM_ERR">
            <PatternLayout pattern="${pattern}"/>
        </Console>
        <!--输出到文件-->
        <File name="fileAppender" fileName="${path}/log4j2.log">
            <PatternLayout pattern="${pattern}"/>
        </File>
    </Appenders>
    <Loggers>
        <!--配置root logger-->
        <Root level="debug">
            <AppenderRef ref="consoleAppender"/>
            <AppenderRef ref="fileAppender"/>
        </Root>
    </Loggers>
</Configuration>
```

#### 7.3.2 日志拆分

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Configuration xmlns="http://logging.apache.org/log4j/2.0/config">
    <Properties>
        <Property name="path">
            ./log
        </Property>
        <Property name="pattern">
            [%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n
        </Property>
    </Properties>
    <Appenders>
        <!--
            按照指定规则拆分日志文件
            fileName 日志文件的名字
            filePattern 日志文件拆分后文件的命名规则
        -->
        <RollingFile
                name="rollingFile"
                fileName="${path}/rolllog.log"
                filePattern="${path}/$${date:yyyy-MM-dd}/rolllog-%d{yyyy-MM-dd-HH-mm}%i.log">
                <!--日志消息格式-->
                <PatternLayout pattern="${pattern}"/>
                <Policies>
                    <!--在系统启动时，触发规则，产生一个日志文件-->
                    <OnStartupTriggeringPolicy />
                    <!--按照文件的大小进行拆分-->
                    <SizeBasedTriggeringPolicy size="10KB" />
                    <!--按照时间节点进行拆分 拆分的规则就是filePattern-->
                    <TimeBasedTriggeringPolicy />
                </Policies>
                <!--在同一目录下，文件的个数限制，如果超出了设置的数值，则根据时间进行覆盖，新的覆盖旧的-->
                <DefaultRolloverStrategy max="30"/>
        </RollingFile>
    </Appenders>
    <Loggers>
        <!--配置root logger-->
        <Root level="debug">
            <AppenderRef ref="consoleAppender"/>
            <AppenderRef ref="rollingFile"/>
        </Root>
    </Loggers>
</Configuration>
```

### 7.4 SLF4j+Log4j2

依赖

```xml
<dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>slf4j-api</artifactId>
    <version>1.7.30</version>
</dependency>
<!--log4j适配器-->
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.14.1</version>
</dependency>
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-api</artifactId>
    <version>2.14.1</version>
</dependency>
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.14.1</version>
</dependency>
```

```java
public class Log4j2Test {
    @Test
    public void test() {
        Logger logger = LoggerFactory.getLogger(Log4j2Test.class);
        logger.error("error信息");
        logger.warn("warn信息");
        logger.info("info信息");
        logger.debug("debug信息");
        logger.trace("trace信息");
    }
}
```

### 7.5 异步日志

异步日志是`log4j2`最大的特色，其性能的提升主要也是从异步日志中受益。

`Log4j2`提供了两种实现日志的方式，一个是通过`AsyncAppender`，一个是通过`AsyncLogger`，分别对应之前的`Appender`和`Logger`组件

异步日志的依赖

```xml
<dependency>
    <groupId>com.lmax</groupId>
    <artifactId>disruptor</artifactId>
    <version>3.4.4</version>
</dependency>
```

#### 7.5.1 AsyncAppender

通过引用别的`Appender`来实现，当有日志事件到达时，会开启另外一个线程来处理他们。需要注意的是，如果在`Appender`的时候出现异常，对应用来说是无法感知的。`AsyncAppender`一共该在它引用的`Appender`之后配置，默认使用`java.util,concurrentArrayBlokingQueue`实现而不需要其他外部的类库，当使用此`Appender`的时候，在多线程的环境下需要注意，阻塞队列容易收到锁争用的影响，这可能会对性能产生影响。这时候，我们应该考虑使用无锁的异步记录器`AsyncLogger`

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<Configuration xmlns="http://logging.apache.org/log4j/2.0/config">
    <Properties>
        <Property name="path">
            ./log
        </Property>
        <Property name="pattern">
            [%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n
        </Property>
    </Properties>
    <Appenders>
        <!--输出到控制台-->
        <Console name="consoleAppender" target="SYSTEM_ERR">
            <PatternLayout pattern="${pattern}"/>
        </Console>

        <!--异步日志-->
        <Async name="asyncLog">
            <AppenderRef ref="consoleAppender"/>
        </Async>
    </Appenders>
    <Loggers>
        <!--配置root logger-->
        <Root level="debug">
            <AppenderRef ref="asyncLog"/>
        </Root>
    </Loggers>
</Configuration>
```

#### 7.5.2 AsyncLogger

是官方推荐的异步方式。它可以使得调用`Logger.log`返回的更快。你可以有两种选择：全部异步和混合异步。

- 全部异步：所有的日志都异步的记录，在配置文件上不用做任何改动，只需要在`JVM`启动的时候增加一个参数即可实现。

    在`resources`文件夹下添加一个`log4j2.component.properties`，内容如下

    ```properties
    Log4jContextSelector=org.apache.logging.log4j.core.async.AsyncLoggerContextSelector
    ```

    `log4j2.xml`

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <Configuration xmlns="http://logging.apache.org/log4j/2.0/config">
        <Properties>
            <Property name="path">
                ./log
            </Property>
            <Property name="pattern">
                [%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n
            </Property>
        </Properties>
        <Appenders>
            <!--输出到控制台-->
            <Console name="consoleAppender" target="SYSTEM_ERR">
                <PatternLayout pattern="${pattern}"/>
            </Console>
        </Appenders>
        <Loggers>
            <!--配置root logger-->
            <Root level="debug">
                <AppenderRef ref="consoleAppender"/>
            </Root>
        </Loggers>
    </Configuration>
    ```

- 混合异步：你可以在应用中同时使用同步日志和异步日志，这使得日志的配置方式更加灵活。虽然`Log4j2`提供一套异常处理机制，可以覆盖大部分的状态，但是还是会有一小部分的特殊情况是无法处理的，比如我们如果是记录审计日志(特殊情况之一)，那么官方就推荐使用同步日志的方式，而对于其他的一些仅仅是记录一个程序日志的地方，使用异步日志将大幅度提升性能，减少对应用本身的影响。混合异步的方式需要通过修改配置文件来实现，使用`AsyncLogger`标记配置。

    需求分析：假设要让自定义的`logger(com.valid)`是异步的，`root logger`是同步的

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <Configuration xmlns="http://logging.apache.org/log4j/2.0/config">
        <Properties>
            <Property name="path">
                ./log
            </Property>
            <Property name="pattern">
                [%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n
            </Property>
        </Properties>
        <Appenders>
            <!--输出到控制台-->
            <Console name="consoleAppender" target="SYSTEM_ERR">
                <PatternLayout pattern="${pattern}"/>
            </Console>
        </Appenders>
        <Loggers>
            <!--
                自定义logger为异步logger
                includeLocation 日志记录的行号，记录行号严重影响效率
                additivity 是否继承root logger
            -->
            <AsyncLogger
                    name="com.valid"
                    level="trace"
                    includeLocation="false"
                    additivity="false">
                <AppenderRef ref="consoleAppender"/>
            </AsyncLogger>
            <!--配置root logger-->
            <Root level="debug">
                <AppenderRef ref="consoleAppender"/>
            </Root>
        </Loggers>
    </Configuration>
    ```


## 8. SpringBoot日志

### 8.1 快速入门

`SpringBoot`默认就是使用`SLF4J`作为日志门面，`Logback`作为日志实现来记录日志，默认级别为`info`

```java
@SpringBootTest
public class SpringBootLogApplicationTests {
    @Test
    public void contextLoads() {
        Logger logger = LoggerFactory.getLogger(SpringBootLogApplicationTests.class);
        logger.error("error信息");
        logger.warn("warn信息");
        logger.info("info信息");
        logger.debug("debug信息");
        logger.trace("trace信息");
    }
}
```

### 8.2 配置文件

在`SpringBoot`的`application.properties`配置文件中可以对日志进行简单的配置

```properties
# 日志级别
logging.level.com.valid=trace
# 日志输出的格式
logging.pattern.console=%d{yyyy-MM-dd} [%level] -%m%n
# 日志输出到文件的路径
logging.file.path=./log
```

更多的功能需要在相应日志的配置文件中进行配置

### 8.3 集成Log4j2

1. 排除原本的`logging`

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <exclusions>
            <exclusion>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-logging</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
    ```

2. 添加`log4j2`的依赖

    ```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-log4j2</artifactId>
    </dependency>
    ```

3. 编写`log4j2`的配置文件

    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <Configuration xmlns="http://logging.apache.org/log4j/2.0/config">
        <Properties>
            <Property name="pattern">
                [%-5level] %d{yyyy-MM-dd HH:mm:ss.SSS} %c.%M:%L %thread %m %n
            </Property>
        </Properties>
        <Appenders>
            <!--输出到控制台-->
            <Console name="consoleAppender" target="SYSTEM_ERR">
                <PatternLayout pattern="${pattern}"/>
            </Console>
        </Appenders>
        <Loggers>
            <!--配置root logger-->
            <Root level="debug">
                <AppenderRef ref="consoleAppender"/>
                <AppenderRef ref="fileAppender"/>
            </Root>
        </Loggers>
    </Configuration>
    ```

4. 启动测试
