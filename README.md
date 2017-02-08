# upyun-tool
[![NPM version](https://img.shields.io/npm/v/upyun-tool.svg?style=flat)](https://www.npmjs.org/package/upyun-tool)

Please see the upyun official SDK document first

* https://github.com/upyun/node-sdk

upyun-tool promise化了upyun SDK提供的API，并新增`putDir`方法一次性上传完整目录结构

# Install
```
$ npm install upyun-tool --save
```

# Example
```
const UpYunTool = require('upyun-tool')
var foo = new UpYunTool({
    bucket: 'bucket',
    operator: 'operator',
    password: 'password',
    console: false
})
async function start() {
    let result = await foo.usage()
    console.log(result)
}
start()
```

More example please see ./test/test.js

# API

### putDir(remotePath, localPath)

上传完整目录结构

__参数__

* `remotePath` 欲创建的目录路径
* `localPath` 本地目录路径

__响应__

```
[ '/upyun-tool-test-folder/foo/foo.js',
  '/upyun-tool-test-folder/foo/sub/foo1.css',
  '/upyun-tool-test-folder/foo/sub/foo2.svg',
  '/upyun-tool-test-folder/foo/sub/foo3.jpg'
]
```

__示例__

```
result = await foo.putDir(remotePath + '/foo', path.join(__dirname, 'foo'))
console.log(result)
```
