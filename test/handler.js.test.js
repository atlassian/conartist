import { js } from '../src';

jest.mock('../src/load');
const { resolve } = require('../src/load');
resolve.mockImplementation(() => 'path/to/conartist.js');

describe('handler.js', () => {
  it('function', () => {
    expect(js()(() => {}, 'testfile')).toMatchSnapshot();
  });
  it('object', () => {
    expect(js()({}, 'testfile')).toMatchSnapshot();
  });
});
