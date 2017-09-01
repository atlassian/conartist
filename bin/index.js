#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const args = require("yargs").argv;
const prettier = require("prettier");
const mkdirp = require("mkdirp");
const { $format } = require("..");

const load = (filepath, otherwise) => {
  let path;
  try {
    path = require.resolve(filepath);
  } catch (e) {}
  return (path && require(path)) || otherwise || {};
};
const cwd = process.cwd();
const loadedConfig = load(path.join(cwd, "handyman.js"));

function unlinkConfigFile(file) {
  fs.exists(file, exists => exists && fs.unlink(file));
}

function writeConfigFile(file) {
  const config = loadedConfig[file];
  const format = config[$format];
  if (typeof format !== "function") {
    throw new Error(`Invalid format specified for ${file}.`);
  }
  fs.writeFile(file, format({ file, config }), () => {});
}

function syncConfigFile(file) {
  if (loadedConfig[file]) {
    writeConfigFile(file);
  } else {
    unlinkConfigFile(file);
  }
}

Object.keys(loadedConfig).forEach(syncConfigFile);
