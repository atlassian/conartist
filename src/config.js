const cosmiconfig = require("cosmiconfig");

async function getConfig() {
  const search = await cosmiconfig("conartist").search();
  return search ? search.config : {};
}

module.exports = {
  getConfig
};
