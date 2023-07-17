const path = require("path");
const { createReadStream } = require("fs");
const { access } = require("fs/promises");
const mime = require('mime')

module.exports = function (root) {
  // 静态文件中间件的优先级不较低
  return async function (ctx, next) {
    // 先向后执行
    await next();
    // 判断后面的执行有没有赋给响应体
    if (!!ctx.body) return;

    // 先拿到文件的绝对路径
    const filename = path.join(root, ctx.path);
    // 判断文件是否存在
    if (exists(filename)) {
      // 获取文件的扩展名 就是文件的类型
      ctx.set("Content-Type",mime.getType(path.extname(ctx.path)));
      ctx.body = createReadStream(filename);
    }
  };
};

// 判断一个路径上的文件是否存在
async function exists(path) {
  try {
    await access(path);
    return true;
  } catch (error) {
    return false;
  }
}
