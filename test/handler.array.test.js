import outdent from 'outdent';

import { array } from '../src';

jest.mock('../src/load');
const { raw } = require('../src/load');
raw.mockImplementation(() => 'two\nfour');

describe('handler.array', () => {
  it('merging', () => {
    expect(array()(['one', 'two', 'three'], 'testfile')).toBe(
      'one\ntwo\nthree\nfour'
    );
  });
});
