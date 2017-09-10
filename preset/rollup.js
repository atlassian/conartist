const path = require('path');
module.exports = () => ({
  'config/babel.umd.js': () => {
    return {
      babelrc: false,
      presets: [['env', { modules: false }], 'react', 'stage-0']
    };
  },
  'package.json': {
    devDependencies: {
      'babel-preset-es2015-rollup': '^3.0.0',
      rollup: '^0.49.3',
      'rollup-plugin-babel': '^3.0.2',
      'rollup-plugin-uglify': '^2.0.1'
    },
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
