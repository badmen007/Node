// Promise.all 等待所有的promise都成功才成功，又一个失败就失败了

const path = require("path");
const fs = require("fs");
const { reject } = require("./promise");

function readFile(url) {
  return new Promise((resolve, reject) => {
    fs.readFile(url, "utf8", function (err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
}

Promise.all([
  readFile(path.resolve(__dirname, "name.txt")),
  readFile(path.resolve(__dirname, "age.txt")),
]).then((data) => {
  console.log(data);
});

// 哪个结果快就用哪个结果
Promise.race([
  readFile(path.resolve(__dirname, "name.txt")),
  readFile(path.resolve(__dirname, "age.txt")),
])
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err, "error");
  });

// 调用abort方法可以终止promise
// 超时处理可以用race
function withAbout(userPromise) {
  let abort;
  const internalPromise = new Promise((resolve, reject) => {
    abort = reject;
  });
  let p = Promise.race([userPromise, internalPromise]);

  p.abort = abort;
  return p;
}

let p = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(100);
  }, 3000);
});

p = withAbout(p);

setTimeout(() => {
  p.abort("超时了");
});

p.then((data) => {
  console.log(data, "data");
}).catch((err) => {
  console.log(err, "error");
});

// allSettled
// allSettled 无论成功还是失败都会执行
// allSettled 会返回一个数组，数组中包含每个promise的结果
// allSettled 不会中断

Promise.allSettled([
  readFile(path.resolve(__dirname, "name1.txt")),
  readFile(path.resolve(__dirname, "age.txt")),
  100,
])
  .then((data) => {
    console.log(data, "data");
  })
  .catch((err) => {
    console.log(err, "error");
  });
