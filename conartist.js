const { json, merge, value } = require('.');
const base = require('./config/base');

module.exports = merge(base, {
  'package.json': json(({ data }) =>
    merge(data, {
      dependencies: merge(data.dependencies, {
        outdent: '0.3.0',
        prettier: '1.6.1',
        yargs: '^8.0.2'
      })
    })
  )
});
