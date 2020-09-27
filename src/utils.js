// get hash of log files
const hash = (str, size) => {
    return str.substring(str.length - 6, str.length - 4) % size
}

// merge two arrays with same length
const merge = (arr1, arr2) => {
    return arr1.map((v, i) => v + arr2[i])
}

// get index of preSum array which is equal or greater than x percentage of all values
const getPercent = (preSum, percent) => {
    const target = Math.floor(preSum[preSum.length - 1] * percent)
    let l = 0, r = preSum.length - 1
    while (l <= r) {
        let mid = l + Math.floor((r - l) / 2)
        if (preSum[mid] < target) {
            l = mid + 1
        } else {
            r = mid - 1
        }
    }
    return l
}

// get prefix sum of the array
const getPreSum = (arr) => {
    let preSum = 0
    return arr.map((v, i) => {
        let res = v + preSum
        preSum += v
        return res
    })
}

module.exports = {
    hash,
    merge,
    getPercent,
    getPreSum
}