module.exports = () => ({
  'jest-setup.js': `
      import { configure } from 'enzyme';
      import Adapter from 'enzyme-adapter-react-16';
      configure({ adapter: new Adapter() });
    `,
  'package.json': {
    devDependencies: {
      'enzyme-adapter-react-16': '^1.1.1'
    },
    jest: {
      setupFiles: ['./jest-setup']
    }
  }
});
