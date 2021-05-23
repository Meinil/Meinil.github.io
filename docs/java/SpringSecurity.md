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
               .antMatchers("/", "/test/hello", "/user/login").permitAll() // 设置那些路径不需要认证
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

### 2.5 基于权限进行访问控制

#### 2.5.1 hasAuthority

如果当前主体具有指定的权限，则返回`true`，否则`false`

1. 配置类中配置权限

   ```java
   @Configuration
   public class SecurityConfig1 extends WebSecurityConfigurerAdapter {
   
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
   
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           http.formLogin()                                    // 自己编写的登陆界面
               .loginPage("/login.html")                       // 登陆页面设置
               .loginProcessingUrl("/user/login")              // 登陆访问的路径
               .defaultSuccessUrl("/test/index").permitAll()   // 登陆成功后，重定向的地址
               .and().authorizeRequests()
               .antMatchers("/", "/test/hello", "/user/login").permitAll() // 设置那些路径不需要认证
               .antMatchers("/test/index").hasAuthority("admins") 		// 设置权限
               .anyRequest().authenticated()
               .and().csrf().disable();                        // 关闭csrf防护
       }
   }
   ```

2. `service`中修改

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
           List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList("admins");
           return new User(user.getUsername(), new BCryptPasswordEncoder().encode(user.getPassword()), auths);
       }
   }
   ```

#### 2.5.2 hasAnyAuthority

如果当前的主体有任何一个提供的角色，返回`true`

1. 配置类中添加

   ```java
   .antMatchers("/test/index").hasAnyAuthority("admins,manager") // 设置权限
   ```

   说明`admis`、`manager`都可以访问

2. 修改`service`中的权限

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
           List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList("manager");
           return new User(user.getUsername(), new BCryptPasswordEncoder().encode(user.getPassword()), auths);
       }
   }
   ```

#### 2.5.3 hasRole

如果用户具备给定角色就允许访问，否则返回`403`，如果当前主体具有指定角色，则返回`true`

1. 配置类中添加配置

   ```java
   .antMatchers("/test/index").hasRole("sale") // 设置权限
   ```

2. `service`中修改角色，一定要加`ROLE_`前缀

   ```java
   List<GrantedAuthority> auths = AuthorityUtils.commaSeparatedStringToAuthorityList("ROLE_sale");
   ```

#### 2.5.4 hasAnyRole

表示用户具备任何一个条件都可以进行访问，与上述相似

### 2.6 自定义未授权页面

1. 在资源目录下新建`static/unauth.html`

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Title</title>
   </head>
   <body>
       <h1>没有权限</h1>
   </body>
   </html>
   ```

2. 修改配置类

   ```java
   http.exceptionHandling().accessDeniedPage("/unauth.html");
   ```

### 2.7 注解使用

注解在使用之前需要在启动类上添加启用注解功能

1. `@Security`：判断用户具有某个角色，需要添加前缀`ROLE_`

   启动类上开启注解

   ```java
   @EnableGlobalMethodSecurity(securedEnabled = true)
   ```

   在对应的`controller`中的方法上添加

   ```java
   @Secured({"ROLE_sale", "ROLE_manager"})
   @GetMapping("/update")
   public String update() {
       return "Hello update";
   }
   ```

   `service`中保持不变

2. `@PreAuthorize`：进入方法前进行权限验证，可以将登陆用户的`roles/permissions`参数传到方法中

   启动类上开启注解

   ```java
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   ```

   对应`controller`上添加

   ```java
   @GetMapping("/update")
   @PreAuthorize("hasAnyAuthority('admins')")
   public String update() {
       return "Hello update";
   }
   ```

3. `@PostAuthorize`：在方法执行后再进行权限验证，适合验证带有返回值的权限

   启动类上开启注解

   ```java
   @EnableGlobalMethodSecurity(prePostEnabled = true)
   ```

   对应`controller`上添加

   ```java
   @GetMapping("/update")
   @PostAuthorize("hasAnyAuthority('admins')")
   public String update() {
       System.out.println("============");
       return "Hello update";
   }
   ```

4. `@PostFilter`：方法返回的数据进行过滤

   编写`controller`，设置只返回用户名为`tom`的用户

   ```java
   @GetMapping("/users")
   @PostFilter("filterObject.username == 'tom'")
   public List<Users> getUsers() {
       List<Users> users = new LinkedList<>();
       users.add(new Users(1, "tom", "123"));
       users.add(new Users(2, "jack", "123"));
       users.add(new Users(3, "lucy", "123"));
       return users;
   }
   ```

5. `@PreFilter`：对传入控制器的数据进行过滤

   ```java
   @PostMapping("/prefilter")
   @PreFilter("filterObject.id % 2 == 0")
   public List<Users> handlerUser(@RequestBody List<Users> users) {
       return users;
   }
   ```

   测试数据

   ```json
   [
       {
           "id": 1,
           "username": "hahah",
           "password": 123
       },
       {
           "id": 2,
           "username": "hahah",
           "password": 123
       },
       {
           "id": 3,
           "username": "hahah",
           "password": 123
       }
   ]
   ```

   返回值

   ```json
   [
       {
           "id": 2,
           "username": "hahah",
           "password": "123"
       }
   ]
   ```

### 2.8 注销

1. 修改配置类

   ```java
   @Configuration
   public class SecurityConfig1 extends WebSecurityConfigurerAdapter {
   
       @Autowired
       private UserDetailsService userDetailsService;
   
       // 密码加密
       @Bean
       public PasswordEncoder password() {
           return new BCryptPasswordEncoder();
       }
   
       @Override
       protected void configure(AuthenticationManagerBuilder auth) throws Exception {
           auth.userDetailsService(userDetailsService).passwordEncoder(password());
       }
   
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           // 退出
           http.logout().logoutUrl("/logout").logoutSuccessUrl("/test/hello").permitAll();
           http.exceptionHandling().accessDeniedPage("/unauth.html"); // 没有权限跳转页面
           http.formLogin()                                    // 自己编写的登陆界面
               .loginPage("/login.html")                       // 登陆页面设置
               .loginProcessingUrl("/user/login")              // 登陆访问的路径
               .defaultSuccessUrl("/success.html").permitAll()   // 登陆成功后，重定向的地址
               .and().authorizeRequests()
               .antMatchers("/", "/test/hello", "/user/login", "/test/users", "/test/prefilter").permitAll() // 设置那些路径不需要认证
               .antMatchers("/test/index").hasRole("sale") // 设置权限
               .anyRequest().authenticated()
               .and().csrf().disable();                        // 关闭csrf防护
       }
   }
   ```

2. 编写登陆成功后的页面`static/success.html`

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Title</title>
   </head>
   <body>
       <h1>登陆成功</h1>
       <a href="/logout">注销登陆</a>
   </body>
   </html>
   ```

### 2.9 自动登陆

自动登陆过程

<img src="https://gitee.com/dingwanli/picture/raw/master/20210516194025.png" style="zoom:50%;" />

1. 配置类中，注入数据源，配置操作数据库对象

   ```java
   // 数据源
   @Autowired
   private DataSource dataSource;
   
   // 配置数据库对象
   @Bean
   public PersistentTokenRepository persistentTokenRepository() {
       JdbcTokenRepositoryImpl jdbcToken = new JdbcTokenRepositoryImpl();
       jdbcToken.setDataSource(dataSource);
       jdbcToken.setCreateTableOnStartup(true);
       return jdbcToken;
   }
   ```

2. 同时修改`configure`

   ```java
   .and().rememberMe().tokenRepository(persistentTokenRepository()) // 设置自动登陆
   .tokenValiditySeconds(60)                                       // 有效时长
   .userDetailsService(userDetailsService)
   ```

3. 登陆页面添加复选框

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Title</title>
   </head>
   <body>
       <form action="/user/login" method="post">
           用户名: <input type="text" name="username" />
           <br />
           密码: <input type="password" name="password" />
           <input type="checkbox" name="remember-me" value="自动登陆" />
           <button>提交</button>
       </form>
   </body>
   </html>
   ```

### 2.10 CSRF

`CSRF`跨站请求伪造：攻击者通过一些技术手段欺骗用户的浏览器去访问一个自己曾经认证过的网站并运行一些操作。由于浏览器认证过，所以被访问的网站会认为是真正的用户操作而去运行。这利用了`web`中用户身份验证的一个漏洞：简单的身份验证只能保证请求发自某个用户的浏览器，却不能保证请求本身是用户自愿发出的