const { normalizeConfig } = require("..");

const item = { data: "", name: "item" };

test("{ name: data }", () => {
  expect(normalizeConfig({ [item.name]: item.data })).toEqual([item]);
});

test("[array]", () => {
  expect(normalizeConfig([[item]])).toEqual([item]);
});

test("[function]", () => {
  expect(normalizeConfig([[opts => opts, item]])).toEqual([item]);
});

test("[object]", () => {
  expect(normalizeConfig([item])).toEqual([item]);
});

test("[string]", () => {
  expect(normalizeConfig([".."])).toEqual([require("..")]);
});

test("[throws]", () => {
  expect(() => normalizeConfig([null])).toThrow();
});

test("() => []", () => {
  expect(normalizeConfig(o => [o], item)).toEqual([item]);
});

test("() => throws", () => {
  expect(() => normalizeConfig(() => null)).toThrow();
});
