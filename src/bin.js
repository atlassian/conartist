#!/usr/bin/env node

const meow = require("meow");
const { getConfig, process } = require("./sync");

const cli = meow(`
  Usage
    conartist
`);

(async () => {
  await sync(await getConfig());
})();
