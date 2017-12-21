module.exports = () => ({
  'package.json': {
    devDependencies: {
      'babel-jest': '^22.0.3',
      jest: '^22.0.3'
    },
    jest: {
      modulePathIgnorePatterns: ['./node_modules']
    },
    scripts: {
      test: 'jest'
    }
  }
});
