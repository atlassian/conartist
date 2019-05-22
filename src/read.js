const fs = require("fs-extra");

async function readFile(file) {
  const filepath = path.join(process.cwd(), ...file.split("/", path.sep));
  return (await fs.exists(filepath)) ? await fs.readFile(filepath) : null;
}

async function readJson(file) {
  const data = await readFile(file);
  return data === null ? null : JSON.parse(file);
}

module.exports = {
  readFile,
  readJson
};
