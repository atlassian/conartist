#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');

const { argv } = yargs;
const cmd = argv._.join(path.delimiter) || 'sync';

if (fs.existsSync(path.join(__dirname, '..', 'node', 'bin', `${cmd}.js`))) {
  require(`../node/bin/${cmd}`)(argv);
} else {
  throw new Error(`Command not found: ${cmd}`);
}
