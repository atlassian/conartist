const { config } = require('./src');
const { base, jest } = require('./preset');

module.exports = config(base(), jest());
