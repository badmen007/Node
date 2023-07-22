const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const bodyParser = require("koa-bodyparser");
const jwt = require("jwt-simple");

const secreKey = "secretKey";
app.use(bodyParser());

router.get("/login", async (ctx) => {
  const html = `
    <form action='/login' method='post'>
      <input type='text' name='username' />
      <input type='submit' />
    </form>
`;
  ctx.body = html;
});

router.post("/login", async (ctx) => {
  const { username } = ctx.request.body;

  const expirationTime = 60 * 60 * 1000;
  const expirationDate = Math.floor(Date.now() / 1000) + expirationTime;

  const token = jwt.encode({ username, exp: expirationDate }, secreKey);
  ctx.body = { token };
});

router.get("/user", async (ctx) => {
  const { authorization } = ctx.request.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    let token = authorization.slice(7);
    try {
      let payload = jwt.decode(token, secreKey);
      ctx.body = payload;
    } catch (error) {
      ctx.status = "401";
      ctx.body = "Invalide tolen";
    }
  }
});

app.use(router.routes());

app.listen(3000, () =>
  console.log("server is running at http://localhost:3000")
);
