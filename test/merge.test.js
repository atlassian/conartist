import { merge } from '../src';

describe('merge', () => {
  it('top-level array', () => {
    expect(merge(['one'], ['two'], ['three'])).toMatchObject(['three']);
  });
  it('top-level object', () => {
    expect(
      merge({ arr: ['one'] }, { arr: ['two'] }, { arr: ['three'] })
    ).toMatchObject({
      arr: ['one', 'two', 'three']
    });
  });
});
