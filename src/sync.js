const fs = require("fs-extra");
const { getConfig } = require("./config");
const { getHandlerLocator } = require("./handler-locator");

async function sync(opts) {
  const config = await getConfig(opts);
  const handlerLocator = getHandlerLocator();
  Object.keys(config).forEach(async file => {
    if (config[file]) {
      const handler = handlerLocator(file, config[file]);
      await fs.outputFile(file, handler(file, config[file]));
    } else {
      await fs.remove(file);
    }
  });
}

module.exports = {
  sync
};
