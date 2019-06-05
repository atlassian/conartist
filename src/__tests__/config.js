const { normalizeConfig } = require("../config");

const item = { data: "", name: "item" };

test("{ name: data }", async () => {
  expect(await normalizeConfig({ [item.name]: item.data })).toEqual([item]);
});

test("[array]", async () => {
  expect(await normalizeConfig([[item]])).toEqual([item]);
});

test("[function]", async () => {
  expect(await normalizeConfig([[opts => opts, item]])).toEqual([item]);
});

test("[object]", async () => {
  expect(await normalizeConfig([item])).toEqual([item]);
});

test("[string]", async () => {
  expect(await normalizeConfig([".."])).toEqual([require("..")]);
});

test("[throws]", async () => {
  await expect(normalizeConfig([null])).rejects.toThrow();
});

test("() => []", async () => {
  expect(await normalizeConfig(o => [o], item)).toEqual([item]);
});

test("[throws]", async () => {
  await expect(normalizeConfig(() => null)).rejects.toThrow();
});
