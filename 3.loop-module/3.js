const fs = require('fs')
const path = require('path')
const vm = require('vm')
function Module(id) {
    this.id = id
    this.exports = {}
}
Module.prototype.load = function() {
    const ext = path.extname(this.id)
    Module._extensions[ext](this)
}
Module._extensions = {
    '.js'(module){
        const content = fs.readFileSync(module.id, 'utf8')
        const fn = vm.compileFunction(content, ['exports', 'module', 'require', '__dirname', '__filename'])
        const exports = module.exports
        let thisValue = exports
        const require = req
        const filename = module.id
        const dirname = path.dirname(filename)
        console.log(fn.toString())
        Reflect.apply(fn, thisValue, [exports, module, require, dirname, filename])
    },
    '.json'(module){
        const content = fs.readFileSync(module.id, 'utf8')
        module.exports = JSON.parse(content)
    }
}
Module._resolveFilename = function(id) {
    const filename = path.resolve(__dirname, id)
    if (fs.existsSync(filename)) {
        return filename
    }
    const keys = Object.keys(Module._extensions)
    for (let i = 0; i < keys.length; i++) {
        const ext = keys[i]
        const filename = path.resolve(__dirname, id + ext)
        if (fs.existsSync(filename)) {
            return filename
        }
    }
    throw new Error('module not found')
}
Module._cache = {} // 缓存

function req(id) {
    const filename = Module._resolveFilename(id)
    let existsModule = Module._cache[filename]
    if (existsModule) {
        return existsModule.exports
    }
    const module = new Module(filename)
    Module._cache[filename] = module
    module.load()
    return module.exports
}


const a = req('./a')
console.log(a)

// 1. 先通过id来解析出一个绝对路径 拼接括扩展名
// 2. 读出文件的内容，创造一个沙箱环境执行 vm.compilerFunction Reflect.apply执行 
// 3. 模块的缓存 通过文件名来缓存
// 4. this === module.exports
// ✅ =》exports.a = 100;
// ❌ => exports = { a: 1 } 用户不能直接改变exports的引用，因为不会导致module.exports的变化