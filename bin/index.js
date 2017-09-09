#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const args = require('yargs').argv;
const prettier = require('prettier');
const mkdirp = require('mkdirp');

const load = (filepath, otherwise) => {
  let path;
  try {
    path = require.resolve(filepath);
  } catch (e) {}
  return (path && require(path)) || otherwise || {};
};
const cwd = process.cwd();
const loadedConfig = load(path.join(cwd, 'conartist.js'));

function unlinkConfigFile(file) {
  fs.exists(file, exists => exists && fs.unlink(file, () => {}));
}

function writeConfigFile(file) {
  const dirname = path.dirname(file);
  if (dirname) {
    mkdirp(dirname);
  }
  fs.writeFile(file, loadedConfig[file].process(), () => {});
}

function syncConfigFile(file) {
  if (loadedConfig[file]) {
    writeConfigFile(file);
  } else {
    unlinkConfigFile(file);
  }
}

Object.keys(loadedConfig).forEach(syncConfigFile);
