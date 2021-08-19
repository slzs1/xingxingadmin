# vue-typescript-admin-template

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](http://makeapullrequest.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Template from jarvis](https://img.shields.io/badge/Hi-Jarvis-ff69b4.svg)](https://github.com/Armour/Jarvis)

## 总览

这是一个极简的 vue typescript admin 管理后台。它只包含了 Element UI & axios & svgicon & permission control & lint，这些搭建后台必要的东西。部分源代码是由 [vue-cli](https://github.com/vuejs/vue-cli) 和 [jarvis](https://github.com/Armour/Jarvis) 自动生成的。Mock 部分直接使用了我预先搭建的 [Mock 服务器](https://github.com/armour/vue-typescript-admin-mock-server)。

## 相关项目

[Armour/vue-typescript-admin-mock-server](https://github.com/armour/vue-typescript-admin-mock-server) (Mock 服务器)

[Armour/vue-typescript-admin-docs](https://github.com/armour/vue-typescript-admin-docs) (项目文档)

Javascript 版本相关:

[PanJiaChen/vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) (a vue2.0 minimal admin template)

[PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) (full features supported vue admin)

[PanJiaChen/electron-vue-admin](https://github.com/PanJiaChen/electron-vue-admin) (a vue electron admin project)


## 开发规范

* git使用：

  * 总开发在dev分支上进行，个人开发在个人分支上进行
  * 个人分支命名规范为 dev_xxx
  * 个人开发完成时合并到dev分支
  * 合并到 master 分支前必须经过 code review
  * 个人分支的拉取及推送：
    * git clone -b dev_xxx 仓库地址
    * git pull origin dev_xxx
    * git push origin dev_xxx

* 语法检查使用 `eslint + prettier` , 并且开启强制无需结尾分号和强制使用单引号

* `<style scoped></style>` vue 模板中必须带有 scoped

* 文件夹/文件的命名统一用小写，使用短横线命名 (kebab-case)，包括`js`、`css`、`html`文件。
* Vue组件命名采用PascalCase (单词首字母大写命名)，如MyComponent.vue


## 如何设置以及启动项目

### 安装依赖

```bash
yarn install
```

### 启动本地开发环境（自带热启动）

```bash
yarn serve
```

### 构建生产环境 (自带压缩)

```bash
yarn build
```

### 代码格式检查以及自动修复

```bash
yarn lint
```

### 运行单元测试

```bash
yarn test:unit
```

### 运行端对端测试

```bash
yarn test:e2e
```

### 自动生成 svg 组件

```bash
yarn svg
```

### 自定义 Vue 配置

看这里 [Configuration Reference](https://cli.vuejs.org/config/).
