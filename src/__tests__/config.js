const { getConfig } = require("..");

const item = { data: "", name: "item" };

test("{ name: data }", async () => {
  expect(await getConfig({ [item.name]: item.data })).toEqual([item]);
});

test("[array]", async () => {
  expect(await getConfig([[item]])).toEqual([item]);
});

test("[function]", async () => {
  expect(await getConfig([[opts => opts, item]])).toEqual([item]);
});

test("[object]", async () => {
  expect(await getConfig([item])).toEqual([item]);
});

test("[string]", async () => {
  expect(await getConfig([".."])).toEqual([require("..")]);
});

test("[throws]", async () => {
  expect(getConfig([null])).rejects.toThrow();
});

test("() => []", async () => {
  expect(await getConfig(o => [o], item)).toEqual([item]);
});

test("() => throws", async () => {
  expect(getConfig(() => null)).rejects.toThrow();
});
