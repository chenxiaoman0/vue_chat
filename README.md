#描述
基于WebSocket即时聊天工具
写这个项目的目的一是为了学习vue以及websocket相关的知识点，二是为了给他想要了解vue2.0的童鞋提供一个学习demo。
所以为了使这个项目更加完整，项目使用node搭建服务器
npm run dev命令运行前端环境时，npm start命令运行后端环境时，(运行前需配置mongodb数据库 开启mongod)
https://blog.csdn.net/qq_41988554/article/details/103667920
因此本项目有两个环境，一个是前端开发环境(端口是8080)，一个是server服务环境(端口是3000)。

主要技术栈：
前端：vue.js vuex vue-router raxios  vue-socket.io 
scss better-scroll flex  
postcss-px-to-viewport移动端的适配
后端 ：node.js express express-generator mongodb 
mongoose socket.io

 git clone https://github.com/chenxiaoman0/vue_chat.git
打开一个终端（称这个终端为A终端）进入到vue_chat目录安装依赖包 server
 npm install 
 npm start
 启动server服务（得先启动后台服务，否则前端页面没有数据），在server目录下执行以下命令，成功执行会终端会提示服务端口号为3000

打开另一个一个终端（称这个终端为B终端）进入到client目录安装依赖包
进入客户端
 npm install
 启动客户端 npm run dev 
 成功执行后，会自动打开浏览器访问前端开发环境， 浏览地址是http://localhost:8080
