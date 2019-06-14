const fs = require("fs-extra");
const isFunction = require("lodash/isFunction");
const merge = require("lodash/merge");
const path = require("path");
const prettier = require("prettier");
const stripIndent = require("strip-indent");
const uniq = require("lodash/uniq");

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
