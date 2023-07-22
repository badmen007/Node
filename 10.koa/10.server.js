
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require('./koa-router')
const app = new Koa();

app.use(bodyParser());

// 创建路由类的实例
const router = new Router()
// 当客户端以GET方式请求 /login 路径时，会执行后面的回调函数
router.get('/login', async (ctx, next) => {
    let html = `
      <form action="/login" method="post">
        <p>用户名</p>
        <input type="text" name="username"> <br/>
        <button type="submit">submit</button>
      </form>
    `;
    ctx.set('Content-Type', 'text/html;charset=utf-8')
    ctx.body = html;
})

router.post('/login', async (ctx, next) => {
  let { username } = ctx.request.body;
  ctx.cookies.set('username', username)
  ctx.redirect('/user')
})

router.get('/user', async (ctx, next) => {
  let username = ctx.cookies.get('username')
  ctx.body = username
})
// 调用router.routes方法返回一个中间件函数
app.use(router.routes())

app.listen(3000, () =>
  console.log("server is running at http://localhost:3000")
);
