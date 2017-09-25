const outdent = require('outdent');
const path = require('path');
const username = require('username');

const { load } = require('../load');
const { merge } = require('../merge');

module.exports = opts => {
  const pkg = load('package.json') || {};
  opts = merge(
    {
      name: (pkg.author && pkg.author.name) || username.sync() || 'Your Name',
      node: process.version,
      projectName: pkg.name || 'Project name',
      projectDescription: pkg.description || 'Project description.'
    },
    opts
  );
  return {
    'src/index.js': outdent`
      // This is the main entry point.
    `,
    '.editorconfig': outdent`
      root = true

      [*]
      indent_style = space
      indent_size = 2
      end_of_line = lf
      charset = utf-8
      trim_trailing_whitespace = true
      insert_final_newline = true
    `,
    '.gitignore': ['/node_modules', 'npm-debug.log*'],
    '.nvmrc': opts.node,
    '.travis.yml': 'language: node_js',
    LICENSE: outdent`
      MIT License

      Copyright (c) 2017 ${opts.name}

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
    `,
    'README.md': outdent`
      # ${opts.projectName}

      > ${opts.projectDescription}

      ## Install

      \`\`\`sh
      npm install ${opts.projectName}
      \`\`\`

      ## Usage

      ...
    `
  };
};
