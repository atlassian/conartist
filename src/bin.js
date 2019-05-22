#!/usr/bin/env node

const meow = require("meow");
const { sync } = require("./sync");

const cli = meow(`
  Usage
    conartist <options>
`);

(async () => {
  await sync(cli.flags);
})();
