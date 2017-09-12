const outdent = require('outdent');
module.exports = () => ({
  '.flowconfig': outdent`
    [ignore]
    .*/\..*
    .*/docs/.*
    .*/es/.*
    .*/es-latest/.*
    .*/lib/.*
    .*/node_modules/.*
    .*/test/.*
    .*/umd/.*

    [include]
    ./src/

    [libs]

    [options]
    unsafe.enable_getters_and_setters=true
  `,
  'package.json': {
    devDependencies: {
      'eslint-plugin-flowtype': '^2.34.0'
    }
  }
});
