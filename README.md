## 使用苹果子邮箱自动批量创建 DaoMaker 账号

### 前置条件

1、一个 QQ 邮箱，将所有苹果子邮箱的邮件转发到这个邮箱，【[QQ 邮箱设置打开 Imap](https://service.mail.qq.com/detail/0/428)】**保存授权码**

2、苹果子邮箱，可查看我之前仓库【[自动创建 750 个苹果子邮箱](https://github.com/wuyunjiang/createAppleSubEmail)】，设置邮件**转发到 QQ 邮箱**

### 环境

1、安装 Node

### 步骤

1、clone 仓库到本地

```
git clone https://github.com/wuyunjiang/createDaoMakerAccount
```

2、修改生成的 Daomaker 账号的密码，`/client/content.js` 第 2 行

```javascript
const pwd = "你的DaoMaker密码";
```

3、修改邮件接收配置 `/server/listenEmail.js` 第 4 行

```javascript
const qqEmail = "你的QQ邮箱账号";
const qqKey = "你的QQ邮箱授权码";
```

4、运行服务端
进入 server 文件夹，运行`npm i`安装依赖；运行`node listenEmail.js`启动服务端

5、浏览器安装插件
浏览器中进入插件管理页，打开开发人员模式，加载已解压的插件，选择 client 文件夹

6、开始注册
进入注册页面，按 F12 打开开发者控制台，运行如下代码
```javascript
localStorage.setItem("emailArr", JSON.stringify([
  "helices.gaffer-0y@icloud.com", // 需要注册的子邮箱地址列表
  "helicon.vestige-0t@icloud.com"
]));
```

刷新页面，输入框在自动输入邮箱地址就开始在注册了
