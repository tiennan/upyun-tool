# upyun-tool

Please see the upyun official API document first
https://github.com/upyun/node-sdk
http://docs.upyun.com/api/rest_api/

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

More example at ./test/test.js
