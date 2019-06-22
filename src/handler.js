const fs = require("fs-extra");
const isFunction = require("lodash/isFunction");
const mergeWith = require("lodash/mergeWith");
const path = require("path");
const prettier = require("prettier");
const stripIndent = require("strip-indent");
const uniq = require("lodash/uniq");

// Recursively maps over values and allows async functions to be used to
// return new values. If a previousObj is provided, it uses it to retrieve
// a value that corresponds to the same place in oldObj so you can use it
// to return the new value.
async function mapValues(oldObj, previousObj) {
  previousObj = previousObj || {};
  const newObj = Array.isArray(oldObj) ? [] : {};
  for (const key in oldObj) {
    newObj[key] = isFunction(oldObj[key])
      ? await oldObj[key](key, previousObj[key], previousObj)
      : oldObj[key];
    if (typeof newObj[key] === "object") {
      newObj[key] = await mapValues(newObj[key], previousObj[key]);
    }
  }
  return newObj;
}

// Allows for custom merging.
function merge(...src) {
  return mergeWith({}, ...src, (objval, srcval, key, obj) => {
    // Remove item if explicitly set to undefined.
    if (typeof srcval === "undefined") {
      delete obj[key];
    }
  });
}

async function getPrettierConfig(file) {
  return await prettier.resolveConfig(file);
}

async function formatCode(file, data) {
  return prettier.format(data, {
    parser: "babel",
    ...(await getPrettierConfig(file))
  });
}

async function formatMd(file, data) {
  return prettier.format(data, {
    parser: "markdown",
    ...(await getPrettierConfig(file))
  });
}

async function readIfExists(file) {
  return (await fs.exists(file)) ? (await fs.readFile(file)).toString() : null;
}

async function handleJs(file) {
  const currData = await readIfExists(file.name);
  if (file.overwrite || !currData) {
    return await formatCode(file.name, file.data);
  }
  return currData;
}

async function handleJson(file) {
  const currData = await readIfExists(file.name);
  const currJson = JSON.parse(currData);
  let data;

  if (currData) {
    if (file.overwrite) {
      if (file.merge) {
        data = merge({}, currJson, file.data);
      } else {
        data = file.data;
      }
    } else if (file.merge) {
      data = merge({}, file.data, currJson);
    } else {
      return currData;
    }
  } else {
    data = file.data;
  }

  data = await mapValues(data, currJson);

  return JSON.stringify(data, null, 2);
}

async function handleMd(file) {
  const currData = await readIfExists(file.name);
  if (file.overwrite || !currData) {
    return await formatMd(file.name, file.data);
  }
  return currData;
}

async function handleString(file) {
  const currData = await readIfExists(file.name);
  if (file.overwrite || !currData) {
    return stripIndent(file.data).trim();
  }
  return currData;
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

async function getData(file) {
  return isFunction(file.data) ? await file.data(file) : file.data;
}

function getType(file) {
  let type;

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
  file.data = await getData(file);
  file.type = await getType(file);
  return file.type(file);
}

module.exports = {
  handler
};
