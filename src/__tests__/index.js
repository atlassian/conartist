const index = require("..");

test("exports", () => {
  expect(
    Object.keys(index).reduce((prev, curr) => {
      prev[curr] = typeof index[curr];
      return prev;
    }, {})
  ).toEqual({
    filterWorkspaces: "function",
    formatCode: "function",
    formatJson: "function",
    getConfig: "function",
    getHandler: "function",
    getWorkspaces: "function",
    handleArray: "function",
    handleJs: "function",
    handleJson: "function",
    handleString: "function",
    normalizeConfig: "function",
    run: "function",
    setHandler: "function",
    sync: "function"
  });
});
