const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const { bin } = require("..");

const output = path.join(__dirname, "..", "__output__");
const output1 = path.join(output, "1");
const output2 = path.join(output, "2");

async function read(...paths) {
  const file = path.join(output, ...paths);
  return (await fs.exists(file)) ? (await fs.readFile(file)).toString() : null;
}

async function run() {
  await bin({
    name: "test",
    description: "testing",
    conartist: {
      files: {
        "index.js": "// testing"
      }
    }
  });
}

test("bin [...input]", async () => {
  await fs.remove(output);
  process.argv.push(output1);
  process.argv.push(output2);
  await run();
  expect(await read("1", "index.js")).toBe("// testing\n");
  expect(await read("2", "index.js")).toBe("// testing\n");
});

test("bin [...input] --dry", async () => {
  await fs.remove(output);
  process.argv.push(output1);
  process.argv.push(output2);
  process.argv.push("--dry");
  await run();
  expect(await read("1", "index.js")).toBe(null);
  expect(await read("2", "index.js")).toBe(null);
});
