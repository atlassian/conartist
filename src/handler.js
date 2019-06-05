const fs = require("fs-extra");
const isFunction = require("lodash/isFunction");
const loMerge = require("lodash/merge");
const loUniq = require("lodash/uniq");
const minimatch = require("minimatch");
const path = require("path");
const stripIndent = require("strip-indent");
const { formatCode, formatJson, formatMd } = require("./format");

let currentHandler;

function merge(...args) {
  return loMerge({}, ...args);
}

async function readIfExists(file) {
  return (await fs.exists(file)) ? (await fs.readFile(file)).toString() : null;
}

async function requireIfExists(file) {
  return (await fs.exists(file)) ? require(file) : null;
}

async function handleArray(file) {
  let data;
  const curr = ((await readIfExists(file.name)) || "").split("\n");
  data = file.data.concat(curr);
  data = loUniq(data);
  return data.filter(Boolean).join("\n");
}

async function handleJs(file) {
  const curr = (await readIfExists(file.name)) || file.data;
  const data = file.overwrite ? file.data : curr;
  return formatCode(data);
}

async function handleJson(file) {
  const curr = (await requireIfExists(file.name)) || file.data;
  const data = file.overwrite
    ? file.data
    : file.merge
    ? merge(curr, file.data)
    : curr;
  return JSON.stringify(data, null, 2);
}

async function handleMd(file) {
  return formatMd(await handleString(file));
}

async function handleString(file) {
  const curr = (await readIfExists(file.name)) || file.data;
  const data = file.overwrite ? file.data : curr;
  return stripIndent(data).trim();
}

const mapExtname = {
  js: handleJs,
  jsx: handleJs,
  json: handleJson,
  md: handleMd
};

const mapType = {
  object: handleJson
};

function getType(file) {
  let type;

  if (isFunction(file.data)) {
    return file.data;
  }

  if (isFunction(file.type)) {
    return file.type;
  }

  type =
    file.type ||
    path
      .extname(file.name)
      .substring(1)
      .toLowerCase();
  if (type in mapExtname) {
    return mapExtname[type];
  }

  type = typeof file.data;
  if (type in mapType) {
    return mapType[type];
  }

  return handleString;
}

async function handler(file) {
  return await getType(file)(file);
}

module.exports = {
  handler
};
