import { getHandlerLocator, setHandlerLocator } from '../src/handler-locator';
import { array, js, json, string } from '../src/handler';

describe('handler-locator', () => {
  it('getHandlerLocator', () => {
    expect(typeof getHandlerLocator()).toBe('function');
  });

  it('setHandlerLocator', () => {
    const oldHandlerLocator = getHandlerLocator();
    const newHandlerLocator = () => {};

    setHandlerLocator(newHandlerLocator);
    expect(getHandlerLocator()).toBe(newHandlerLocator);

    setHandlerLocator(oldHandlerLocator);
    expect(getHandlerLocator()).toBe(oldHandlerLocator);
  });

  it('default', () => {
    const defaultHandlerLocator = getHandlerLocator();

    // Known types.
    expect(defaultHandlerLocator('.babelrc').name).toBe('json');
    expect(defaultHandlerLocator('.eslintrc').name).toBe('json');
    expect(defaultHandlerLocator('rollup.config.js').name).toBe('js');
    expect(defaultHandlerLocator('', []).name).toBe('array');
    expect(defaultHandlerLocator('', () => {}).name).toBe('js');
    expect(defaultHandlerLocator('', {}).name).toBe('json');
    expect(defaultHandlerLocator('', '').name).toBe('string');

    // Unknown types.
    expect(defaultHandlerLocator('', 0)).toBe(undefined);
    expect(defaultHandlerLocator('', 1)).toBe(undefined);
    expect(defaultHandlerLocator('', false)).toBe(undefined);
    expect(defaultHandlerLocator('', true)).toBe(undefined);
  });
});
