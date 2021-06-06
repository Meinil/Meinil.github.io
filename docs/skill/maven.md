---
title: 发布jar包到github
date: '2021-06-6'
sidebar: 'auto'
categories:
 - 踩坑
tags:
 - 技能
---

:::tip
本篇文章介绍使用github发布自己制作的jar包
:::

<!-- more -->

## 1. 创建项目

1. 创建一个普通的`maven`工程，在`pom.xml`中填入如下内容

    ```xml
    <distributionManagement>
        <repository>
            <id>local-repo-release</id>
            <name>GitHub Release</name>
            <url>file://${project.basedir}/maven-repo</url>
        </repository>
    </distributionManagement>
    ```

    `url`是打包发布的路径(这个路径是发布到本项目的根目录`maven-repo`目录下)，其他随意填写，记得设置`groupId`、`artifactId`以及版本号，因为别人需要通过这些引用你的`jar`包

2. 设置打包插件

    ```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-source-plugin</artifactId>
                <version>3.2.1</version>
                <executions>
                    <execution>
                        <id>attach-sources</id>
                        <phase>package</phase>
                        <goals>
                            <goal>jar-no-fork</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-javadoc-plugin</artifactId>
                <version>3.3.0</version>
                <executions>
                    <execution>
                        <id>attach-javadocs</id>
                        <phase>package</phase>
                        <goals>
                            <goal>jar</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
    ```

    不打包文档可以删除文档插件

3. 编写代码

4. 打包，执行如下命令

    ```shell
    mvn clean package deploy
    ```

## 2. 推送至github

1. 正常创建一个仓库
2. 初始化本地项目仓库，并推送至上一步创建的仓库
3. 开通项目的`github pages`

## 3. 导入使用

1. 配备仓库地址

    ```xml
    <repositories>
        <repository>
            <id>github-repository</id>
            <name>demo</name>
            <url>https://[github用户名].github.io/[仓库名]/maven-repo/</url>
        </repository>
    </repositories>
    ```

    `id`、`name`随意，`url`请替换为自己的`github`用户名以及仓库名

2. 导入依赖

    ```xml
    <dependency>
        <groupId>[制作jar包时的groupId]</groupId>
        <artifactId>[制作jar包时的artifactId]</artifactId>
        <version>[版本号]</version>
    </dependency>
    ```

    按上述要求填写完整之后即可使用
