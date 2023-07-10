// 希望根据路径的不同， 返回不同的内容

import http from "node:http";
import path from "path";
import url from 'url'
import fsPromise from "fs/promises";
import { createReadStream, readFileSync } from 'fs'

// 上面是内置的模块

import chalk from "chalk";
import mime from 'mime'
import ejs from 'ejs'
import { getNetworkInterfaces } from './utils.js'


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
// console.log(import.meta.url) 解析的是当前文件的绝对路径 解析的是file路径
// 去掉file:// 所以用了new URL包装了一下 用URL的pathname属性拿到路径

class Server {
  constructor(options) {
    this.port = options.port;
    this.directory = options.directory;
    this.template = readFileSync(path.resolve(__dirname, 'tmpl.html'), 'utf-8')
  }
  sendFile(accessUrl, req, res) {
    // 根据后缀识别文件的类型，设置到响应头中
    const fileType = mime.getType(accessUrl || 'text/plain') // 解决乱码的问题
    res.setHeader('Content-Type', `${fileType};charset=utf-8`)
    createReadStream(accessUrl).pipe(res)  // 读取文件的流
  }
  sendError(accessUrl, req, res) {
    console.log(`Not Found ${accessUrl}`)
    res.statusCode = 404
    res.end(`Not Found`)
  }
  async processDir(accessUrl, req, res) {
    try {
      const assetsUrl = path.join(accessUrl, 'index.html')
      await fsPromise.access(assetsUrl)
      this.sendFile(assetsUrl, req, res)
    } catch (error) {
      // 如果没有index.html, 就返回文件夹的内容
      const dirs = await fsPromise.readdir(accessUrl)
      const tmplStr = ejs.render(this.template, {
        dirs
      })
      res.setHeader('Content-Type', `text/html;charset=utf-8`)
      res.end(tmplStr)
    }
  }
  handleRequest = async (req, res) => {
    const { pathname } = url.parse(req.url, true);
    const accessUrl = path.join(this.directory,decodeURIComponent(pathname))

    try {
      const statObj = await fsPromise.stat(accessUrl)
      // 看看文件是否存在
      if (statObj.isFile()) {
        this.sendFile(accessUrl, req, res)
      } else {
        // 如果是文件夹，尝试找index.html, 如果有就返回，没有就返回文件夹的内容
        this.processDir(accessUrl, req, res)
      }
    } catch (error) {
      this.sendError(accessUrl, req, res)
    }
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
      getNetworkInterfaces().forEach(address => console.log(`  http://${address}:${chalk.green(this.port)}`))
    });
  }
}

//new Server({
//  port: 3000,
//  directory: process.cwd(), // 当前工作目录
//}).start();

export default Server
