# upyun-tool
[![NPM version](https://img.shields.io/npm/v/upyun-tool.svg?style=flat)](https://www.npmjs.org/package/upyun-tool)

Please see the upyun official SDK document first

* https://github.com/upyun/node-sdk

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
