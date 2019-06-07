const fs = require("fs-extra");
const path = require("path");
const { sync } = require("..");

async function read(file) {
  return (await fs.readFile(
    path.join("src", "__fixture__", "sync", "__output__", file)
  )).toString();
}

test("sync", async () => {
  await sync(require("../__fixture__/sync"), {
    cwd: "./src/__fixture__/sync/__output__"
  });
  expect(await read("file1")).toBe("overwritten");
  expect(await read("file2")).toBe("data2");
});
