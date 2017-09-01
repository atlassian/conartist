#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const args = require("yargs").argv;
const prettier = require("prettier");
const mkdirp = require("mkdirp");

const load = (filepath, otherwise) => {
  let path;
  try {
    path = require.resolve(filepath);
  } catch (e) {}
  return (path && require(path)) || otherwise || {};
};
const cwd = process.cwd();
const oldConfig = load(path.join(__dirname, "handyman.js"));
const newConfig = load(path.join(cwd, "handyman.js"));
const allConfig = Object.assign({}, oldConfig, newConfig);

function unlinkConfigFile(file) {
  fs.exists(file, exists => exists && fs.unlink(file));
}

function writeConfigFile(file, conf) {
  fs.writeFile(file, conf[file](file, conf), () => {});
}

function syncConfigFile(file) {
  if (allConfig[file]) {
    writeConfigFile(file, allConfig);
  } else {
    unlinkConfigFile(file);
  }
}

Object.keys(allConfig).forEach(syncConfigFile);
