/**
 * Also see the official API document
 * https://github.com/upyun/node-sdk
 * http://docs.upyun.com/api/rest_api/
 */
const fsp = require('fs-promise')
const path = require('path')
const UpYun = require('upyun')

class UpYunTool {
    constructor(params) {
        this.console = params.console
        this.upyun = new UpYun(params.bucket, params.operator, params.password, 'v0.api.upyun.com', {
            apiVersion: 'v2'
        })
    }
    // --- Basic functions ---
    /**
     * @return Number // byte
     */
    usage() {
        return new Promise((resolve, reject) => {
            this.upyun.usage((err, result) => {
                if (!err && result && result.statusCode === 200) {
                    const usageByte = Number(result.data)
                    if (this.console) console.log('usage ' + usageByte + ' bytes (' + (usageByte/1024/1024).toFixed(2)+' MB)')
                    resolve(Number(result.data))
                } else {
                    reject(result)
                }
            })
        })
    }
    /**
     * @return
     * [{ 
     *     name: String,
     *     type: String, // 'file' | 'folder'
     *     size: Number, // byte
     *     date: Number // timestamp seconds
     * }]
     */
    listDir(remotePath, limit, order, iter) {
        return new Promise((resolve, reject) => {
            this.upyun.listDir(remotePath, limit, order, iter, (err, result) => {
                if (!err && result && result.statusCode === 200) {
                    if (!result.data) return resolve([])
                    let list = result.data.split('\n').map((str) => {
                        let subs = str.split('\t')
                        if (subs[1] === 'F') subs[1] = 'folder'
                        else if (subs[1] === 'N') subs[1] = 'file'
                        return {
                            name: subs[0],
                            type: subs[1],
                            size: Number(subs[2]),
                            date: Number(subs[3])
                        }
                    })
                    if (this.console) {
                        console.log('listDir:')
                        console.dir(list)
                    }
                    resolve(list)
                } else {
                    reject(result)
                }
            })
        })
    }
    makeDir(remotePath) {
        return new Promise((resolve, reject) => {
            this.upyun.makeDir(remotePath, (err, result) => {
                if (!err && result && result.statusCode === 200) {
                    if (this.console) console.log('[OK]makeDir: ' + remotePath)
                    resolve(true)
                } else {
                    if (this.console) console.log('makeDir fail: ' + remotePath)
                    reject(result)
                }
            })
        })
    }
    removeDir(remotePath) {
        return new Promise((resolve, reject) => {
            this.upyun.removeDir(remotePath, (err, result) => {
                if (!err && result && result.statusCode === 200) {
                    if (this.console) console.log('[OK]removeDir: ' + remotePath)
                    resolve(true)
                } else {
                    if (this.console) console.log('removeDir fail: ' + remotePath)
                    reject(result)
                }
            })
        })
    }
    putFile(remotePath, localFile, type, checksum, opts) {
        return new Promise((resolve, reject) => {
            if (this.console) console.log('[OK]putFile: ' + remotePath)
            this.upyun.putFile(remotePath, localFile, type, checksum, opts, (err, result) => {
                if (!err && result && result.statusCode === 200) {
                    if (this.console) console.log('[OK]putFile: ' + remotePath)
                    resolve(remotePath)
                } else {
                    if (this.console) console.log('putFile fail: ' + remotePath)
                    reject(result)
                }
            })
        })
    }
    headFile(remotePath) {
        return new Promise((resolve, reject) => {
            this.upyun.headFile(remotePath, (err, result) => {
                if (!err && result && result.statusCode === 200) {
                    resolve({
                        type: result.headers['x-upyun-file-type'],
                        size: Number(result.headers['x-upyun-file-size']),
                        date: Number(result.headers['x-upyun-file-date'])
                    })
                    resolve(result)
                } else {
                    reject(result)
                }
            })
        })
    }
    getFile(remotePath, localPath) {
        return new Promise((resolve, reject) => {
            this.upyun.getFile(remotePath, localPath, (err, result) => {
                if (!err && result && result.statusCode === 200) {
                    resolve(result)
                } else {
                    reject(result)
                }
            })
        })
    }
    deleteFile(remotePath) {
        return new Promise((resolve, reject) => {
            this.upyun.deleteFile(remotePath, (err, result) => {
                if (!err && result && result.statusCode === 200) {
                    if (this.console) console.log('[OK]deleteFile: ' + remotePath)
                    resolve(true)
                } else {
                    if (this.console) console.log('deleteFile fail: ' + remotePath)
                    reject(result)
                }
            })
        })
    }

    // --- Advanced functions ---
    putDir(remotePath, localPath) {
        const sub = {
            remotePaths: [],
            localPaths: [],
            promises: []
        }
        return this.makeDir(remotePath).then(() => {
            return fsp.readdir(localPath)
        }).then((names) => {
            names.forEach((name) => {
                if (name && name.length > 0 && name[0] !== '.') {
                    sub.remotePaths.push(remotePath + '/' + name)
                    sub.localPaths.push(path.join(localPath, name))
                    sub.promises.push(fsp.stat(path.join(localPath, name)))
                }
            })
            return Promise.all(sub.promises)
        }).then((datas) => {
            const arrSubP = []
            for (let i = 0;i<datas.length;i++) {
                if (datas[i].isDirectory()) {
                    arrSubP.push(this.putDir(sub.remotePaths[i], sub.localPaths[i]))
                } else {
                    arrSubP.push(this.putFile(sub.remotePaths[i], sub.localPaths[i], null, true, null))
                }
            }
            return Promise.all(arrSubP)
        }).then((results) => {
            let paths = [];
            results.forEach((result) => {
                if (typeof result === 'string') {
                    paths.push(result)
                } else {
                    paths.push.apply(paths, result)
                }
            })
            return paths
        })
    }
}

module.exports = UpYunTool
