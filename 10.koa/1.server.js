const Koa = require("./koa");

const app = new Koa();

app.use((ctx) => {
  ctx.res.end("hello world");
});

app.listen(3000, () =>
  console.log("server is running at http://localhost:3000")
);
