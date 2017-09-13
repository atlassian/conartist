import { formatCode, formatJson } from '../src/format';

describe('format', () => {
  it('formatCode', () => {
    expect(
      formatCode('const test = { key1: "test", key2: "test", }')
    ).toMatchSnapshot();
  });
  it('formatJson', () => {
    expect(formatJson('{ "key1": "test", "key2": "test" }')).toMatchSnapshot();
  });
});
