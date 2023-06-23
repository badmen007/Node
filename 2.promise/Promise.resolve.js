const Promise = require("./promise.js");

// Promise.resolve 有一个特点就是会产生一个新的promise ，如果你传入的值是一个promise？
//

Promise.resolve(
  new Promise((resolve) => {
    setTimeout(() => {
      resolve("ok");
    }, 1000);
  })
).then((data) => {
  console.log(data);
});

Promise.reject(
  new Promise((resolve) => {
    setTimeout(() => {
      resolve("abc");
    }, 1000);
  })
).catch((err) => {
  console.log(err, 'error');
});


// resolve 有等待的效果 reject 没有等待的效果
