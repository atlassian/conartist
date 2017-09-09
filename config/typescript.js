const { json } = require('..');
module.exports = {
  'package.json': json(() => ({
    devDependencies: {
      typescript: '~2.5.0'
    }
  })),
  'tsconfig.json': json(() => ({
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
      outDir: 'dist'
    },
    include: ['src/index.ts'],
    exclude: ['node_modules']
  }))
};
