const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newBlock);
  }

  static isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { lastHash, hash, data, timestamp, nonce, difficulty } = chain[i];
      const actualLastHash = chain[i - 1].hash;

      if (lastHash !== actualLastHash) {
        return false;
      }

      const validatedHash = cryptoHash(timestamp, lastHash, data ,nonce, difficulty);
      if (hash !== validatedHash) {
        return false;
      }
    }

    return true;
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return false;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain is not valid");
      return false;
    }
    console.log("Replacing blockchain with the new chain");
    this.chain = chain;
    return true;
  }
}
module.exports = Blockchain;
