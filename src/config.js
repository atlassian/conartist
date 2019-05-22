const cosmiconfig = require("cosmiconfig");

async function getConfig(opts) {
  const search = await cosmiconfig("conartist").search();
  const config = search ? search.config : {};
  return typeof config === "function" ? config(opts) : config;
}

module.exports = {
  getConfig
};
