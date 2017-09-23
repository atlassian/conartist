const path = require('path');
const babel = require('./babel');

module.exports = () => ({
  ...babel({
    es: false,
    esnext: false,
    node: false
  }),
  ...{
    'config/babel.umd.js': () => {
      return {
        presets: [['env', { modules: false }], 'flow', 'react', 'stage-0']
      };
    },
    '.gitignore': ['/umd'],
    'package.json': {
      browser: 'umd/index.js',
      devDependencies: {
        rollup: '^0.49.3',
        'rollup-plugin-babel': '^3.0.2',
        'rollup-plugin-uglify': '^2.0.1'
      },
      files: ['umd/'],
      scripts: {
        'build:umd': 'rollup -c && rollup -c --min'
      }
    },
    'rollup.config.js': () => {
      const babel = require('rollup-plugin-babel');
      const babelConfig = require(path.join(process.cwd(), 'config/babel.umd'));
      const uglify = require('rollup-plugin-uglify');
      const yargs = require('yargs');
      const { min } = yargs.argv;
      return {
        input: 'src/index.js',
        output: {
          file: `umd/index${min ? '.min' : ''}.js`,
          format: 'umd'
        },
        plugins: [babel(babelConfig)].concat(min ? uglify() : []),
        sourcemap: true
      };
    }
  }
});
