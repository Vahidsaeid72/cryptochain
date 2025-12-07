const express = require("express");
const Blockchain = require("./blockchain");
const PubSub = require("./pubsub");
const tcpPortUsed = require("tcp-port-used");
const axios = require("axios");

const app = express();
app.use(express.json());
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

// setTimeout(() => {
//   pubsub.broadcastChain();
// }, 1000);

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  if (data === undefined) {
    return res.status(400).json({ error: "data is required" });
  }
  const block = blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect(`/api/blocks`);
});
const rootPort = 3000;
let Port = 3000;

const syncChains = async () => {
  const res = await axios.get(`http://localhost:${rootPort}/api/blocks`);
  blockchain.replaceChain(res.data);
}


const checkPort = async () => {
  while (await tcpPortUsed.check(Port)) {
    Port += Math.ceil(Math.random() * 1000);
  }
  return Port;
}

const startServer = async () => {
  const port = await checkPort();
  app.listen(port, () => {
    if (port !== rootPort) {
      syncChains();
    }
    console.log(`Server is running on ${port}`);
  });
}

startServer();

module.exports = app;
