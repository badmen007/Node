const Koa = require("koa");
const Router = require("koa-router");
const session = require("./koa-session");
const bodyParser = require("koa-bodyparser");

const app = new Koa();
const router = new Router();

app.keys = ['xz']
app.use(session(app));
app.use(bodyParser());

router.get('/login', async (ctx) => {
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

router.post('/login', async (ctx) => {
  let { username } = ctx.request.body;
  ctx.session.username = username
  ctx.redirect('/user')
})

router.get('/user', async (ctx) => {
  let username = ctx.session.username
  ctx.body = username
})

app.use(router.routes());

app.listen(3000, () =>
  console.log("server is running at http://localhost:3000")
);
