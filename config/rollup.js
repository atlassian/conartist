module.exports = {
  'config/babel.umd.js': () => {
    module.exports = {
      babelrc: false,
      presets: [
        ['env', { es2015: { modules: false } }],
        'es2015-rollup',
        'react',
        'stage-0'
      ]
    };
  },
  'package.json': {
    devDependencies: {
      'babel-preset-es2015-rollup': '^3.0.0',
      rollup: '^0.47.4',
      'rollup-plugin-babel': '^3.0.2',
      'rollup-plugin-uglify': '^2.0.1'
    },
    scripts: {
      'build:umd': 'rollup -c && rollup -c --min'
    }
  },
  'rollup.config.js': () => {
    const babel = require('rollup-plugin-babel');
    const uglify = require('rollup-plugin-uglify');
    const yargs = require('yargs');
    const { min } = yargs.argv;
    return {
      dest: `umd/index${min ? '.min' : ''}.js`,
      entry: 'src/index.js',
      format: 'umd',
      plugins: [babel(require('./config/babel.umd'))].concat(
        min ? uglify() : []
      ),
      sourceMap: true
    };
  }
};
