const path = require('path');

module.exports = () => ({
  'config/babel.umd.js': () => {
    return {
      babelrc: false,
      presets: [['env', { modules: false }], 'flow', 'react', 'stage-0']
    };
  },
  '.gitignore': ['/umd'],
  'package.json': {
    browser: 'umd/index.js',
    devDependencies: {
      'babel-cli': '^6.24.1',
      'babel-preset-env': '^1.6.0',
      'babel-preset-es2015-rollup': '^3.0.0',
      'babel-preset-es2016': '^6.24.1',
      'babel-preset-es2017': '^6.24.1',
      'babel-preset-flow': '^6.23.0',
      'babel-preset-react': '^6.24.1',
      'babel-preset-stage-0': '^6.24.1'
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
});
