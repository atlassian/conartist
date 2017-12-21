const { merge } = require('../merge');

module.exports = opts => {
  opts = merge(
    {
      es: true,
      esnext: true,
      node: '6.0.0'
    },
    opts
  );
  return {
    '.babelrc': {
      env: {
        es: opts.es
          ? {
              presets: [['env', { modules: false }], 'flow', 'react', 'stage-0']
            }
          : undefined,
        esnext: opts.esnext
          ? {
              presets: ['es2016', 'es2017', 'flow', 'react', 'stage-0']
            }
          : undefined,
        node: opts.node
          ? {
              presets: [
                ['env', { targets: { node: opts.node } }],
                'flow',
                'react',
                'stage-0'
              ]
            }
          : undefined
      }
    },
    '.gitignore': [
      opts.es && '/es',
      opts.esnext && '/esnext',
      opts.node && '/node'
    ].filter(Boolean),
    'package.json': {
      devDependencies: {
        'babel-cli': '^6.24.1',
        'babel-preset-env': '^1.6.0',
        'babel-preset-es2016': '^6.24.1',
        'babel-preset-es2017': '^6.24.1',
        'babel-preset-flow': '^6.23.0',
        'babel-preset-react': '^6.24.1',
        'babel-preset-stage-0': '^6.24.1'
      },
      files: [
        opts.es && 'es/',
        opts.esnext && 'esnext/',
        opts.node && 'node/'
      ].filter(Boolean),
      main: opts.node ? 'node/index.js' : 'src/index.js',
      module: opts.es ? 'es/index.js' : undefined,
      esnext: opts.esnext ? 'esnext/index.js' : undefined,
      scripts: {
        'build:es': opts.es ? 'BABEL_ENV=es babel src --out-dir es' : undefined,
        'build:esnext': opts.esnext
          ? 'BABEL_ENV=esnext babel src --out-dir esnext'
          : undefined,
        'build:node': opts.node
          ? 'BABEL_ENV=node babel src --out-dir node'
          : undefined
      }
    }
  };
};
