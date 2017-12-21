const outdent = require('outdent');

module.exports = () => ({
  '.flowconfig': outdent`
    [ignore]

    [include]

    [libs]

    [lints]

    [options]
    unsafe.enable_getters_and_setters=true

    [strict]
  `,
  'package.json': {
    devDependencies: {
      'eslint-plugin-flowtype': '^2.40.1',
      'flow-bin': '^0.61.0'
    }
  }
});
