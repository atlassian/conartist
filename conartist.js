const { config } = require('./src');
const { babel, base } = require('./src/preset');

module.exports = config(
  babel({
    es: false,
    esnext: false
  }),
  base()
);
