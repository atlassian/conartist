import { config } from '../src/config';

describe('config', () => {
  it('merging', () => {
    const merged = config(
      {
        test1: '1'
      },
      {
        test1: '0'
      },
      {
        test2: '1'
      }
    );
    expect(merged.test1.data).toEqual('0');
    expect(merged.test2.data).toEqual('1');
    expect(Object.keys(merged)).toMatchObject(['test1', 'test2']);
  });
});
