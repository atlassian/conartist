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
  const curr = JSON.parse(await readIfExists(file.name));
  let data;

  if (curr) {
    if (file.overwrite) {
      data = file.merge ? merge(curr, file.data) : file.data;
    } else if (file.merge) {
      data = merge(file.data, curr);
    } else {
      data = curr;
    }
  } else {
    data = file.data;
  }

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
  md: handleMd,
  mdx: handleMd
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
