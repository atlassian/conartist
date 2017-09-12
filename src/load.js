const fs = require('fs');
const path = require('path');

function load(filepath) {
  const resolved = resolve(filepath);
  return resolved && require(resolved);
}

function raw(filepath) {
  const resolved = resolve(filepath);
  return resolved && fs.readFileSync(resolved).toString();
}

function resolve(filepath) {
  try {
    return require.resolve(path.join(process.cwd(), filepath));
  } catch (e) {}
}

module.exports = {
  load,
  raw,
  resolve
};
