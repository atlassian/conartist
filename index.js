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

module.exports = {
  createFormat,
  js,
  json,
  merge,
  string,
  value
};
