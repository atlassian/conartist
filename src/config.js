const cosmiconfig = require("cosmiconfig");

async function getConfig() {
  const config = await cosmiconfig("conartist").search();
  return config ? config.config : {};
}

module.exports = {
  getConfig
};
