const { config, preset } = require('./src');

module.exports = config(
  preset.babel({
    es: false,
    esnext: false
  }),
  preset.base()
);
