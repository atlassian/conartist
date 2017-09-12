const fs = require('fs');
const outdent = require('outdent');
const path = require('path');
const prettier = require('prettier');
const mkdirp = require('mkdirp');

const { load } = require('./load');

function unlinkConfigFile(file) {
  fs.exists(file, exists => exists && fs.unlink(file, () => {}));
}

async function writeConfigFile(file, config) {
  const dirname = path.dirname(file);
  if (dirname) {
    mkdirp(dirname);
  }
  fs.writeFile(file, await config.process(), () => {});
}

function sync(file) {
  const config = load('conartist.js') || {};

  if (config[file]) {
    writeConfigFile(file, config[file]);
  } else {
    unlinkConfigFile(file);
  }
}

module.exports = {
  sync
};
