const path = require('path');

const { merge } = require('../merge');
const babel = require('./babel');

module.exports = () =>
  merge(
    babel({
      es: false,
      esnext: false,
      node: false
    }),
    {
      '.gitignore': ['/umd'],
      'package.json': {
        babel: {
          rollup: {
            presets: [['env', { modules: false }], 'flow', 'react', 'stage-0']
          }
        },
        browser: 'umd/index.js',
        devDependencies: {
          rollup: '^0.49.3',
          'rollup-plugin-babel': '^3.0.2',
          'rollup-plugin-uglify': '^2.0.1'
        },
        files: ['umd/'],
        scripts: {
          'build:umd': 'BABEL_ENV=umd rollup -c && rollup -c --min'
        }
      },
      'rollup.config.js': () => {
        const babel = require('rollup-plugin-babel');
        const uglify = require('rollup-plugin-uglify');
        const yargs = require('yargs');
        const { min } = yargs.argv;
        return {
          input: 'src/index.js',
          output: {
            file: `umd/index${min ? '.min' : ''}.js`,
            format: 'umd'
          },
          plugins: [babel()].concat(min ? uglify() : []),
          sourcemap: true
        };
      }
    }
  );
