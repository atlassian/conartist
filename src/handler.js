const { merge } = require('lodash');
const { prettierFormat } = require('./util');
const fs = require('fs');
const outdent = require('outdent');
const path = require('path');

function js(data, file) {
  const upPaths = path
    .dirname(file)
    .split('/')
    .map(() => '../')
    .join('');
  return prettierFormat(
    outdent`
      module.exports = require('${upPaths}./conartist.js')['${file}'].data();
    `
  );
}

function json(data, file) {
  const filepath = path.join(process.cwd(), file);
  if (fs.existsSync(filepath)) {
    data = merge(data, require(filepath));
  }
  return prettierFormat(JSON.stringify(data), {
    parser: 'json'
  });
}

function string(data, file) {
  const filepath = path.join(process.cwd(), file);
  return `${fs.existsSync(filepath) ? fs.readFileSync(filepath) : data}`;
}

module.exports = {
  js,
  json,
  string
};
