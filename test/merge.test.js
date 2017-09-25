import { merge } from '../src';

describe('merge', () => {
  it('top-level array', () => {
    const merge1 = merge(['one'], ['two'], ['three']);
    const merge2 = merge(merge1, merge2);
    expect(merge1).toMatchObject(['three']);
    expect(merge2).toMatchObject(['three']);
  });
  it('top-level object', () => {
    const call1 = merge({ arr: ['one'] }, { arr: ['two'] }, { arr: ['three'] });
    const call2 = merge(call1, Object.assign({}, call1));
    const match = { arr: ['one', 'two', 'three'] };
    expect(call1).toMatchObject(match);
    expect(call2).toMatchObject(match);
  });
});
