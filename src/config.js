const cosmiconfig = require("cosmiconfig");
const indent = require("indent-string");
const isArray = require("lodash/isArray");
const isFunction = require("lodash/isFunction");
const isPlainObject = require("lodash/isPlainObject");
const isString = require("lodash/isString");
const outdent = require("outdent");

let currentConfig;
let parentConfig;

function debug(json) {
  return indent(
    `${JSON.stringify(
      json,
      (key, val) => (isFunction(val) ? val.toString() : val),
      2
    )}`,
    2
  );
}

function normalizeConfig(conf, opts) {
  currentConfig = parentConfig = conf;

  if (isFunction(conf)) {
    conf = conf(opts);
  }

  if (isPlainObject(conf)) {
    conf = Object.keys(conf).reduce((prev, curr) => {
      return prev.concat({ data: conf[curr], name: curr });
    }, []);
  }

  if (isArray(conf)) {
    return conf.map(item => normalizeItem(item));
  }

  throw new Error(outdent`
    Expected an array or function that returns an array.
    
    Instead we got:
    ${debug(currentConfig)}
  `);
}

function normalizeItem(item, opts) {
  if (isArray(item)) {
    parentConfig = item;
    return normalizeItem(item[0], item[1]);
  } else if (isFunction(item)) {
    parentConfig = item;
    return normalizeItem(item(opts), opts);
  } else if (isPlainObject(item)) {
    return item;
  } else if (isString(item)) {
    parentConfig = item;
    return normalizeItem(require(item), opts);
  }

  throw new Error(outdent`
    Invalid item:
    ${debug(item)}

    Returned from:
    ${debug(parentConfig)}

    In configuration:
    ${debug(currentConfig)}
  `);
}

async function getConfig() {
  const search = await cosmiconfig("conartist").search();
  return search ? search.config : {};
}

module.exports = {
  getConfig,
  normalizeConfig
};
