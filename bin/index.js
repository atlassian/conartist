#! /usr/bin/env node

const cosmiconfig = require("cosmiconfig");
const pkg = require("../package.json");
const { bin } = require("../src");

(async function main() {
  const search = await cosmiconfig("conartist").search();
  if (!search && process.argv.indexOf("--help") === -1) {
    console.error(
      "No conartist configuration file found. For more information see https://github.com/treshugart/conartist#install for ways you can configure conartist."
    );
    process.exit(1);
  }
  await bin({
    ...pkg,
    config: search ? search.config : null
  });
})();
