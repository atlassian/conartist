#!/usr/bin/env node

const meow = require("meow");
const { sync } = require("../sync");

const cli = meow(`
  Usage
    conartist
    conartist -c config-name
    conartist --config config-name
`);

(async () => {
  await sync();
})();
