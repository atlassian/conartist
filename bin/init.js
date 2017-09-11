const fs = require('fs');
const outdent = require('outdent');

module.exports = () => {
  if (!fs.existsSync('conartist.js')) {
    fs.writeFileSync(
      'conartist.js',
      outdent`
        const { config } = require('conartist');
        const { base } = require('conartist/preset');

        module.exports = config(base());
      `
    );
  }
};
