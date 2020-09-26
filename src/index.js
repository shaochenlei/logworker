const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const os = require('os')
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const threadCount = os.cpus().length
const threads = new Set()
const N = 10000
const LOG_REL_PATH = '../var/log/httpd'
const logsToDispatch = new Array(threadCount)
for(let i = 0; i < logsToDispatch.length; i++) {
    logsToDispatch[i] = []
}

const hash = (str) => {
    return str.substring(str.length-6, str.length-4) % threadCount
}

const merge = (arr1, arr2) => {
    return arr1.map((v,i) => v+arr2[i])
}

const getPercent = (preSum, percent) => {
    console.log(preSum[preSum.length-1])
    const target = Math.floor(preSum[preSum.length-1] * percent)
    let l = 0, r = preSum.length-1
    while(l <= r) {
        let mid = l + Math.floor((r-l)/2)
        if(preSum[mid] < target) {
            l = mid + 1
        } else {
            r = mid-1
        }
    }
    return l
}

const getPreSum = (arr) => {
    let preSum = 0
    return arr.map((v,i) => {
        let res = v + preSum
        preSum += v
        return res
    })
}

if(isMainThread) {
    let counters = new Array(N).fill(0)
    fs.readdir(path.resolve(__dirname, LOG_REL_PATH), (err, files) => {
        if(err) console.error(err)
        
        files.forEach(f => {
            if(!f.endsWith('.log')) return
            logsToDispatch[hash(f)].push(f)
        })
        // create workers
        for(let i = 0; i < threadCount; i++) {
            threads.add(new Worker(__filename, { workerData: { logs:logsToDispatch[i] } }))
        }
        for(let worker of threads) {
            worker.on('error', (err) => {throw err })
            worker.on('exit', () => {
                threads.delete(worker)
                // console.log(`Thread exiting, ${threads.size} running...`)
                if(threads.size === 0) {
                    const preSum = getPreSum(counters)
                    const res90 = getPercent(preSum, 0.9)
                    const res95 = getPercent(preSum, 0.95)
                    const res99 = getPercent(preSum, 0.99)
                    console.log(`90% of requests return a response within ${res90} ms`)
                    console.log(`95% of requests return a response within ${res95} ms`)
                    console.log(`99% of requests return a response within ${res99} ms`)
                }
            })
            worker.on('message', (data) => {
                // merge data
                counters = merge(counters, data)
                
            })
        }
    })
} else {
    const threadRes = new Array(N).fill(0)
    workerData.logs.forEach((f, i) => {
        let filePath = path.resolve(__dirname, LOG_REL_PATH, f)
            const rl = readline.createInterface({
                input: fs.createReadStream(filePath)
            })

            rl.on('line', (line) => {
                let arr = line.split(' ')
                let respondTime = arr[arr.length-1]
                if(parseInt(respondTime) > 0) {
                    threadRes[respondTime]++
                }
            })

            rl.on('close', () => {
                if(i === workerData.logs.length-1) {
                    console.log(threadRes)
                    parentPort.postMessage(threadRes)
                }
            })

    })
    
}
