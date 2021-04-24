---
title: Github Action部署Vue3
date: '2021-04-24'
sidebar: 'auto'
categories:
 - 踩坑
tags:
 - 技能
---

### 1. 创建仓库

正常创建即可

<img src="https://gitee.com/dingwanli/picture/raw/master/20210424115754.png" alt="image-20210424115925196" style="zoom:50%;" />

### 2. 创建项目

`vite`构建速度特别快，因此本项目使用`vite`进行演示

1. 初始化项目

   ```shell
   npm init @vitejs/app demo -- --template vue
   ```

2. 进入项目安装依赖

   ```shell
   cd demo
   npm install
   ```

3. 启动测试

   ```
   npm run dev
   ```

4. 访问测试
   <img src="https://gitee.com/dingwanli/picture/raw/master/20210424114611.png" alt="image-20210424114610907" style="zoom:50%;" />

### 3. 更改vue3的打包路径

在`vite.config.js`添加`base`字段，`base`的值为仓库的名称，如果要部署到`[用户名].github.io`可以不写

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  	plugins: [vue()],
	base: "demo" 
})
```

### 4. 更改打包命令

这步是可选的，如果引入`element-plus`的话，默认的打包方式会报错

打开`package.json`，修改`build`命令

将

```json
"build": "vue-tsc --noEmit && vite build"
```

更改为

```json
"build": "vue-tsc --noEmit --skipLibCheck && vite build"
```

### 5. 代码提交

```shell
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/用户名/demo.git
git push -u origin main
```

### 6. token

1. 申请token

   勾选`repo`即可

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210424115925.png" alt="image-20210424115925196" style="zoom:50%;" />

2. 复制token到`secrets`

   <img src="https://gitee.com/dingwanli/picture/raw/master/20210424120232.png" alt="image-20210424120232037" style="zoom:50%;" />

### 7. 编写action

在项目根目录下新建`.github/workflows/ci.yml`

```yaml
# 工作流名称，不设置的话默认取配置文件名
name: Build and Deploy
# 指定触发 workflow 的条件
# 指定触发事件时，可以限定分支或标签
# 当前是 只有 main分支上触发 push 事件时才执行工作流任务
on: 
  push:
    branches:
      - main
# 工作流执行的一个或多个任务
jobs:
  # 任务名称
  build-and-deploy:
    # 任务运行的容器类型（虚拟机环境）
    runs-on: ubuntu-latest
    # 任务执行的步骤
    steps:
      # 步骤名称
      - name: Checkout 🛎️
        # 使用的操作 actions，可以使用公共仓库，本地仓库，别人的仓库的action
        # 拉取代码
        uses: actions/checkout@v2.3.1

      # 编译
      - name: Build
        run: npm install && npm run build

      - name: Deploy
        # 构建发布 Github pages
        uses: JamesIves/github-pages-deploy-action@4.1.1
        # 该步骤所需的环境变量
        with:
          branch: gh-pages
          folder: dist
          token: ${{ secrets.ACTION_TOKEN }}
```

### 8. 再次提交

```shell
git add .
git commit -m "action"
git push
```

查看部署状态

<img src="https://gitee.com/dingwanli/picture/raw/master/20210424122821.png" alt="image-20210424122821303" style="zoom:40%;" />

### 9. 访问测试

`settings`中查看`pages`的地址

<img src="https://gitee.com/dingwanli/picture/raw/master/20210424123345.png" alt="image-20210424122821303" style="zoom:50%;" />

<img src="https://gitee.com/dingwanli/picture/raw/master/20210424123457.png" alt="image-20210424123457844" style="zoom:50%;" />