#! /usr/bin/env node

const cosmiconfig = require("cosmiconfig");
const pkg = require("../package.json");
const run = require("./run");

(async function main() {
  const search = await cosmiconfig("conartist").search();
  await run({ ...pkg, config: search ? search.config : [] });
})();
