const { merge } = require('lodash');
const fs = require('fs');
const outdent = require('outdent');
const path = require('path');
const prettier = require('prettier');
const util = require('util');

const asyncFileExists = util.promisify(fs.exists);
const asyncReadFile = util.promisify(fs.readFile);

class JsOrJson {
  input(file) {
    return require(`./${file}`);
  }
}

const js = createFormat(
  class extends JsOrJson {
    output(file) {
      return prettier.format(
        outdent`
          const fs = require('fs');
          const key = '${file}';
          module.exports = require('./conartist.js')[key].merge(key);
        `,
        { parser: 'babylon' }
      );
    }
  }
);

const json = createFormat(
  class extends JsOrJson {
    output(file, merge) {
      return prettier.format(JSON.stringify(merge()), {
        parser: 'json'
      });
    }
  }
);

const string = createFormat(
  class {
    input(file) {
      return asyncReadFile(file);
    }
    output(file, merge) {
      return merge();
    }
  }
);

function createFormat(Base) {
  class Formatter extends Base {
    constructor(merge) {
      super(merge);
      this._merge = merge;
    }
    merge(file) {
      return this._merge(file, () => {
        return this.input && fs.existsSync(file) ? this.input(file) : null;
      });
    }
    output(file) {
      return super.output(file, () => this.merge(file));
    }
  }
  return function(merge) {
    return new Formatter(merge);
  };
}

const config = {
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
  '.flowconfig': string(
    () => outdent`
      [ignore]
      .*/\..*
      .*/docs/.*
      .*/es/.*
      .*/es-latest/.*
      .*/lib/.*
      .*/node_modules/.*
      .*/test/.*
      .*/umd/.*

      [include]
      ./src/

      [libs]

      [options]
      unsafe.enable_getters_and_setters=true
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
  '.nvmrc': string(() => '7.9.0'),
  '.travis.yml': string(() => 'language: node_js'),
  'package.json': json((file, input) =>
    merge(
      {
        dependencies: {
          '@skatejs/bore': '4.0.0',
          '@skatejs/ssr': '0.12.2',
          '@skatejs/val': '0.3.1',
          'babel-cli': '6.24.1',
          'babel-eslint': '7.2.3',
          'babel-plugin-modules-map': '1.0.0',
          'babel-plugin-modules-web-compat': '1.1.1',
          'babel-preset-env': '1.6.0',
          'babel-preset-es2015-rollup': '3.0.0',
          'babel-preset-latest': '6.24.1',
          'babel-preset-react': '6.24.1',
          'babel-preset-stage-0': '6.24.1',
          commitizen: '2.9.6',
          'cz-conventional-changelog': '2.0.0',
          'eslint-plugin-flowtype': '2.34.0',
          'get-typed': '1.0.0-beta.1',
          'highlight.js': '9.12.0',
          husky: '0.13.3',
          jest: '20.0.4',
          lodash: '4.17.4',
          'lint-staged': '4.0.2',
          nodemon: '1.11.0',
          outdent: '*',
          preact: '*',
          rollup: '0.47.4',
          'rollup-plugin-babel': '3.0.2',
          'rollup-plugin-uglify': '2.0.1',
          'semantic-release': '6.3.2',
          typescript: '2.3.3',
          'typescript-formatter': '5.2.0',
          'validate-commit-msg': '2.12.1',
          watchman: '0.1.8',
          yargs: '8.0.1'
        },
        jest: {
          modulePathIgnorePatterns: ['./node_modules'],
          setupFiles: ['./test/unit/setup'],
          setupTestFrameworkScriptFile: './test/unit/setup-each',
          testEnvironment: '@skatejs/ssr/jest'
        },
        'lint-staged': {
          '*.(js|json)': ['prettier --write', 'git add']
        },
        scripts: {
          postinstall: 'conartist'
        }
      },
      input()
    )
  ),
  'rollup.config.js': js(() => {
    const babel = require('rollup-plugin-babel');
    const uglify = require('rollup-plugin-uglify');
    const yargs = require('yargs');
    const args = yargs.argv;
    return {
      dest: `umd/index${args.min ? '.min' : ''}.js`,
      entry: 'src/index.js',
      external: ['preact'],
      format: 'umd',
      globals: { preact: 'preact' },
      moduleName: 'skate',
      plugins: [babel(require('./config/babel.umd'))].concat(
        args.min ? uglify() : []
      ),
      sourceMap: true
    };
  }),
  'tsconfig.json': json((file, input) =>
    merge(
      {
        compilerOptions: {
          module: 'es2015',
          target: 'es2017',
          lib: ['dom', 'es2017'],
          baseUrl: './',
          strict: true,
          sourceMap: true,
          moduleResolution: 'node',
          declaration: true,
          jsx: 'react',
          jsxFactory: 'h',
          pretty: true,
          outDir: 'dist'
        },
        include: ['src/index.ts'],
        exclude: ['node_modules']
      },
      input()
    )
  )
};

module.exports = {
  config,
  createFormat,
  js,
  json,
  string
};
