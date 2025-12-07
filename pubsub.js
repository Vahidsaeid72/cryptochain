const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
    this.init();
  }

  async init() {
    await this.publisher.connect();
    await this.subscriber.connect();

    for (const channel of Object.values(CHANNELS)) {
      await this.subscriber.subscribe(channel, (message) => {
        this.handleMessage(channel, message);
      });
    }
  }

  async broadcastChain() {
    await this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  async publish({ channel, message }) {
    await this.publisher.publish(channel, message);
  }

  handleMessage(channel, message) {
    if (channel === CHANNELS.BLOCKCHAIN) {
      const parsedMessage = JSON.parse(message);
      this.blockchain.replaceChain(parsedMessage);
    }
  }
}

module.exports = PubSub;
