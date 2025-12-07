const INITIAL_DIFFICULTY = 6;
const MINE_RATE = 10000;

const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "-----",
  hash: "hash-one",
  data: [],
  nonce: 0,
  difficulty: INITIAL_DIFFICULTY,
};

module.exports = { GENESIS_DATA ,MINE_RATE};