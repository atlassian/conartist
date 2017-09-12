const path = require('path');

const { load, sync } = require('../src');

module.exports = () => {
  Object.keys(load('conartist.js')).forEach(sync);
};
