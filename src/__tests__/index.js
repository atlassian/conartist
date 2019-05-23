const index = require("..");

test("exports", () => {
  expect(
    Object.keys(index).reduce((prev, curr) => {
      prev[curr] = typeof index[curr];
      return prev;
    }, {})
  ).toEqual({
    filePath: "function",
    formatCode: "function",
    formatJson: "function",
    getConfig: "function",
    getHandler: "function",
    handleArray: "function",
    handleJs: "function",
    handleJson: "function",
    handleString: "function",
    loadFile: "function",
    readFile: "function",
    readJson: "function",
    setHandler: "function",
    sync: "function"
  });
});
