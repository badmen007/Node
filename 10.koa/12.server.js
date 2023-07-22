const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const crypto = require("crypto");

app.keys = ["xz"];

router.get("/write", async (ctx, next) => {
  ctx.cookies.set("username", "zhuang", {
    signed: true, // 表示在写入cookie的时候会对cookie进行签名
  });
});

// 签名的原理
function sign(data, key) { // sha1 生成的签名是128位 
  return crypto.createHmac("sha1", key).update(data).digest("bas64");
}
function get(name, { signed }) {
  var sigName = name + ".sig"; //username.sig
  header = this.request.headers["cookie"];
  var value = "zhufeng";
  let remote = "nCKf_sd5DtVgCmXI_s5HROvdwrQ"; // 已经生成的签名
  let data = "username=zhuang";
  if (remote === sign(data, "zhuang")) { // 拿到签名之后，对比签名是否一致
    return value;
  }
  return undefined;
}

router.get("/read", async (ctx, next) => {
  const username = ctx.cookies.get("username", {
    signed: true,
  });
  ctx.body = `username: ${username}`;
});

app.use(router.routes());
app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
