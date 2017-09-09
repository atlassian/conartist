const path = require('path');
const outdent = require('outdent');
const { json, string } = require('..');
module.exports = {
  '.editorconfig': string(
    () => outdent`
      root = true

      [*]
      indent_style = space
      indent_size = 2
      end_of_line = lf
      charset = utf-8
      trim_trailing_whitespace = true
      insert_final_newline = true
    `
  ),
  '.gitignore': string(
    () => outdent`
      /coverage
      /demo/dist
      /es
      /esnext
      /lib
      /node
      /node_modules
      /public
      /ts-output
      /umd
      npm-debug.log*
    `
  ),
  '.nvmrc': string(() => process.version),
  '.travis.yml': string(() => 'language: node_js')
};
