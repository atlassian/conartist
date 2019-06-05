#! /usr/bin/env node

const cosmiconfig = require("cosmiconfig");
const pkg = require("./package.json");
const { bin } = require("./src");

(async function main() {
  const search = await cosmiconfig("conartist").search();
  if (!search && process.argv.indexOf("--help") === -1) {
    console.error('No "conartist" cosmiconfig file found.');
    process.exit(1);
  }
  await bin({
    ...pkg,
    config: search ? search.config : null
  });
})();
