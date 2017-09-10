const outdent = require("outdent");
const username = require("username");
module.exports = ({ name, node } = {}) => ({
  ".editorconfig": outdent`
    root = true

    [*]
    indent_style = space
    indent_size = 2
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true
  `,
  ".gitignore": outdent`
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
  `,
  ".nvmrc": node || process.version,
  ".travis.yml": "language: node_js",
  LICENSE: outdent`
    MIT License

    Copyright (c) 2017 ${name || username.sync()}

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
  `
});
