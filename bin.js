#! /usr/bin/env node

const cosmiconfig = require("cosmiconfig");
const pkg = require("../package.json");
const { bin } = require("./bin");

(async function main() {
  const search = await cosmiconfig("conartist").search();
  await bin({ ...pkg, config: search ? search.config : [] });
})();
