#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const { argv } = yargs;
const cmd = path.join(...argv._);

if (fs.existsSync(path.join(__dirname, `${cmd}.js`))) {
  require(`./${cmd}`)(argv);
} else {
  throw new Error(`Command not found: ${cmd}`);
}
