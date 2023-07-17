const Koa = require("./koa");
const app = new Koa();
const middleware1 = async (ctx, next) => {
  throw new Error("middleware1 error");
  console.time("cost");
  console.log(1);
  await next();
  console.log(2);
  console.timeEnd("cost");
};
const middleware2 = async (ctx, next) => {
  console.log(3);
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`sleep2`);
      resolve();
    }, 1000);
  });
  await next();
  console.log(4);
};
const middleware3 = async (ctx, next) => {
  console.log(5);
  await new Promise((resolve) => {
    setTimeout(() => {
      console.log(`sleep3`);
      resolve();
    }, 1000);
  });
  await next();
  console.log(6);
  ctx.body = "server4";
};
app.use(middleware1);
app.use(middleware2);
app.use(middleware3);
app.listen(3000, () =>
  console.log("server is running at http://localhost:3000")
);
