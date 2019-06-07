const fs = require("fs-extra");
const path = require("path");
const { sync } = require("..");

const root = path.resolve("src", "__fixture__", "sync");
const output = path.join(root, "__output__");

async function read(file) {
  return (await fs.readFile(path.join(output, file))).toString();
}

test("sync", async () => {
  fs.remove(output);
  await sync(require(root), { cwd: output });
  expect(await read("file1")).toBe("overwritten");
  expect(await read("file2")).toBe("data2");
});
