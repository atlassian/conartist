const fs = require("fs-extra");
const mockStdin = require("mock-stdin");
const os = require("os");
const path = require("path");
const { bin } = require("..");

const output = path.join(__dirname, "..", "__output__");
const output1 = path.join(output, "1");
const output2 = path.join(output, "2");

async function read(...paths) {
  return (await fs.readFile(path.join(output, ...paths))).toString();
}

let stdin;

beforeEach(() => {
  stdin = mockStdin.stdin();
});

afterEach(() => {
  stdin.restore();
});

test("bin [stdin]", async () => {
  process.nextTick(() => {
    stdin.send(output1);
    stdin.send(os.EOL);
    stdin.send(output2);
    stdin.end();
  });
  await bin({
    name: "test",
    description: "testing",
    conartist: {
      files: {
        "index.js": "// testing"
      }
    },
    stdin
  });
  expect(await read("1", "index.js")).toBe("// testing\n");
  expect(await read("2", "index.js")).toBe("// testing\n");
});

test("bin [...input]", async () => {
  process.nextTick(() => {
    stdin.end();
  });
  process.argv.push(output1);
  process.argv.push(output2);
  await bin({
    name: "test",
    description: "testing",
    conartist: {
      files: {
        "index.js": "// testing"
      }
    },
    stdin
  });
  expect(await read("1", "index.js")).toBe("// testing\n");
  expect(await read("2", "index.js")).toBe("// testing\n");
});
