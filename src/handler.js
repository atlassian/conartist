const { formatCode, formatJson } = require("./format");

function js(file, data) {
  if (typeof data === "string") {
    return formatCode(data);
  }

  if (typeof data === "object" || Array.isArray(data)) {
    return formatCode(`module.exports = ${json(file, data)};`);
  }
}

function json(file, data) {
  return formatJson(data);
}

function string(file, data) {
  return data;
}

module.exports = {
  js,
  json,
  string
};
