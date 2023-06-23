const fs = require('fs')
const path = require('path')

let person = {}

let event = {
  _arr: [],
  on(fn) {
    this._arr.push(fn)
  },
  emit(...args) {
    this._arr.forEach(fn => fn(...args))
  }
}

event.on(function(key, data) {
  person[key] = data
  console.log('读取了一次')
})

event.on(function() {
  if (Object.keys(person).length === 2) {
    console.log(person)
  }
})


fs.readFile(path.resolve(__dirname, 'name.txt'), 'utf8', function(err, data) {
  event.emit('name', data)
})

fs.readFile(path.resolve(__dirname, 'age.txt'), 'utf8', function(err, data) {
  event.emit('age', data)
})
