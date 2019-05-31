#! /usr/bin/env node

const { getConfig } = require("./config");

require("./run").run({
  ...require("../package.json"),
  config: async ({ cli, cwd }) => {
    return cli.c ? require(path.join(cwd, cli.c)) : await getConfig();
  },
  options: [
    {
      description: "The configuration file to load for this run.",
      name: "-c, --config <file>"
    }
  ]
});
