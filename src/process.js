const fs = require("fs-extra");
const { getConfig } = require("./config");
const { getHandler } = require("./handler");

async function process(config) {
  const handler = getHandler();
  config.forEach(async file => {
    if (file.data) {
      await fs.outputFile(file.name, await handler(file));
    } else {
      await fs.remove(file.name);
    }
  });
}

module.exports = {
  process
};
