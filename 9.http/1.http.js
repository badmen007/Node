const http = require("http");
const { argv0 } = require("process");
const url = require("url");

// node中的请求是单线程的，如果有多个请求，会排队执行
// 请求方法 restful风格 get post put delete

// 开发的时候 都用post请求的比较多 为什么？ get请求有长度限制，post没有
// options 试探性请求 跨域的时候出现 预检请求
// 简单请求不会发送预检请求，复杂请求会发送预检请求(增加了自定义的请求头)

// 状态码
// 1xx 请求接收了，还没有处理 101 websocket
// 2: 200 成功 204 没有响应体 206 分段传输(拿到的内容是部分数据)
// 3: 301 永久重定向 302 临时重定向 304 缓存(协商缓存)
// 4: 400 客户端错误(参数传递有问题) 401 没有权限(没登录没权限) 403 禁止访问(登陆了没权限) 404 找不到资源

const server = http.createServer((req, res) => {
  // 解析请求体 http模块是基于net模块的

  // http模块是基于net模块的 接收到的数据 存储在req对象中

  console.log(req.method); // 请求方法
  // 请求头
  console.log(req.headers); // 请求头

  console.log(req.httpVersion); // http版本号

  // 请求行 GET / HTTP/1.1
  // console.log(req.url); // 请求路径 拿到的是端口号后面的路径
  const { pathname, query } = url.parse(req.url, true);
  if (pathname === "/sum") { // 在node中这种代码可以通过子进程转换成进程间通信进行处理，不应该放到主线程中会阻塞代码执行
    let sum = 0;
    for (let i = 0; i < 1000; i++) {
      sum += i;
    }
    res.end(sum.toString());
  } else {
    // 请求体
    let arr = [];
    req.on("data", (chunk) => {
      arr.push(chunk);
    });
    req.on("end", () => {
      console.log(Buffer.concat(arr).toString());
    });

    res.statusCode = 200; // 状态码

    res.setHeader("Content-Type", "text/plain;charset=utf-8"); // 响应头

    res.end("ok"); // 响应体
  }
});

let port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log("服务器启动了", port);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    // 端口被占用 不需要在写回调函数 因为是发布订阅模式
    server.listen(++port);
  }
  console.log(err);
});

// 每个系统有对应的设置环境变量的方式 cross-env 可以跨平台设置环境变量

// nodemon 会自动重启服务器 本地开发使用
// 上线的时候会使用pm2来启动node服务

// favicon.ico 会默认请求这个文件 这个是网站的图标 控制不了 自动发送
