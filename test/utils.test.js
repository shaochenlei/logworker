const { expect } = require('chai')
const { 
    hash,
    merge,
    getPercent,
    getPreSum
 } = require('../src/utils')

const arrayEquals = (arr1, arr2) => {
    if(arr1.length !== arr2.length) return false
    arr1.forEach((v,i) => {
        if(v !== arr2[i]) return false
    });
    return true
}

describe('hash', () => {
    it('should return correct hash', () => {
        expect(hash('2020-09-01.log', 4)).to.equal(1)
        expect(hash('2020-09-02.log', 4)).to.equal(2)
    })
})

describe('merge', () => {
    it('should return first array if two array have different length', () => {
        expect(arrayEquals([1,2,3], merge([1,2,3],[4,5]))).to.be.true
    })

    it('should merge two arrays and return a new array', () => {
        expect(arrayEquals([5,7,9], merge([1,2,3],[4,5,6]))).to.be.true
    })
})

describe('getPercent', () => {
    it('should return -1 if percentage < 0 or > 1', () => {
        expect(getPercent([1,3,5,8,10], -1)).to.equal(-1)
        expect(getPercent([1,3,5,8,10], 1.1)).to.equal(-1)
    })

    it('should return correct index', () => {
        expect(getPercent([1,3,5,8,10], 0.9)).to.equal(4)
        expect(getPercent([1,3,5,8,10], 0.5)).to.equal(2)
    })
})

describe('getPreSum', () => {
    it('should handle empty array', () => {
        expect(arrayEquals([], getPreSum([]))).to.be.true
    })

    it('should return prefix sum array', () => {
        expect(arrayEquals([1,3,6], getPreSum([1,2,3]))).to.be.true
    })
})