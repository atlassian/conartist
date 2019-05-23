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
    data = typeof data === "string" ? JSON.parse(data) : data;
    return formatCode(`module.exports = ${formatCode(merge(data, curr))};`);
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
  object: handleJson,
  string: handleString
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

  // File-specific handlers (functions) override glob-based handlers.
  if (typeof data === "function") {
    data = data(file);
  } else {
    for (const glob in mapGlob) {
      if (minimatch(file, glob)) {
        data = await mapGlob[glob](file, data);
        break;
      }
    }
  }

  // All types of data returned is then passed through a type handler to
  // ensure that we get a string.
  if (typeof data in mapType) {
    return await map[typeof data](file, data);
  }

  throw new Error(
    `Unable to handle data of type "${typeof data}" for "${file}".`
  );
});

module.exports = {
  getHandler,
  handleArray,
  handleJs,
  handleJson,
  handleString,
  setHandler
};
