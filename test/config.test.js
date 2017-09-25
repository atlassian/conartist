import { config } from '../src';

describe('config', () => {
  it('merging', () => {
    const merged = config(
      {
        test1: '1',
        testArr: ['one']
      },
      {
        test1: '0',
        testArr: ['two']
      },
      {
        test2: '1',
        testArr: ['three']
      }
    );
    expect(merged.test1.data).toEqual('0');
    expect(merged.test2.data).toEqual('1');
    expect(Object.keys(merged)).toMatchObject(['test1', 'testArr', 'test2']);
    expect(merged.testArr.data).toMatchObject(['one', 'two', 'three']);
  });
});
