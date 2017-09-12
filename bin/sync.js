const path = require('path');

const { load, sync } = require('../src');

module.exports = () => {
  const config = load('conartist.js');
  if (!config) {
    throw new Error(
      'Please create a conartist.js config file. You can also run "conartist init".'
    );
  }
  Object.keys(config).forEach(sync);
};
