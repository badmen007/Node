// 特点就是随机生成一个字符串，作为用户的标识
function generateKoaSession() {
  return Math.random() + Math.random() + "" + Date.now() + "" + Math.random();
}

function session() {
  // 服务端会有一段内存用来保存每个用户的数据
  // 用户的对话数据保存在服务端的内存中
  const sessionStorage = {};
  return async (ctx, next) => {
    let koasess = ctx.cookies.get("koa.sess");
    if (!koasess) {
      // 如果没有这个值说明是第一次访问
      koasess = generateKoaSession();
      sessionStorage[koasess] = {};
      ctx.cookies.set("koa.sess", koasess, { httpOnly: true });
    }
    ctx.session = sessionStorage[koasess];
    await next();
  };
}

module.exports = session;
