
const querystring = require('querystring');
module.exports = function () {
  return async function bodyParser(ctx, next) {
    //获取请求体并赋值给ctx.request.body
    let body = await parseBody(ctx.req);
    const contentType = ctx.get('Content-Type');
    if (contentType === 'application/json') {
      body = JSON.parse(body);
    } else if (contentType === 'application/x-www-form-urlencoded') {
      // 把字符串转换成对象
      body = querystring.parse(body)
    }
    ctx.request.body = body; 
    await next();
  }
}

// 解析请求体
function parseBody(req) {
  return new Promise(resolve => {

    let buffers = [];

    // 请求体传输过程中
    req.on('data', chunk => {
      buffers.push(chunk);
    })
    // 请求体接收完毕
    req.on('end', () => {
     resolve(Buffer.concat(buffers).toString())
    })
  })
  
}
