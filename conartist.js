const { config, json, merge, value } = require('.');
const pkg = value(config, 'package.json');

module.exports = merge(config, {
  'config/babel.es.js': null,
  'config/babel.esnext.js': null,
  'config/babel.node.js': null,
  'config/babel.umd.js': null,
  'package.json': json(({ data }) =>
    merge(
      pkg,
      {
        dependencies: merge(
          {
            husky: '0.13.3',
            jest: '20.0.4',
            'lint-staged': '4.0.2',
            lodash: '4.17.4',
            outdent: '0.3.0',
            prettier: '1.6.1',
            yargs: '^8.0.2'
          },
          pkg.dependencies
        ),
        devDependencies: undefined
      },
      data
    )
  ),
  'rollup.config.js': null
});
