---
title: SpringSecurity
date: '2021-05-14'
sidebar: 'auto'
categories:
 - java
tags:
 - java
 - SpringSecurity
---

## 1. 快速入门

### 1.1 HelloWorld

1. 新建`Springboot`项目并引入以下依赖

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-web</artifactId>
   </dependency>
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-security</artifactId>
   </dependency>
   ```

2. 新建一个`Controller`

   ```java
   @RestController
   @RequestMapping("/test")
   public class TestController {
   
       @GetMapping("/hello")
       public String hello() {
           return "Hello Security";
       }
   }
   ```

3. 访问测试

   引入了`SpringSecurity`的项目输入`URL`不会直接返回结果，而是会跳转一个登陆界面

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210514213220.png" style="zoom:50%;" />

   默认用户名`user`密码会在启动界面中显示

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210514213318.png" style="zoom:50%;" />

### 1.2 基本原理

`UserDeatilsService`接口：查询数据库用户名和密码的过程

1. 创建类继承`UsernamePasswordAuthenticationFilter`，重写三个方法
2. 创建类实现`UserDetailsService`，编写查询数据过程，返回`User`对象

`PasswordEncoder`接口：数据加密接口，用于返回`User`对象里面密码加密

## 2. web权限方案

### 2.1 设置用户名密码

1. 通过配置文件

   ```yaml
   spring:
       security:
           user:
               name: haha
               password: 123456
   ```

2. 通过配置类

   需要在`IOC`容器中放入一个`PasswordEncoder`的对象

   ```java
   @Configuration
   public class SecurityConfig extends WebSecurityConfigurerAdapter {
   
       @Bean
       public PasswordEncoder password() {
           return new BCryptPasswordEncoder();
       }
   
       @Override
       protected void configure(AuthenticationManagerBuilder auth) throws Exception {
           // 加密密码
           BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
           String password = passwordEncoder.encode("123");
           					       auth.inMemoryAuthentication().withUser("tom").password(password).roles("admin");
       }
   }
   ```

### 2.2 自定义用户名密码

1. 创建配置类，设置使用哪个`userDetailsService`实现类

   ```java
   @Configuration
   public class SecurityConfig extends WebSecurityConfigurerAdapter {
   
       @Autowired
       private UserDetailsService userDetailsService;
   
       @Bean
       public PasswordEncoder password() {
           return new BCryptPasswordEncoder();
       }
   
       @Override
       protected void configure(AuthenticationManagerBuilder auth) throws Exception {
           auth.userDetailsService(userDetailsService).passwordEncoder(password());
       }
   }
   ```

2. 编写实现类，返回`User`对象，`User`对象中有对应的用户名密码和权限

   ```java
   @Service("userDetailsService")
   public class MyUserDetailsService implements UserDetailsService {
       @Override
       public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
           List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList("role");
           return new User("jack", new BCryptPasswordEncoder().encode("123"), auths);
       }
   }
   ```

### 2.3 查询数据库

1. 引入依赖

   ```xml
   <dependency>
       <groupId>com.baomidou</groupId>
       <artifactId>mybatis-plus-boot-starter</artifactId>
       <version>3.4.2</version>
   </dependency>
   <dependency>
       <groupId>mysql</groupId>
       <artifactId>mysql-connector-java</artifactId>
   </dependency>
   <dependency>
       <groupId>org.projectlombok</groupId>
       <artifactId>lombok</artifactId>
   </dependency>
   ```

2. 创建数据库

   ```sql
   CREATE TABLE users (
       id INT(11) primary key,
       username varchar(10),
       password varchar(10)
   ) default charset=utf8mb4 engine=innodb;
   ```

3. 实体类

   ```java
   @Data
   @AllArgsConstructor
   @NoArgsConstructor
   public class Users {
       private Integer id;
       private String username;
       private String password;
   }
   ```

4. `Mapper`，记得启动类要加`@MapperScan`

   ```java
   public interface UserMapper extends BaseMapper<Users> {
   }
   ```

5. 重写`service`

   ```java
   @Service("userDetailsService")
   public class MyUserDetailsService implements UserDetailsService {
   
       @Autowired
       private UserMapper mapper;
   
       @Override
       public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
   
           QueryWrapper<Users> wrapper = new QueryWrapper<>();
           wrapper.eq("username", username);
           Users user = mapper.selectOne(wrapper);
   
           if (user == null) {
               throw new UsernameNotFoundException("用户名不存在");
           }
           List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList("role");
           return new User(user.getUsername(), new BCryptPasswordEncoder().encode(user.getPassword()), auths);
       }
   }
   ```

6. 配置数据源

   ```yaml
   spring:
       datasource:
           driver-class-name: com.mysql.cj.jdbc.Driver
           url: jdbc:mysql://localhost:3306/test?useSSL=true&useUnicode=true&characterEncoding=UTF-8&serverTimezone=Asia/Shanghai
           username: root
           password: 123456
   ```

7. 启动测试

### 2.4 主页配置

1. 配置类中重写一个方法

   ```java
       protected void configure(HttpSecurity http) throws Exception {
           http.formLogin()                                    // 自己编写的登陆界面
               .loginPage("/login.html")                       // 登陆页面设置
               .loginProcessingUrl("/user/login")              // 登陆访问的路径
               .defaultSuccessUrl("/test/index").permitAll()   // 登陆成功后，重定向的地址
               .and().authorizeRequests()
               .antMatchers("/", "test/hello", "/user/login").permitAll() // 设置那些路径不需要认证
               .anyRequest().authenticated()
               .and().csrf().disable();                        // 关闭csrf防护
       }
   ```

2. 资源文件夹下新建`static/login.html`

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Title</title>
   </head>
   <body>
       <form action="/user/login" method="post">
           用户名: <input type="text" name="username">
           <br />
           密码: <input type="text" name="password">
           <button>提交</button>
       </form>
   </body>
   </html>
   ```