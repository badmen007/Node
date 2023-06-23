
// 可以将一些异步方法转换成promise方法

// const fs = require('fs');
const fs = require('fs/promises')
const path = require('path');


function promisify(fn) {
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn(...args, function(err, data) {
        if (err) reject(err);
        resolve(data);
      })
    })
  }
}

function promisisyAll(obj) {
  for(let key in obj) {
    const val = obj[key]
    if (typeof val === 'function') {
      obj[key] = promisify(val)
    }
  }
}

// let readFile = promisify(fs)

// let readFile = promisify(fs.readFile);
fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8').then(data => {
  console.log(data)
})
