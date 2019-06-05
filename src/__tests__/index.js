const index = require("..");

test("exports", () => {
  expect(
    Object.keys(index).reduce((prev, curr) => {
      prev[curr] = typeof index[curr];
      return prev;
    }, {})
  ).toEqual({
    bin: "function",
    sync: "function"
  });
});
