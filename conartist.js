const { config, json } = require('.');

module.exports = Object.assign({}, config, {
  'package.json': json(() =>
    Object.assign({}, config['package.json'].data('package.json'), {
      dependencies: {
        husky: '0.13.3',
        jest: '20.0.4',
        'lint-staged': '4.0.2',
        lodash: '4.17.4',
        outdent: '0.3.0',
        prettier: '1.6.1'
      },
      devDependencies: null
    })
  )
});
