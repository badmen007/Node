const Koa = require("koa");
const bodyParser = require("./koa-bodyparser");

const app = new Koa();

app.use(bodyParser());
app.use(async (ctx, next) => {
  if (ctx.path === "/login" && ctx.method === "GET") {
    let html = `
      <form action="/login" method="post">
        <p>用户名</p>
        <input type="text" name="username"> <br/>
        <button type="submit">submit</button>
      </form>
    `;
    ctx.set('Content-Type', 'text/html;charset=utf-8')
    ctx.body = html;
  } else if (ctx.path === '/login' && ctx.method === 'POST') {
    // 获取请求体 通过ctx.request.body
    // koa没有提供获取请求体的方法 需要借助第三方模块 koa-bodyparser
    ctx.body = ctx.request.body
  } else {
    ctt.body = 'Not Found'
  }
});

app.listen(3000, () =>
  console.log("server is running at http://localhost:3000")
);
