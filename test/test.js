const UpYunTool = require('../index')
const path = require('path')

var foo = new UpYunTool({
    bucket: 'bucket',
    operator: 'operator',
    password: 'password',
    console: false
})

function sleep(delay) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

async function start() {
    const remotePath = '/upyun-tool-test-folder'
    console.log('Start test')

    console.log('# usage')
    let result = await foo.usage()
    console.log(result)

    console.log('# listDir')
    result = await foo.listDir('/')
    console.log(result)

    console.log('# makeDir ' + remotePath)
    result = await foo.makeDir(remotePath)
    console.log(result)

    console.log('# listDir')
    result = await foo.listDir('/')
    console.log(result)

    console.log('# putFile '+ remotePath +'/test.js')
    result = await foo.putFile(remotePath + '/test.js', path.join(__dirname, 'test.js'), null, true, null)
    console.log(result)

    console.log('# listDir ' + remotePath)
    result = await foo.listDir(remotePath)
    console.log(result)

    console.log('# headFile ' + remotePath + '/test.js')
    result = await foo.headFile(remotePath + '/test.js')
    console.log(result)

    console.log('# deleteFile ' + remotePath + '/test.js')
    result = await foo.deleteFile(remotePath + '/test.js')
    console.log(result)

    console.log('# listDir ' + remotePath)
    result = await foo.listDir(remotePath)
    console.log(result)

    console.log('# putDir ' + remotePath + '/foo')
    result = await foo.putDir(remotePath + '/foo', path.join(__dirname, 'foo'))
    console.log(result)

    console.log('# listDir ' + remotePath)
    result = await foo.listDir(remotePath)
    console.log(result)

    console.log('# listDir ' + remotePath + '/foo')
    result = await foo.listDir(remotePath + '/foo')
    console.log(result)

    console.log('# listDir ' + remotePath + '/foo/sub')
    result = await foo.listDir(remotePath + '/foo/sub')
    console.log(result)

    console.log('# headFile ' + remotePath + '/foo/sub/foo1.css')
    result = await foo.headFile(remotePath + '/foo/sub/foo1.css')
    console.log(result)

    console.log('# headFile ' + remotePath + '/foo/sub/foo2.svg')
    result = await foo.headFile(remotePath + '/foo/sub/foo2.svg')
    console.log(result)

    console.log('# headFile ' + remotePath + '/foo/sub/foo3.jpg')
    result = await foo.headFile(remotePath + '/foo/sub/foo3.jpg')
    console.log(result)

    console.log('# getFile ' + remotePath + '/foo/sub/foo3.jpg')
    result = await foo.getFile(remotePath + '/foo/sub/foo3.jpg', path.join(__dirname, 'downloaded.jpg'))
    console.log(result)

    console.log('# deleteFile ' + remotePath + '/foo/sub/foo1.css')
    result = await foo.deleteFile(remotePath + '/foo/sub/foo1.css')
    console.log(result)

    console.log('# deleteFile ' + remotePath + '/foo/sub/foo2.svg')
    result = await foo.deleteFile(remotePath + '/foo/sub/foo2.svg')
    console.log(result)

    console.log('# deleteFile ' + remotePath + '/foo/sub/foo3.jpg')
    result = await foo.deleteFile(remotePath + '/foo/sub/foo3.jpg')
    console.log(result)

    await sleep(3000)

    console.log('# removeDir '+ remotePath + '/foo/sub')
    result = await foo.removeDir(remotePath + '/foo/sub')
    console.log(result)

    console.log('# deleteFile ' + remotePath + '/foo/foo.js')
    result = await foo.deleteFile(remotePath + '/foo/foo.js')
    console.log(result)

    await sleep(3000)

    console.log('# removeDir '+ remotePath + '/foo')
    result = await foo.removeDir(remotePath + '/foo')
    console.log(result)

    console.log('# removeDir '+ remotePath)
    result = await foo.removeDir(remotePath)
    console.log(result)

    console.log('# listDir /')
    result = await foo.listDir('/')
    console.log(result)

    console.log('done.')
}

start()
