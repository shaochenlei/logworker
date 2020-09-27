const { Worker, isMainThread, parentPort, workerData } = require('worker_threads')
const { hash, merge, getPercent, getPreSum } = require('./utils')
const { N, LOG_REL_PATH } = require('./constants')
const os = require('os')
const fs = require('fs')
const path = require('path')
const readline = require('readline')

const threadCount = os.cpus().length
const threads = new Set()
// initialize log list to be dispatched to workers
const logsToDispatch = new Array(threadCount)
for(let i = 0; i < logsToDispatch.length; i++) {
    logsToDispatch[i] = []
}

if(isMainThread) {
    let counters = new Array(N).fill(0)
    fs.readdir(path.resolve(__dirname, LOG_REL_PATH), (err, files) => {
        if(err) console.error(err)
        
        files.forEach(f => {
            if(!f.endsWith('.log')) return
            logsToDispatch[hash(f, threadCount)].push(f)
        })
        // create workers
        for(let i = 0; i < threadCount; i++) {
            threads.add(new Worker(__filename, { workerData: { logs:logsToDispatch[i] } }))
        }
        for(let worker of threads) {
            worker.on('error', e => {throw e })
            worker.on('exit', () => {
                threads.delete(worker)
                // after all workers finish job, print final results
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
                // filter out outliers due to random log generator algotithm
                if(parseInt(respondTime) >= 0 && respondTime <= N) {
                    // accumulate buckets
                    threadRes[respondTime]++
                }
            })

            rl.on('close', () => {
                // after read of last log, send data to parent
                if(i === workerData.logs.length-1) {
                    // send data after random milliseconds to avoid race condition
                    setTimeout(() => {
                        parentPort.postMessage(threadRes)
                    }, Math.random() * 300)
                }
            })

    })
    
}
