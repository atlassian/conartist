const { config, json, value } = require('.');

module.exports = Object.assign({}, config, {
  'config/babel.es.js': null,
  'config/babel.esnext.js': null,
  'config/babel.node.js': null,
  'config/babel.umd.js': null,
  'package.json': json(name =>
    Object.assign({}, value(config, name), {
      dependencies: {
        husky: '0.13.3',
        jest: '20.0.4',
        'lint-staged': '4.0.2',
        lodash: '4.17.4',
        outdent: '0.3.0',
        prettier: '1.6.1'
      },
      devDependencies: undefined
    })
  ),
  'rollup.config.js': null
});
