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

async function run(options) {
  await bin({
    name: "test",
    description: "testing",
    options,
    conartist: ({ cli }) => ({
      files: {
        "index.js": `// ${cli.customOption}`
      }
    })
  });
}

beforeEach(async () => {
  process.argv = process.argv.slice(0, 2);
  await fs.remove(output);
});

test("bin [...input]", async () => {
  process.argv.push(output1);
  process.argv.push(output2);
  await run();
  expect(await read("1", "index.js")).toBe("// undefined\n");
  expect(await read("2", "index.js")).toBe("// undefined\n");
});

test("bin [...input] --dry", async () => {
  process.argv.push(output1);
  process.argv.push(output2);
  process.argv.push("--dry");
  await run();
  expect(await read("1", "index.js")).toBe(null);
  expect(await read("2", "index.js")).toBe(null);
});

test("bin [...input] --custom-option (unregistered option)", async () => {
  process.argv.push(output1);
  process.argv.push(output2);
  process.argv.push("--custom-option", "testing");
  await run();
  expect(await read("1", "index.js")).toBe("// testing\n");
  expect(await read("2", "index.js")).toBe("// testing\n");
});

test("bin [...input] --custom-option (registered option)", async () => {
  process.argv.push(output1);
  process.argv.push(output2);
  process.argv.push("--custom-option", "testing");
  await run({
    "custom-option": {}
  });
  expect(await read("1", "index.js")).toBe("// testing\n");
  expect(await read("2", "index.js")).toBe("// testing\n");
});

test("bin [...input] -c (aliased option)", async () => {
  process.argv.push(output1);
  process.argv.push(output2);
  process.argv.push("-c", "testing");
  await run({
    "custom-option": {
      alias: "c"
    }
  });
  expect(await read("1", "index.js")).toBe("// testing\n");
  expect(await read("2", "index.js")).toBe("// testing\n");
});
