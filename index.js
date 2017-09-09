const { merge } = require("lodash");
const fs = require("fs");
const outdent = require("outdent");
const path = require("path");
const prettier = require("prettier");

function prettierFormat(code, opts) {
  return prettier.format(
    code,
    Object.assign({}, { parser: "babylon", singleQuote: true }, opts)
  );
}

function js(data, file) {
  const upPaths = path
    .dirname(file)
    .split("/")
    .map(() => "../")
    .join("");
  return prettierFormat(
    outdent`
      module.exports = require('${upPaths}./conartist.js')['${file}'].data();
    `
  );
}

function json(data, file) {
  const filepath = path.join(process.cwd(), file);
  if (fs.existsSync(filepath)) {
    data = merge(data, require(filepath));
  }
  return prettierFormat(JSON.stringify(data), {
    parser: "json"
  });
}

function string(data, file) {
  const filepath = path.join(process.cwd(), file);
  return `${fs.existsSync(filepath) ? fs.readFileSync(filepath) : data}`;
}

class Format {
  constructor(file, data, func) {
    this.data = data;
    this.file = file;
    this.func = func;
  }
  process() {
    return this.func(this.data, this.file);
  }
}

function defaultHandler(key, val) {
  const type = typeof val;
  if (type === 'function') return js;
  if (type === 'object') return json;
  if (type === 'string') return string;

  const extname = path.extname(key);
  if (extname === '.js') return js;
  if (extname === '.json') return json;

  const basename = path.basename(key);
  if (basename === '.babelrc') return json;
  if (basename === '.eslintrc') return json;

  return string;
}

function config(...args) {
  const obj = merge(...args);
  Object.keys(obj).forEach(key => {
    obj[key] = new Format(key, obj[key], locateHandler(key, obj));
  });
  return obj;
}

const handlers = [ defaultHandlerLocator ];

function locateHandler(key, obj) {
  let handler;
  handlers.some(locate => (handler = locate(key, obj[key], obj)));
  return handler || throw new Error(`Could not find a handler for "${key}".`);
}

module.exports = {
  config,
  handlers,
  js,
  json,
  string
};
