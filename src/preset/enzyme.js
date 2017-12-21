import { merge } from '../merge';
import outdent from 'outdent';

module.exports = opts => {
  const { reactVersion } = merge({ reactVersion: 16 }, opts);
  return {
    'jest/setup-enzyme.js': outdent`
      const { configure } = require('enzyme');
      const Adapter = require('enzyme-adapter-react-${reactVersion}');
      configure({ adapter: new Adapter() });
    `,
    'package.json': {
      devDependencies: {
        enzyme: '^3.2.0',
        [`enzyme-adapter-react-${reactVersion}`]: '^1.1.1'
      },
      jest: {
        setupFiles: ['./jest/setup-enzyme']
      }
    }
  };
};
