const { config } = require('.');
const { base, jest } = require('./config');

module.exports = config(base, jest);
