const SHA256 = require('crypto-js/sha256')

const numBloks = 4
const difficulty_ = 4

class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }

    calculateHash() {
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString()
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
            this.nonce ++
            this.hash = this.calculateHash()
        }
        console.log(JSON.stringify(this, null, 4))
    }
}

class Blockchain {
    
    constructor() {
        this.chain = [this.createGenesisBlock()]
        console.log('Genesis block', JSON.stringify(this.chain[0], null, 4))
        this.difficulty = difficulty_
    }
    createGenesisBlock() {
        let d = new Date()
        return new Block(d.getTime(), {type: 'Genesis block'}, '0')
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash
        newBlock.mineBlock(this.difficulty)
        this.chain.push(newBlock)
    }

    isChainValid() {
        for(let i = 1; i < this.chain.length; i ++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if(currentBlock.hash !== currentBlock.calculateHash()) return false
            if(currentBlock.previousHash !== previousBlock.hash) return false
        }
        return true
    }
}

let d = new Date()
let testChain = new Blockchain()
for(let i = 1; i <= numBloks; i ++) {
    console.log(`Mining block ${i}...`)
    testChain.addBlock(new Block(d.getTime(), {type: 'trx', user: `gustavo${i}`, query: `SELECT * FROM table${i}`}))
}
