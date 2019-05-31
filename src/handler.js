const fs = require("fs-extra");
const loMerge = require("lodash/merge");
const loUniq = require("lodash/uniq");
const minimatch = require("minimatch");
const path = require("path");
const { formatCode, formatJson } = require("./format");

let currentHandler;

function merge(...args) {
  return loMerge({}, ...args);
}

async function readIfExists(file) {
  return (await fs.exists(file)) ? await fs.readFile(file) : null;
}

async function requireIfExists(file) {
  return (await fs.exists(file)) ? require(file) : null;
}

async function handleArray({ name, data }) {
  const curr = ((await readIfExists(name)) || "").split("\n");
  data = data.concat(curr);
  data = loUniq(data);
  return data.join("\n");
}

async function handleJs({ data, name }) {
  const curr = await requireIfExists(name);

  if (curr !== null) {
    return curr;
  }

  if (typeof data === "string") {
    return formatCode(data);
  }

  if (typeof data === "object") {
    data = typeof data === "string" ? JSON.parse(data) : data;
    return formatCode(`module.exports = ${formatCode(merge(data, curr))};`);
  }
}

async function handleJson({ data, name }) {
  const curr = await requireIfExists(name);
  data = typeof data === "string" ? JSON.parse(data) : data;
  return formatJson(merge(data, curr));
}

async function handleString({ data, name }) {
  const curr = await fs.readFile(name);
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

setHandler(async function defaultHandler({ data, name }) {
  const basename = path.basename(name);
  const extname = path.extname(name);

  // File-specific handlers (functions) override glob-based handlers.
  if (typeof data === "function") {
    data = data(name);
  } else {
    for (const glob in mapGlob) {
      if (minimatch(name, glob)) {
        data = await mapGlob[glob](name, data);
        break;
      }
    }
  }

  // All types of data returned is then passed through a type handler to
  // ensure that we get a string.
  if (typeof data in mapType) {
    return await mapType[typeof data]({ name, data });
  }

  throw new Error(
    `Unable to handle data of type "${typeof data}" for "${name}".`
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
