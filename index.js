const express = require("express");
const Blockchain = require("./blockchain");

const app = express();
app.use(express.json());
const blockchain = new Blockchain();

app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain);
});
app.post("/api/mine", (req, res) => {
    const {data} = req.body;
    if (data === undefined) {
        return res.status(400).json({ error: "data is required" });
    }   
    const block = blockchain.addBlock({ data });
    res.redirect(`/api/blocks`);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

module.exports = app;