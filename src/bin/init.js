const fs = require('fs');
const outdent = require('outdent');

module.exports = () => {
  if (fs.existsSync('conartist.js')) {
    throw new Error('You already have a conartist.js file.');
  } else {
    fs.writeFileSync(
      'conartist.js',
      outdent`
        const { config, preset } = require('conartist');

        module.exports = config(preset.base());
      `
    );
  }
};
