const path = require('path');

const { load } = require('../src/util');
const { sync } = require('../src');

module.exports = () => {
  Object.keys(load(path.join(process.cwd(), 'conartist.js'))).forEach(sync);
};
