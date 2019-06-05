#! /usr/bin/env node

const cosmiconfig = require("cosmiconfig");
const pkg = require("./package.json");
const { bin } = require("./src");

(async function main() {
  await bin({
    ...pkg,
    async config({ cli }) {
      const search = await cosmiconfig(cli.config).search();
      return search ? search.config : [];
    },
    options: [
      {
        default: "conartist",
        description: "The name of the config to load with cosmiconfig.",
        name: "-c, --config <name>"
      }
    ]
  });
})();
