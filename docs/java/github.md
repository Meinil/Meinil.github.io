---
title: github授权登陆
date: '2021-05-06'
sidebar: 'auto'
categories:
 - java
tags:
 - java
 - springboot
---

:::tip
通过一个简单的demo来实现github授权登陆springboot应用
:::

### 1. 申请github

<img src="//gitee.com/dingwanli/picture/raw/master/20210505212522.png" style="zoom:70%;" />

<img src="https://gitee.com/dingwanli/picture/raw/master/20210505213112.png" style="zoom:60%;" />

### 2. 前端页面编写

1. `client_id`换成上面生成的`client_id`，回调地址同理
2. 这一次的请求，携带的`redirect_uri`会返回一个`access_token`
3. 接下来会利用这个`access_token`来请求用户信息

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<a href="https://github.com/login/oauth/authorize?client_id=c615c60650db8fdcbbfd&amp;redirect_uri=http://127.0.0.1:8080/api/callback/&amp;scope=user&amp;state=1">
		点我授权登陆
	</a>
</body>
</html>
```

### 3. Springboot

首先引入几个依赖，等会会用到

```xml
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.75</version>
</dependency>
<dependency>
    <groupId>com.squareup.okhttp3</groupId>
    <artifactId>okhttp</artifactId>
    <version>3.14.6</version>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

`application.xml`中配置相应信息

```yaml
github:
    client-id: 73a12faa667ecb9e0cbb
    client-secret: a9573b1e6b20e200923977a68badb46b57e47360
    redirect-uri: http://127.0.0.1:8080/youtu/api/callback/github
```

#### 3.1 编写实体类

`GithubToken`用于向`github`发送一些必要的授权信息，`user`用于获取授权之后的信息

```java
@Component
@Data
public class GithubToken {
    @JSONField(name = "client_id")
    @Value("${github.client-id}")
    private String clientId;       // client_id

    @Value("${github.client-secret}")
    @JSONField(name = "client_secret")
    private String clientSecret;   // client_secret
    private String code;            // code

    @JSONField(name = "redirect_uri")
    @Value("${github.redirect-uri}")
    private String redirectUri;    // 重定向的url
    private String state;           // 状态
	
	@Data
    public static class User{
        private String login;        // 账户
        private String avatarUrl;   // 头像
        private String bio;         // 用户名
    }
}
```

#### 3.2 编写handler

用于请求`github`获取用户信息

1. 请求`access_token`

   ```java
   @Component
   public class AuthorizeHandler {
       @Autowired
       private GithubToken github;
   
       public GithubToken.User GithubAccessToken(String code, String state){
           MediaType mediaType= MediaType.get("application/json; charset=utf-8");
           OkHttpClient client = new OkHttpClient();
   
           // 设置githubToken
           github.setCode(code);
           github.setState(state);
           RequestBody body = RequestBody.create(mediaType, JSON.toJSONString(github));
           Request request = new Request.Builder()
                   .url("https://github.com/login/oauth/access_token")
                   .post(body)
                   .build();
           try (Response response = client.newCall(request).execute()) {
               // 获取并解析AccessToken
               String accessToken = response.body().string();
               String[] split = accessToken.split("&");
               accessToken = split[0].split("=")[1];
               return getUser(accessToken);
           } catch (IOException e) {
               e.printStackTrace();
           }
           return null;
       }
   }
   // 获取到的access_token形式
   // access_token=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&scope=user&token_type=bearer
   ```

2. 根据`access_token`获取用户信息，并解析为`User`对象

   添加方法

   ```java
   private GithubToken.User getUser(String accessToken){
       try {
           OkHttpClient client = new OkHttpClient();
           Request request = new Request.Builder()
               .url("https://api.github.com/user")
               .addHeader("Authorization", "token " + accessToken)
               .build();
   
           Response response = client.newCall(request).execute();
           String string = response.body().string();
           // 解析user对象
           return = JSON.parseObject(string, GithubToken.User.class);//将string解析成GitHub对象
       } catch (IOException e) {
           return null;
       }
   }
   ```

#### 3.3 编写controller

用于接受`github`的回调

```java
@RestController
@RequestMapping("/callback")
public class AuthorizeController {
    @Autowired
    private AuthorizeHandler authorize;

    @GetMapping("/github")
    public void github(@RequestParam String code,
                         @RequestParam String state) {
        System.out.println(authorize.GithubAccessToken(code, state));
    }
}
```

### 4. 测试

1. 点击上面编写的好的页面

![](https://gitee.com/dingwanli/picture/raw/master/20210523183203.png)

2. 填写好账号之后就可以点击`sign in`进行登陆

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210523183233.png" style="zoom:80%;" />

登陆能够获取的信息有很多，可以按需封装进`user`使用

```json
{
    "login": "user",
    "id": 48578546,
    "node_id": "MDQ6VXNlcjNTQ2",
    "avatar_url": "https://avatars.githubusercontent.com/u/3434?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/user",
    "html_url": "https://github.com/user",
    "followers_url": "https://api.github.com/users/user/followers",
    "following_url": "https://api.github.com/users/user/following{/other_user}",
    "gists_url": "https://api.github.com/users/user/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/user/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/user/subscriptions",
    "organizations_url": "https://api.github.com/users/user/orgs",
    "repos_url": "https://api.github.com/users/user/repos",
    "events_url": "https://api.github.com/users/user/events{/privacy}",
    "received_events_url": "https://api.github.com/users/user/received_events",
    "type": "User",
    "site_admin": false,
    "name": null,
    "company": null,
    "blog": "https://user.github.io/",
    "location": null,
    "email": null,
    "hireable": null,
    "bio": "userbio",
    "twitter_username": null,
    "public_repos": 11,
    "public_gists": 0,
    "followers": 1,
    "following": 2,
    "created_at": "2019-03-15T04:01:46Z",
    "updated_at": "2021-05-05T13:59:47Z",
    "private_gists": 0,
    "total_private_repos": 1,
    "owned_private_repos": 1,
    "disk_usage": 103251,
    "collaborators": 0,
    "two_factor_authentication": false,
    "plan": {
        "name": "free",
        "space": 23423,
        "collaborators": 0,
        "private_repos": 10000
    }
}
```

