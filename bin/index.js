#! /usr/bin/env node

const cosmiconfig = require("cosmiconfig");
const pkg = require("../package.json");
const { bin } = require("../src");

(async function main() {
  const configs = {
    default: async () => {
      const search = await cosmiconfig("conartist").search();
      if (!search) {
        console.warn(
          "No conartist configuration file found. For more information see https://github.com/treshugart/conartist#install for ways you can configure conartist."
        );
        process.exit();
      }
      return search.config;
    },
    init: {
      files: {
        "conartist.config.js": "module.exports = { files: [] }"
      }
    }
  };

  await bin({
    ...pkg,
    commands: {
      init: "Creates a basic configuration file."
    },
    conartist: ({ cmd }) => configs[cmd]
  });
})();
