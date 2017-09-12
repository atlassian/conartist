module.exports = () => ({
  '.gitignore': ['/ts'],
  'package.json': {
    devDependencies: {
      typescript: '~2.5.0'
    }
  },
  'tsconfig.json': {
    compilerOptions: {
      module: 'es2015',
      target: 'es2017',
      lib: ['dom', 'es2017'],
      baseUrl: './',
      strict: true,
      sourceMap: true,
      moduleResolution: 'node',
      declaration: true,
      jsx: 'react',
      pretty: true,
      outDir: 'ts'
    },
    include: ['src/index.ts'],
    exclude: ['node_modules']
  }
});
