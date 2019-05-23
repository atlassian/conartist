const fs = require("fs-extra");
const loMerge = require("lodash/merge");
const loUniq = require("lodash/uniq");
const minimatch = require("minimatch");
const path = require("path");
const { formatCode, formatJson } = require("./format");
const { readFile, readJson } = require("./read");

let currentHandler;

function merge(...args) {
  return loMerge({}, ...args);
}

async function handleArray(file, data) {
  const curr = readFile(file).split("\n");
  data = data.concat(curr);
  data = loUniq(data);
  return data.join("\n");
}

async function handleJs(file, data) {
  const curr = readFile(file);

  if (curr !== null) {
    return curr;
  }

  if (typeof data === "string") {
    return formatCode(data);
  }

  if (typeof data === "object") {
    const curr = loadFile(file);
    return formatCode(`module.exports = ${formatJson(merge(data, curr))};`);
  }
}

async function handleJson(file, data) {
  const curr = await readJson(file);
  data = typeof data === "string" ? JSON.parse(data) : data;
  return formatJson(merge(data, curr));
}

async function handleString(file, data) {
  const curr = await readFile(file);
  return `${curr || data}`;
}

const mapGlob = {
  ".nvmrc": handleString,
  ".*rc": handleJson,
  ".*ignore": handleArray,
  "*.js": handleJs,
  "*.json": handleJson
};

const mapType = {
  object: handleJson
};

function getHandler() {
  return currentHandler;
}

function setHandler(handler) {
  currentHandler = handler;
}

setHandler(async function defaultHandler(file, data) {
  const basename = path.basename(file);
  const extname = path.extname(file);
  const type = typeof data;

  // Glob matching takes precedence. First come, first serve.
  for (const glob in mapGlob) {
    if (minimatch(file, glob)) {
      return await mapGlob[glob](file, data);
    }
  }

  // We fallback to trying to handle based on value type.
  if (type in mapType) {
    return await map[type](file, data);
  }

  // If all else fails, we try and handle it as a string.
  return await handleString(file, data);
});

module.exports = {
  getHandler,
  handleArray,
  handleJs,
  handleJson,
  handleString,
  setHandler
};
