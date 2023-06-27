
// Node 是javascript的运行时是用v8引擎，v8引擎是c++写的，所以node可以调用c++的库
// node是单线程的，但是它是异步的，它的异步是通过事件循环来实现的
// node的特点：非阻塞I/O，事件驱动，单线程，跨平台，轻量高效
// node的应用场景：高并发，I/O密集型，分布式应用，前端工程化

// 异步非阻塞，同步阻塞


// 单线程 一个线程只能做一件事
// 多线程 一个线程可以做多件事

// 事件驱动 按照事件的顺序来触发回调函数 事件驱动的核心是事件循环

// node适合做什么？
// 编写前端工具 webpack gulp rollup vite 脚手架 
// 为前端服务的后端，中间层 (client) (bff, 格式化，云服务) (server) 
// 创建服务器 koa express eggjs nestjs 开发服务器


// 前端最早没有模块化的概念，后来出现了commonjs规范，nodejs是commonjs规范的实现
// 现在就是两种 commonjs esmodule -> 未来可能就是esmodule


// 模块化规范解决了哪些问题？
// 1. 命名冲突
// 2. 文件依赖
// 3. 代码组织
// 4. 代码复用

// commonjs规范 如何导出模块 如何引入模块
// 1. 每个js文件都是一个模块
// 2. 通过module.exports导出模块
// 3. 通过require引入模块

// 如果不带路径会被识别成原生模块或者第三方模块
// 内部会自动帮我们添加 .js .json 后缀
// 同步导入模块
const r = require('./a')
console.log(r)

// 1.如何读取文件 path(采用的是绝对路径)
const path = require('path')
const fs = require('fs')
console.log(path.join(__dirname, 'a', 'b')) // 指示拼接
console.log(path.resolve(__dirname, 'a', 'b')) // 指示解析

// 上面解析的路径是一样的，但是join只是拼接，resolve会解析出一个绝对路径
// 在一定情况下两个解析的 结果是一样的，但是当遇到/的时候，resolve认为是根路径，join只是拼接

console.log(path.extname('a.min.js')) // 获取文件的扩展名

// 读取文件如果文件不存在会报错
fs.readFileSync(path.resolve(__dirname, 'test.md', 'utf8')) // 同步读取文件
console.log(fs.existsSync(path.resolve(__dirname, 'test.md'))) // 判断文件是否存在

// eval 
// new Function 

const vm = require('vm')

vm.runInThisContext('console.log(a)') // 在当前上下文中执行代码
