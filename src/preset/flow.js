const outdent = require('outdent');

module.exports = () => ({
  '.flowconfig': outdent`
    [ignore]
    .*/\..*
    .*/docs/.*
    .*/es/.*
    .*/esnext/.*
    .*/node/.*
    .*/node_modules/.*
    .*/umd/.*

    [include]
    ./src/
    ./test/

    [libs]

    [options]
    unsafe.enable_getters_and_setters=true
  `,
  'package.json': {
    devDependencies: {
      'eslint-plugin-flowtype': '^2.34.0',
      'flow-bin': '^0.55.0'
    }
  }
});
