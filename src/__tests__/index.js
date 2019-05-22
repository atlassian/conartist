const index = require("..");

test("exports", () => {
  expect(
    Object.keys(index).reduce((prev, curr) => {
      prev[curr] = typeof index[curr];
      return prev;
    }, {})
  ).toEqual({
    formatCode: "function",
    formatJson: "function",
    getHandlerLocator: "function",
    js: "function",
    json: "function",
    setHandlerLocator: "function",
    string: "function",
    sync: "function"
  });
});
