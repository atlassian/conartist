module.exports = () => ({
  'config/babel.es.js': () => {
    return {
      presets: [['env', { es2015: { modules: false } }], 'react', 'stage-0']
    };
  },
  'config/babel.esnext.js': () => {
    return {
      presets: [['env', { es2015: false }], 'react', 'stage-0']
    };
  },
  'config/babel.node.js': () => {
    return {
      presets: [
        ['env', { targets: { node: process.version } }],
        'react',
        'stage-0'
      ]
    };
  },
  'package.json': {
    devDependencies: {
      'babel-cli': '^6.24.1',
      'babel-eslint': '^7.2.3',
      'babel-preset-env': '^1.6.0',
      'babel-preset-react': '^6.24.1',
      'babel-preset-stage-0': '^6.24.1'
    },
    scripts: {
      'build:es':
        'babel --no-babelrc src --out-dir es --presets=$(pwd)/config/babel.es',
      'build:esnext':
        'babel --no-babelrc src --out-dir esnext --presets=$(pwd)/config/babel.esnext',
      'build:node':
        'babel --no-babelrc src --out-dir node --presets=$(pwd)/config/babel.node'
    }
  }
});
