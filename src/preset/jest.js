module.exports = () => ({
  'package.json': {
    babel: {
      presets: ['env', 'flow', 'react', 'stage-0']
    },
    devDependencies: {
      jest: '^20.0.4'
    },
    jest: {
      modulePathIgnorePatterns: ['./node_modules']
    },
    scripts: {
      test: 'jest'
    }
  }
});
