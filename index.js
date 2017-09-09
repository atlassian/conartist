const fs = require('fs');
const outdent = require('outdent');
const path = require('path');
const prettier = require('prettier');
const yargs = require('yargs');

const cli = yargs.argv;

function prettierFormat(code, opts) {
  return prettier.format(
    code,
    Object.assign({}, { parser: 'babylon', singleQuote: true }, opts)
  );
}

const js = createFormat(
  class {
    output({ file }) {
      const upPaths = path
        .dirname(file)
        .split('/')
        .map(() => '../')
        .join('');
      return prettierFormat(
        outdent`
          const fs = require('fs');
          const key = '${file}';
          module.exports = require('${upPaths}./conartist.js')[key].data(key);
        `
      );
    }
  }
);

const json = createFormat(
  class {
    input({ file }) {
      return require(path.join(process.cwd(), file));
    }
    output({ data }) {
      return prettierFormat(JSON.stringify(data), {
        parser: 'json'
      });
    }
  }
);

const string = createFormat(
  class {
    input({ file }) {
      return fs.readFileSync(file);
    }
    output({ data }) {
      return `${data}`;
    }
  }
);

function createFormat(Base) {
  class Formatter extends Base {
    constructor(data, options) {
      super(data);
      this._data = data;
      this.options = merge({}, this.defaultOptions, options);
    }
    input(file) {
      return super.input && fs.existsSync(file) ? super.input({ file }) : null;
    }
    data(file) {
      const self = this;
      return this._data({
        get data() {
          return self.input(file);
        },
        file
      });
    }
    output(file) {
      const self = this;
      return super.output({
        get data() {
          return self.data(file);
        },
        file
      });
    }
  }
  return function(data, options) {
    return new Formatter(data, options);
  };
}

function merge(...args) {
  return Object.assign({}, ...args);
}

function value(config, name) {
  return config[name] ? config[name].data(name) : null;
}

const config = {
  'config/babel.es.js': js(() => {
    module.exports = {
      presets: [['env', { es2015: { modules: false } }], 'react', 'stage-0']
    };
  }),
  'config/babel.esnext.js': js(() => {
    module.exports = {
      presets: [['env', { es2015: false }], 'react', 'stage-0']
    };
  }),
  'config/babel.node.js': js(() => {
    module.exports = {
      presets: [
        ['env', { targets: { node: process.version } }],
        'react',
        'stage-0'
      ]
    };
  }),
  'config/babel.umd.js': js(() => {
    module.exports = {
      babelrc: false,
      presets: [
        ['env', { es2015: { modules: false } }],
        'es2015-rollup',
        'react',
        'stage-0'
      ]
    };
  }),
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
  '.flowconfig':
    cli.superset === 'flow' &&
    string(
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
  '.nvmrc': string(() => process.version),
  '.travis.yml': string(() => 'language: node_js'),
  'package.json': json(() => ({
    devDependencies: {
      'babel-cli': '^6.24.1',
      'babel-eslint': '^7.2.3',
      'babel-preset-env': '^1.6.0',
      'babel-preset-es2015-rollup': '^3.0.0',
      'babel-preset-react': '^6.24.1',
      'babel-preset-stage-0': '^6.24.1',
      'eslint-plugin-flowtype': cli.superset === 'flow' ? '^2.34.0' : undefined,
      husky: '^0.13.3',
      jest: '^20.0.4',
      'lint-staged': '^4.0.2',
      rollup: '^0.47.4',
      'rollup-plugin-babel': '^3.0.2',
      'rollup-plugin-uglify': '^2.0.1',
      typescript: cli.superset === 'typescript' ? '~2.5.0' : undefined
    },
    jest: {
      modulePathIgnorePatterns: ['./node_modules']
    },
    'lint-staged': {
      '*.(js|json)': ['prettier --write', 'git add']
    },
    name: path.basename(process.cwd()),
    scripts: {
      'build:es':
        'babel --no-babelrc src --out-dir es --presets=$(pwd)/config/babel.es',
      'build:esnext':
        'babel --no-babelrc src --out-dir esnext --presets=$(pwd)/config/babel.esnext',
      'build:node':
        'babel --no-babelrc src --out-dir node --presets=$(pwd)/config/babel.node',
      'build:umd': 'rollup -c && rollup -c --min',
      prepublish:
        'npm run build:es && npm run build:esnext && npm run build:node && npm run build:umd',
      postinstall: 'conartist'
    }
  })),
  'rollup.config.js': js(() => {
    const babel = require('rollup-plugin-babel');
    const uglify = require('rollup-plugin-uglify');
    return {
      dest: `umd/index${cli.min ? '.min' : ''}.js`,
      entry: 'src/index.js',
      format: 'umd',
      plugins: [babel(require('./config/babel.umd'))].concat(
        cli.min ? uglify() : []
      ),
      sourceMap: true
    };
  }),
  'tsconfig.json':
    cli.superset === 'typescript' &&
    json(() => ({
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
        pretty: true,
        outDir: 'dist'
      },
      include: ['src/index.ts'],
      exclude: ['node_modules']
    }))
};

module.exports = {
  config,
  createFormat,
  js,
  json,
  merge,
  string,
  value
};
