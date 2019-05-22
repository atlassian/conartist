const fs = require("fs-extra");
const { getConfig } = require("./config");
const { getHandler } = require("./handler");

async function sync(opts) {
  const config = await getConfig(opts);
  const handler = getHandler();
  Object.keys(config).forEach(async file => {
    if (config[file]) {
      await fs.outputFile(file, await handler(file, config[file]));
    } else {
      await fs.remove(file);
    }
  });
}

module.exports = {
  sync
};
