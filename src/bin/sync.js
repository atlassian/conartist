const path = require('path');

const { load } = require('../load');
const { sync } = require('../sync');

module.exports = () => {
  const config = load('conartist.js');
  if (!config) {
    throw new Error(
      'Please create a conartist.js config file. You can also run "conartist init".'
    );
  }
  Object.keys(config).forEach(sync);
};
