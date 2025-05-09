class Utils {
  constructor() {}

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async randomSleep() {
    let max = 5000
    let min = 1000
    let randomTime = Math.random() * (max - min) + min;
    await this.sleep(randomTime)
  }
}

module.exports = Utils