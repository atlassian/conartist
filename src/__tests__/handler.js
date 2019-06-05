const { handler } = require("../handler");
const stripIndent = require("strip-indent");
const outdent = require("outdent");

const jsData = `module.exports={}`;
const jsStr = outdent`
  module.exports = {};
  
`;
const jsxData = "<tag></tag>";
const jsxStr = outdent`
  <tag />;

`;
const jsonData = ["one", "two"];
const jsonStr = outdent`
  [
    "one",
    "two"
  ]
`;
const mdData = `
  \`\`\`js
  <tag></tag>
  \`\`\`
`;
const mdStr = outdent`
  \`\`\`js
  <tag />
  \`\`\`
  
`;

test("json (extname)", async () => {
  expect(
    await handler({
      name: "test.json",
      data: jsonData
    })
  ).toBe(jsonStr);
});

test("json (type)", async () => {
  expect(
    await handler({
      name: "test",
      data: jsonData,
      type: "json"
    })
  ).toBe(jsonStr);
});

test("json (typeof)", async () => {
  expect(
    await handler({
      name: "test",
      data: jsonData
    })
  ).toBe(jsonStr);
});

test("js (extname)", async () => {
  expect(
    await handler({
      name: "test.js",
      data: jsData
    })
  ).toBe(jsStr);
});

test("js (type)", async () => {
  expect(
    await handler({
      name: "test",
      data: jsData,
      type: "js"
    })
  ).toBe(jsStr);
});

test("jsx (extname)", async () => {
  expect(
    await handler({
      name: "test.jsx",
      data: jsxData
    })
  ).toBe(jsxStr);
});

test("jsx (type)", async () => {
  expect(
    await handler({
      name: "test",
      data: jsxData,
      type: "jsx"
    })
  ).toBe(jsxStr);
});

test("md (extname)", async () => {
  expect(
    await handler({
      name: "test.md",
      data: mdData
    })
  ).toBe(mdStr);
});
