// 希望根据路径的不同， 返回不同的内容

import chalk from "chalk";
import http from "node:http";
import path from "path";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
// console.log(import.meta.url) 解析的是当前文件的绝对路径 解析的是file路径
// 去掉file:// 所以用了new URL包装了一下 用URL的pathname属性拿到路径

class Server {
  constructor(options) {
    this.port = options.port;
    this.directory = options.directory;
  }
  handleRequest = () => {
    console.log(this);
  };

  start() {
    const server = http.createServer(this.handleRequest);

    server.listen(this.port, () => {
      console.log(
        `${chalk.yellow("Starting up http-server, serving")} ${chalk.green(
          path.relative(__dirname, this.directory)
        )}`
      );
      console.log(`Available on:`);
      console.log(` http://127.0.0.1:${this.port}`);
    });
  }
}

new Server({
  port: 3000,
  directory: process.cwd(), // 当前工作目录
}).start();
