const meow = require("meow");
const map = require("lodash/map");
const merge = require("lodash/merge");
const pickBy = require("lodash/pickBy");
const os = require("os");
const { sync } = require("./sync");

const optDefault = {
  conartist: [],
  description: "",
  name: "",
  options: {
    cwd: {
      description: "Set the cwd."
    }
  },
  version: "0.0.0"
};

function getCli(opt) {
  opt = merge(optDefault, opt);
  const flags = pickBy(opt.options, Boolean);
  const flagsExist = Object.keys(flags).length;
  const cli = meow(
    `
      Usage
        $ ${opt.name}
    
      ${flagsExist ? "Options" : ""}
        ${map(flags, (flag, name) => {
          const alias = flag.alias ? `, -${flag.alias}` : "";
          const defaultValue = flag.default
            ? ` (default: ${JSON.stringify(flag.default)})`
            : "";
          const description = flag.description ? ` ${flag.description}` : "";
          const namePrefixed = `--${name}`;
          return namePrefixed + alias + description + defaultValue;
        }).join("\n        ")}
    `.trimEnd(),
    {
      flags,
      version: opt.version
    }
  );
  return cli;
}

async function getCwds(cli) {
  const stdin = new Promise(res => {
    let cwds = "";
    process.stdin.on("data", data => {
      cwds += data;
    });
    process.stdin.on("end", () => {
      res(cwds);
    });
  });
  const std = (await stdin).split(os.EOL).filter(Boolean);
  const all = std.concat(cli.input);
  return all.length ? all : ["."];
}

async function bin(opt) {
  const cli = getCli(opt);
  const cwds = await getCwds(cli);
  for (const cwd of cwds) {
    await sync(opt.conartist, { cli: cli.flags, cwd, opt });
  }
}

module.exports = {
  bin
};
