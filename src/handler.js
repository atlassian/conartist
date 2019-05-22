const fs = require("fs-extra");
const loSort = require("lodash/sortBy");
const loUniq = require("lodash/uniq");
const path = require("path");
const { formatCode, formatJson } = require("./format");
const { readFile, readJson } = require("./read");

let currentHandler;

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
    return formatCode(`module.exports = ${handleJson(data)};`);
  }
}

async function handleJson(file, data) {
  const curr = await readJson(file);
  data = typeof data === "string" ? JSON.parse(data) : data;
  return formatJson(data);
}

async function handleString(file, data) {
  const curr = await readFile(file);
  return `${curr || data}`;
}

const mapBasename = {
  ".babelrc": handleJson,
  ".eslintrc": handleJson,
  ".gitignore": handleArray
};

const mapExtname = {
  js: handleJs,
  json: handleJson
};

const mapType = {
  object: handleJson
};

async function defaultHandler(file, data) {
  const basename = path.basename(file);
  const extname = path.extname(file);
  const type = typeof data;

  // Extensions come first as they should not be different from the type of
  // file that they represent.
  if (extname in mapExtname) {
    return await map[extname](file, data);
  }

  // File name handlers come next so that we can add specific handlers for
  // files with a specific name. Generally this is for files tha tdo not
  // have an extension. These types of files can have different types of
  // content within them and there's no way to tell other than hardcoding.
  if (basename in mapBasename) {
    return await map[basename](file, data);
  }

  // We fallback to trying to handle based on value type.
  if (type in mapType) {
    return await map[type](file, data);
  }

  // If all else fails, we try and handle it as a string.
  return await handleString(file, data);
}

function getHandler() {
  return currentHandler;
}

function setHandler(handler) {
  currentHandler = handler;
}

setHandler(defaultHandler);

module.exports = {
  getHandler,
  handleArray,
  handleJs,
  handleJson,
  handleString,
  setHandler
};
