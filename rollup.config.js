const fs = require('fs');
const key = 'rollup.config.js';
module.exports = require('./conartist.js')[key].data(key);
