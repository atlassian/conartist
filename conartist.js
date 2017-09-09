const { json, merge, value } = require('.');
const base = require('./config/base');

module.exports = merge(base, {
  'package.json': json(({ data }) =>
    merge(data, {
      dependencies: merge(data.dependencies, {
        husky: '0.13.3',
        jest: '20.0.4',
        'lint-staged': '4.0.2',
        lodash: '4.17.4',
        outdent: '0.3.0',
        prettier: '1.6.1',
        yargs: '^8.0.2'
      })
    })
  )
});
