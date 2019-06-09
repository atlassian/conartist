const fs = require("fs-extra");
const outdent = require("outdent");
const path = require("path");
const { sync } = require("..");

const root = path.resolve("src", "__fixture__", "sync");
const output = path.join(root, "__output__");

async function read(file) {
  return (await fs.readFile(path.join(output, file))).toString();
}

test("sync", async () => {
  await fs.remove(output);
  await sync(require(root), { cwd: output });
  expect(await read("file1")).toBe("index -> file1");
  expect(await read("file2")).toBe(outdent`
    {
      "test": "include1 -> file2"
    }
  `);
  expect(await fs.exists(path.join(output, "file3"))).toBe(false);
});
