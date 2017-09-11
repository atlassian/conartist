const prettier = require('prettier');

function load(filepath, otherwise) {
  let path;
  try {
    path = require.resolve(filepath);
  } catch (e) {}
  return (path && require(path)) || otherwise || {};
}

function prettierFormat(code, opts) {
  return prettier.format(
    code,
    Object.assign({}, { parser: 'babylon', singleQuote: true }, opts)
  );
}

module.exports = {
  load,
  prettierFormat
};
