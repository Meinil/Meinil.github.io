---
title: 正则表达式
date: '2021-05-23'
sidebar: 'auto'
categories:
 - java
tags:
 - java
---


## 1. 简介

`Java`提供的正则表达式技术，用于解决处理文本问题

1. 正则表达式，就是用一种模式去匹配字符串的一个公式

### 1.1 快速上手

```java
public class RegexpTest {
    private final static String content = "Java是一门面向对象编程语言，" +
            "不仅吸收了C++语言的各种优点，还摒弃了C++" +
            "里难以理解的多继承、指针等概念，因此Java语" +
            "言具有功能强大和简单易用两个特征。Java语言" +
            "作为静态面向对象编程语言的代表，极好地实现了" +
            "面向对象理论，允许程序员以优雅的思维方式进行" +
            "复杂的编程";
}
```

提取`content`中的英文字母

```java
@Test
@DisplayName("提取字母")
public void test() {
    // 1. 创建一个Pattern对象,模式对象,可以理解成就是一个正则表达式对象
    Pattern pattern = Pattern.compile("[a-zA-Z]+");
    // 2. 创建一个匹配器对象
    Matcher matcher = pattern.matcher(content);
    // 3.开始循环匹配
    while(matcher.find()) {
        System.out.print(matcher.group() + " ");
    }
    // Java C C Java Java 
}
```

### 1.2 底层原理分析

```java
public class RegTheory {
    private final static String content = "1998年12月8日，第二代Java平台" +
            "的企业版J2EE发布。1999年6月，Sun公司发布了第二代Java平台" +
            "（简称为Java2）的3个版本：J2ME（Java2 Micro Edition，Jav" +
            "a2平台的微型版），应用于移动、无线及有限资源的环境；J2SE（Java " +
            "2 Standard Edition，Java 2平台的标准版），应用于桌面环境；J" +
            "2EE（Java 2Enterprise Edition，Java 2平台的企业版），应用" +
            "于基于Java的应用服务器。Java 2平台的发布，是Java发展过程中最重" +
            "要的一个里程碑，标志着Java的应用开始普及。";
}
```

> **matcher.find()**

1. 根据指定的规则，定位满足规则的子字符串

2. 如果找到匹配的字符串，则将子字符串的开始索引记录到`Matcher`对象的属性`int[] groups`

   比如假设第一个匹配到的字符串开始的位置为`0`，结束位置为`3`，则`groups[0]=0`、把该字符串结束索引+1的值记录到`groups[1]=4`

3. 在上述第一个字符串匹配完成后，会记录一个字段`oldLast`为`groups[1]`，下一次匹配就从`oldLast`的值开始匹配，重新执行第二步

匹配数字

```java
@Test
@DisplayName("匹配四个连续数字")
public void test1() {
    // 1. 创建模式对象
    Pattern pattern = Pattern.compile("\\d\\d\\d\\d");
    // 2. 按照模式对象的规则创建匹配器
    Matcher matcher = pattern.matcher(content);
    // 3. 开始匹配
    while(matcher.find()) {
        System.out.print(matcher.group() + " "); 
        // 1998 
        // 1999 
    }
}
```

> **分组**

正则表达式中出现了分组，比如`(\\d\\d)([a-z])`，`\\d\\d`为第一组，`[a-z]`为第二组

`matcher.find()`在出现分组的情况下，会有所不同

1. `groups[0]`记录整个表达式，匹配的开始字符串的位置。`groups[1]`记录整个表达式，匹配的结束字符串的位置+1
2. `groups[2]`记录第一个分组匹配字符串的开始位置，`groups[3]`记录第一个分组匹配字符串结束的位置+1
3. `groups[4]`记录第二个分组匹配字符串的开始位置，`groups[5]`记录第二个分组匹配字符串结束的位置+1
4. 如果有更多的分组，以此类推

但获取匹配的分组时只需要传递第几组即可，因为`group`的底层已经做好了处理

```java
@Test
@DisplayName("匹配四个连续数字")
public void test1() {
    // 1. 创建模式对象
    Pattern pattern = Pattern.compile("(\\d\\d)(\\d\\d)");
    // 2. 按照模式对象的规则创建匹配器
    Matcher matcher = pattern.matcher(content);
    // 3. 开始匹配
    while(matcher.find()) {
        System.out.println("原始串: " + matcher.group(0) + " ");
        System.out.println("\t第一组: " + matcher.group(1) + " ");
        System.out.println("\t第二组: " + matcher.group(2) + " ");
        // 原始串: 1998 
        //     第一组: 19 
        // 	   第二组: 98 
        // 原始串: 1999 
        //     第一组: 19 
        //     第二组: 99 
    }
}
```

## 2. 语法

正则语法中每一个字符称为元字符

### 2.1 转义字符

在要转义的字符前添加`\\`即可

```java
public class RegExpTest {
    String content = "ab$(ab($";

    @Test
    @DisplayName("转义字符")
    public void test() {
        Pattern pattern = Pattern.compile("\\(");
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            System.out.println(matcher.group());
            // (
            // (
        }
    }
}
```

### 2.2 字符匹配

以下的字符如果有`\`则需要添加一个`\`进行转义

| 符号 | 含义                                                | 示例       | 解释                                                 |
| ---- | --------------------------------------------------- | ---------- | ---------------------------------------------------- |
| []   | 可接受的字符列表                                    | [efgh]     | e、f、g、h中的任意1个字符                            |
| [^]  | 不接受的字符列表                                    | [^abc]     | 除a、b、c之外的任意1个字符，包括数字和特殊符号       |
| -    | 连字符                                              | A-Z        | 任意大写字母                                         |
| .    | 匹配除\n以外的任何字符，`[.]`表示匹配`.`本身        | a..b       | 以a开头，b结尾，中间包括2个任意字符的长度为4的数字串 |
| \d   | 匹配单个数字字符，相当于[0-9]                       | \d{3}(\d)? | 包含以单个非数字字符开头，后接任意个数字字符串       |
| \D   | 匹配单个非数字字符，相当于\[^0-9]                   | \D(\d)*    | 以单个非数字字符开头，后接任意个数字字符串           |
| \w   | 匹配单个数字、大小写字母字符，相当于[0-9a-zA-Z]     | \d{3}\w{4} | 以3个数字字符串开头长度为7的数字字母字符串           |
| \W   | 匹配单个非数字、大小写字母字符，相当于\[^0-9a-zA-Z] | \W+\d{2}   | 以至少1个非数字字母字符开头，2个数字字符结尾的字符串 |
| \s   | 匹配任何空白字符                                    | \s         | 空格、制表符、换行符                                 |
| \S   | 匹配任何非空白字符                                  | \S         | 匹配任何非空白字符                                   |

大小不敏感示例

1. `(?i)abc` ：`abc`不区分大小写

2. `a(?i)bc`：`ab`不区分大小写

3. `a((?i)b)c`：表示只有`b`不区分大小写

4. 或者在`java`代码中实现

   ```java
   public class RegExp {
       String content = "ab$(ab($";
       @Test
       @DisplayName("大小写不敏感")
       public void test() {
   		Pattern pattern = Pattern.compile("AB", Pattern.CASE_INSENSITIVE);
           Matcher matcher = pattern.matcher(content);
           while (matcher.find()) {
               System.out.println(matcher.group());
               // ab
               // ab
           }
       }
   }
   ```

### 2.3 选择匹配符

在匹配某个字符时是选择性的，既可以匹配这个，又可以匹配那个，这时你需要用到选择匹配符号 `|`

| 符号 | 含义                       | 示例   | 解释     |
| ---- | -------------------------- | ------ | -------- |
| \|   | 匹配"\|"之前或之后的表达式 | ab\|cd | ab或者cd |

```java
public class RegExp {
    private String content = "ab$(ab($";
    @Test
    @DisplayName("选择匹配")
    public void test() {
        Pattern pattern = Pattern.compile("a|b");
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            System.out.println(matcher.group());
        }
    }
}
```

### 2.4 限定符

| 符号  | 含义                                                         | 示例        | 说明                                               |
| ----- | ------------------------------------------------------------ | ----------- | -------------------------------------------------- |
| *     | 指定字符重复0次或n次                                         | (abc)\*     | 仅包含任意个abc的字符串，等效于\w\*                |
| +     | 指定字符1次或n次                                             | m+(abc)*    | 以至少1个m开头，后接任意个abc的字符串              |
| ?     | 指定字符重复0次或1次。如果?跟在其他的限定符之后，则启用非贪婪模式匹配 | m+abc?      | 以至少1个m开头，后接ab或abc的字符串                |
| (n)   | 只能输入n个字符                                              | [abcd]{3}   | 由abcd中字母组成的任意长度为3的字符串              |
| {n,}  | 指定至少n个匹配                                              | [abcd]{3,}  | 由abcd中字母组成的任意长度不小于3的字符串          |
| {n,m} | 指定至少n个单不多于m个匹配                                   | [abcd]{3,5} | 由abcd中字母组成的任意长度不小于3，不大于5的字符串 |

### 2.5 定位符

定位符，规定要匹配的字符串出现的位置，比如在字符串的开始还是结束的位置。

| 符号 | 含义                   | 示例            | 说明                                                         |
| ---- | ---------------------- | --------------- | ------------------------------------------------------------ |
| ^    | 指定起始字符           | ^[0-9]+[a-z]*   | 以至少1个数字开头，后接任意个小写字母的字符串                |
| $    | 指定结束字符           | ^[0-9]\-[a-z]+$ | 以1个数字开头后接连字符"-"，并以至少1个小写字母结尾的字符串  |
| \b   | 匹配目标字符串的边界   | han\b           | 这里说的字符串的边界指的是子串间有空格，或者是目标字符串的结束位置 |
| \B   | 匹配目标字符串的非边界 | han\B           | 和\b的含义相反                                               |

### 2.6 捕获分组

| 常用分组构造形式   | 含义                                                         |
| ------------------ | ------------------------------------------------------------ |
| (pattern)          | 非命名捕获，捕获匹配的子字符串。编号为零的第一个捕获是由整个正则表达式模式匹配的文本，其他捕获结果则根据左括号的顺序从1开始自动编号 |
| (?\<name\>pattern) | 命名捕获，将匹配的子字符串捕获到一个组名称或编号中。用于name的字符串不能包含任何标点符号，并且不能以数字开头。可以使用单引号替代尖括号，如(?'name') |

给分组命名后，可以通过名字来获取分组

```java
public class RegExp {
    String content = "ab12$a(ab123($";

    @Test
    @DisplayName("命名分组")
    public void test() {
        Pattern pattern = Pattern.compile("(?<g1>\\d\\d)(?<g2>\\d)");
        Matcher matcher = pattern.matcher(content);
        while (matcher.find()) {
            System.out.print(matcher.group("g1") + " ");
            System.out.println(matcher.group("g2"));
        }
    }
}
```

### 2.7 非捕获分组

| 常用分组构造形式 | 含义                                                         |
| ---------------- | ------------------------------------------------------------ |
| (?:pattern)      | 匹配pattern但不捕获该匹配的子表达式，即它是一个非捕获匹配，不存储以后使用的匹配。可以用于`or`、`|`组合模式部件的情况 |
| (?=pattern)      | 它是一个非捕获匹配。例如，`Windows(?=95|98|NT|2000)`匹配`Windows 2000`中的`Windows`但不匹配`Windows 3.1`中的`Windows` |
| (?!pattern)      | 该表达式匹配不处于匹配pattern的字符串的起始点的搜索字符串。他是一个非捕获匹配。例如，`Windows(?=95|98|NT|2000)`不匹配`Windows2000`中的`Windows`但匹配`Windows3.1`中的`Windows` |

待匹配的字符串

```java
public class RegExp {
    String content = "abcd abfg abdd";
}
```

1. 第一种情况

   ```java
   @Test
   @DisplayName("匹配非捕获中的内容")
   public void test() {
       Pattern pattern = Pattern.compile("ab(?:cd|fg|dd)");
       Matcher matcher = pattern.matcher(content);
       while (matcher.find()) {
           System.out.println(matcher.group());
       }
   }
   // abcd
   // abfg
   // abdd
   ```

2. 第二种情况

   ```java
   @Test
   @DisplayName("不捕获(里的内容")
   public void test2() {
       Pattern pattern = Pattern.compile("ab(?=cd|fg|dd)");
       Matcher matcher = pattern.matcher(content);
       while (matcher.find()) {
           System.out.println(matcher.group());
       }
   }
   // ab
   // ab
   // ab
   ```

3. 第三种情况，与上述相反

   ```java
   @Test
   @DisplayName("第三种情况")
   public void test() {
       Pattern pattern = Pattern.compile("ab(?!cd|fg)");
       Matcher matcher = pattern.matcher(content);
       while (matcher.find()) {
           System.out.println(matcher.group());
       }
   }
   // ab
   ```

## 3. 常用匹配

### 3.1 匹配汉字

汉字使用`unicode`编码的范围是`\u0391`~`\uffe5`

```java
@Test
@DisplayName("汉字")
public void test1() {
    String content = "abc中国123";
    Pattern pattern = Pattern.compile("[\\u0391-\\uffe5]+");
    Matcher matcher = pattern.matcher(content);
    while (matcher.find()) {
        System.out.println(matcher.group()); // 中国
    }
}
```

### 3.2 邮政编码

邮政编码必须是以数字开头，以数字结束的六位数字编码

```java
@Test
@DisplayName("邮政编码")
public void test() {
    String content = "123456";
    Pattern pattern = Pattern.compile("^[1-9]{5}\\d$");
    Matcher matcher = pattern.matcher(content);
    while (matcher.find()) {
        System.out.println(matcher.group());
    }
}
```

### 3.3 手机号码

验证以13、14、15、18开头而11位数

```java
@Test
@DisplayName("手机号码")
public void test3() {
    String content = "13153678901";
    Pattern pattern = Pattern.compile("^(?:13|14|15)[0-9]{9}$");
    Matcher matcher = pattern.matcher(content);
    while (matcher.find()) {
        System.out.println(matcher.group()); // 13153678901
    }
}
```

### 3.4 提取域名信息

```java
@Test
@DisplayName("解析URL")
public void test3() {
    String content = "https://www.runoob.com:8080/abc/index.html";
    Pattern pattern = Pattern.compile("^https?://((?:www\\.)?(?:[a-z]+\\.)+[a-z]+)(?::(\\d{1,5}))?/(?:[0-9a-z%#_]+/)*(\\S+)");
    Matcher matcher = pattern.matcher(content);
    while (matcher.find()) {
        System.out.println("匹配的URL " + matcher.group(0));
        System.out.println("域名 " + matcher.group(1));
        System.out.println("端口 " + matcher.group(2));
        System.out.println("文件 " + matcher.group(3));
    }
}
// 匹配的URL https://www.runoob.com:8080/abc/index.html
// 域名 www.runoob.com
// 端口 8080
// 文件 index.html
```

## 4. 常用类

### 4.1 Pattern

> **matches方法**

用于验证输入的字符串**整体**是否满足条件

```java
@Test
@DisplayName("matches方法")
public void test1() {
    String content = "Hello hello";
    System.out.println(Pattern.matches("Hello", content)); // false
}
```

### 4.2 Matcher

| 方法                                  | 说明                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| int start()                           | 返回以前匹配的初始索引                                       |
| int start(int group)                  | 返回在以前的匹配操作期间，由给定组所捕获的子序列的初始索引   |
| int end()                             | 返回最后匹配字符之后的偏移量                                 |
| int end(int group)                    | 返回在以前的匹配操作期间，由给定组所捕获子序列的最后字符之后的偏移量 |
| boolean lookingAt()                   | 尝试将从区域开头的输入序列与该模式匹配                       |
| boolean find()                        | 尝试查找与该模式匹配的输入序列的下一个子序列                 |
| find(int start)                       | 重置此匹配器，然后查给你是查找匹配该模式，从指定索引开始的输入序列的下一个子序列 |
| boolean matches()                     | 尝试将整个区域与模式匹配(整体匹配)                           |
| String replaceAll(String replacement) | 替换                                                         |

1. start和end方法

   ```java
   @Test
   @DisplayName("start&end")
   public void test2() {
       String content = "hello aa hello a";
       Pattern pattern = Pattern.compile("hello");
       Matcher matcher = pattern.matcher(content);
       while (matcher.find()) {
           System.out.println("start: " + matcher.start());
           System.out.println("end: " + matcher.end());
       }
   }
   // start: 0
   // end: 5
   // start: 9
   // end: 14
   ```

2. 替换

   ```java
   @Test
   @DisplayName("替换")
   public void test2() {
       String content = "hello aa hello a";
       Pattern pattern = Pattern.compile("hello");
       Matcher matcher = pattern.matcher(content);
       String s = matcher.replaceAll("hi");
       System.out.println(s); // hi aa hi a
   }
   ```

## 5. 反向引用

圆括号中内容被捕获后，可以在这个括号后被使用，从而写出一个比较实用的匹配模式，内部反向引用`\分组号`，外部反向引用`$分组号`

```java
@Test
@DisplayName("匹配连续相同的数字")
public void test1() {
    String content = "hello tom11 jack22";
    Pattern pattern = Pattern.compile("(\\d)\\1");
    Matcher matcher = pattern.matcher(content);
    while (matcher.find()) {
        System.out.println(matcher.group(0));
        // 11
		// 22
    }
}
```

去重案例

```java
@Test
@DisplayName("去重")
public void test() {
    String content = "我....我要....学学学学....编程java";
    Pattern pattern = Pattern.compile("\\."); 	// 消除...
    Matcher matcher = pattern.matcher(content);
    content = matcher.replaceAll("");

    pattern = Pattern.compile("(.)\\1+"); 		// 匹配重复字符
    matcher = pattern.matcher(content);
    content = matcher.replaceAll("$1"); 		// 消除重复字符
    System.out.println(content); 				// 我要学编程java
}
```

## 6. String类

### 6.1 替换

替换`JDK1.8`和`JDK11`为`JDK`

```java
@Test
@DisplayName("String类")
public void test1() {
    String content = "JDK1.8和JDK11是两个长期支持版";
    content = content.replaceAll("(JDK)1(?:\\.8|1)", "$1");
    System.out.println(content); // JDK和JDK是两个长期支持版
}
```

### 6.2 分割

按照#或者-或者~或者数字来分割

```java
@Test
@DisplayName("分割")
public void test2() {
    String content = "hello#abc-hha~jack1tom";
    String[] split = content.split("#|-|~|\\d+");
    for (String str : split) {
        System.out.println(str);
    }
}
```

