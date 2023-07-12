// 希望根据路径的不同， 返回不同的内容

import http from "node:http";
import path from "path";
import url from "url";
import fsPromise from "fs/promises";
import { createReadStream, readFileSync } from "fs";
import querystring from "querystring";
import crypto from "crypto";
import zlib from "zlib";

// 上面是内置的模块

import chalk from "chalk";
import mime from "mime";
import ejs from "ejs";
import { getNetworkInterfaces } from "./utils.js";

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
// console.log(import.meta.url) 解析的是当前文件的绝对路径 解析的是file路径
// 去掉file:// 所以用了new URL包装了一下 用URL的pathname属性拿到路径

class Server {
  constructor(options) {
    this.port = options.port;
    this.directory = options.directory;
    this.template = readFileSync(path.resolve(__dirname, "tmpl.html"), "utf-8");
  }
  cache() {
    // 强缓存+对比缓存
    // 客户端第一次访问我的时候，希望30秒内不要再访问我了，并给一个etag
    // 30s内，客户端再次访问我的时候，会带上上次的etag，我需要判断etag是否一致 
    // 如果一致，就返回304，不一致，就返回新的etag，并且返回新的内容
    // max-age=0 每次都发请求到服务器
    res.setHeader('Cache-Control', 'max-age=30');

    const etag = md5.update(readFileSync(accessUrl, 'utf-8')).digest('base64');
    res.setHeader('ETag', etag);
    if (req.headers['if-none-match'] === etag) {
      res.statusCode = 304;
      return res.end();
    }
    return false
  }
  // 压缩相关
  compress(req, res) {
    const encoding = req.headers['accept-encoding'];
    if (encoding) {
      if (encoding.includes('gzip')) {
        res.setHeader('Content-Encoding', 'gzip');
        return zlib.createGzip();
      } else if (encoding.includes('deflate')) {
        res.setHeader('Content-Encoding', 'deflate');
        return zlib.createDeflate();
      } else if (encoding.includes('br')) {
        res.setHeader('Content-Encoding', 'br');
        return zlib.createBrotliCompress();
      }
    }

  }
  sendFile(accessUrl, req, res) {
    // 缓存
    // Cache-Control: max-age=0 没有缓存 要向服务器发送请求
    // Cache-Control: no-cache 有缓存 但是每次都要向服务器发送请求
    // Cache-Control: no-store 没有缓存 也不会缓存
    // Cache-Control: max-age=20 20秒内不会向服务器发送请求
    // Cache-Control: s-maxage=20 20秒内不会向服务器发送请求 但是会向代理服务器发送请求
    // Expires: -1  代表的是过去的时间，浏览器会认为已经过期了，每次都会向服务器发送请求
    // Expires: 2021-08-01 20:00:00 代表的是未来的时间，浏览器会认为还没有过期，不会向服务器发送请求
    // Last-Modified: 上次修改的时间，如果文件没有修改，就不会向服务器发送请求
    // If-Modified-Since: 上次修改的时间，如果文件没有修改，就不会向服务器发送请求
    // ETag: 文件的唯一标识，如果文件没有修改，就不会向服务器发送请求
    // If-None-Match: 文件的唯一标识，如果文件没有修改，就不会向服务器发送请求
    // 服务器会根据If-Modified-Since和If-None-Match的值来判断文件是否修改了
    // 如果没有修改，就会返回304，浏览器会从缓存中读取文件
    // 如果修改了，就会返回200，浏览器会从服务器中读取文件

    // Cache-Control 和 Expirs 是设置强制缓存的
    // 什么时候用强制缓存？ 强制缓存，不会向服务端发送请求，直接从缓存中拿
    // 但是如果文件修改了，强制缓存就会失效，需要向服务器发送请求，判断文件是否修改了

    //res.setHeader('Cache-Control', 'max-age=20');

    //// 服务器的时间和客户端的时间可能不一致，所以要设置一个过期时间
    //res.setHeader('Expires', new Date(Date.now() + 20 * 1000).toGMTString());

    // 协商缓存，特点就是询问服务器是否需要缓存 服务端设置的
    // 这种方式的缺陷是，可能1s内修改了多次，会有文件变化了还是用以前的
    //res.setHeader('Last-Modified', new Date().toGMTString());
    // 下次请求的时候在请求头中带上上次修改的时间
    //if (req.headers['if-modified-since'] === res.getHeader('Last-Modified')) {
    //  // 表示文件没有修改，可以使用缓存
    //  res.statusCode = 304
    //  return res.end()
    //}

    // 比较前后的内容是否一致，一致就不需要返回内容了
    //const md5 = crypto.createHash("md5");

    //const etag = md5.update(readFileSync(accessUrl, 'utf-8')).digest('base64');

    //res.setHeader("ETag", etag);

    //if (req.headers["if-none-match"] === etag) {
    //  res.statusCode = 304;
    //  return res.end();
    //}
    
    let stream;
    if (this.compress(req, res)) {
      createReadStream(accessUrl).pipe(stream).pipe(res);  
    } else {
      createReadStream(accessUrl).pipe(res)
    }

    // 根据后缀识别文件的类型，设置到响应头中
    const fileType = mime.getType(accessUrl || "text/plain"); // 解决乱码的问题
    res.setHeader("Content-Type", `${fileType};charset=utf-8`);
    createReadStream(accessUrl).pipe(res); // 读取文件的流
  }
  sendError(accessUrl, req, res) {
    console.log(`Not Found ${accessUrl}`);
    res.statusCode = 404;
    res.end(`Not Found`);
  }
  async processDir(accessUrl, pathname, req, res) {
    try {
      const assetsUrl = path.join(accessUrl, "index.html");
      await fsPromise.access(assetsUrl);
      this.sendFile(assetsUrl, req, res);
    } catch (error) {
      // 如果没有index.html, 就返回文件夹的内容
      const dirs = await fsPromise.readdir(accessUrl);
      const tmplStr = ejs.render(this.template, {
        //dirs: dirs.map(dir => ({
        //  url: path.join(pathname, dir),
        //  dir
        //}))
        dirs: await Promise.all(
          dirs.map(async (dir) => {
            const statInfo = await fsPromise.stat(path.join(accessUrl, dir));
            return {
              url: path.join(pathname, dir),
              dir,
              size: statInfo.size,
              ctime: statInfo.ctime.toLocaleString(),
            };
          })
        ),
      });
      res.setHeader("Content-Type", `text/html;charset=utf-8`);
      res.end(tmplStr);
    }
  }
  async processData(pathname, req, res) {
    const mockFilePath = path.join(this.directory, "mock/index.js");
    try {
      let { default: plugin } = await import(mockFilePath);
      return plugin(pathname, req, res);
    } catch (error) {
      return false;
    }
  }
  cors(req, res) {
    // cookie 跨域需要提供确切的origin 不能是*
    // 跨域了的化 req中就有origin属性
    if (req.headers["origin"]) {
      res.setHeader("Access-Control-Allow-Origin", req.headers["origin"]);
      res.setHeader("Access-Control-Allow-Headers", "token, Content-Type");
      res.setHeader("Access-Control-Allow-Max-Age", 20);
      res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE");

      if (req.method === "OPTIONS") {
        res.end();
        return true;
      }
    }
  }
  handleRequest = async (req, res) => {
    const { pathname, query } = url.parse(req.url, true);
    const accessUrl = path.join(this.directory, decodeURIComponent(pathname));

    // 处理跨域
    const isOption = this.cors(req, res);
    if (isOption) return;

    req.query = query;
    req.body = await new Promise((resolve, reject) => {
      let arr = [];
      req.on("data", (chunk) => {
        arr.push(chunk);
      });
      req.on("end", () => {
        const payload = Buffer.concat(arr).toString();

        if (
          req.headers["content-type"] === "application/x-www-form-urlencoded"
        ) {
          resolve(querystring.parse(payload));
        } else if (req.headers["content-type"] === "application/json") {
          resolve(JSON.parse(payload));
        } else if (req.headers["content-type"] === "text/plain") {
          resolve(payload);
        } else {
          resolve({});
        }
      });
    });
    // 处理mock数据
    let flag = this.processData(pathname, req, res);
    if (flag) return;

    try {
      const statObj = await fsPromise.stat(accessUrl);
      // 看看文件是否存在
      if (statObj.isFile()) {
        this.sendFile(accessUrl, req, res);
      } else {
        // 如果是文件夹，尝试找index.html, 如果有就返回，没有就返回文件夹的内容
        this.processDir(accessUrl, pathname, req, res);
      }
    } catch (error) {
      this.sendError(accessUrl, req, res);
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
      getNetworkInterfaces().forEach((address) =>
        console.log(`  http://${address}:${chalk.green(this.port)}`)
      );
    });
  }
}

//new Server({
//  port: 3000,
//  directory: process.cwd(), // 当前工作目录
//}).start();

export default Server;
