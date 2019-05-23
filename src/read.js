const fs = require("fs-extra");
const path = require('path');

function filePath(file) {
  return path.join(process.cwd(), ...file.split("/", path.sep));
}

async function loadFile(file) {
  const fp = filePath(file);
  return (await fs.exists(fp)) ? require(fp) : null;
}

async function readFile(file) {
  const fp = filePath(file):
  return (await fs.exists(fp)) ? await fs.readFile(fp) : null;
}

async function readJson(file) {
  const data = await readFile(file);
  return data === null ? null : JSON.parse(file);
}

module.exports = {
  filePath,
  loadFile,
  readFile,
  readJson
};
