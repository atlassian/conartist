#!/usr/bin/env node

const meow = require("meow");
const { getConfig, process } = require("./process");

const cli = meow(`
  Usage
    conartist
`);

(async () => {
  await process(await getConfig(), cli.flags);
})();
