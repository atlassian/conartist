import * as index from '../src';

[
  'array',
  'getHandlerLocator',
  'setHandlerLocator',
  'config',
  'formatCode',
  'formatJson',
  'js',
  'json',
  'load',
  'preset:object',
  'raw',
  'resolve',
  'string',
  'sync'
].forEach(key => {
  const [name, type = 'function'] = key.split(':');
  test(`API -> ${name}:${type}`, () => {
    expect(typeof index[name]).toBe(type);
  });
});
