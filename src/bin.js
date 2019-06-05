const meow = require("meow");
const getStdin = require("get-stdin");
const loMerge = require("lodash/merge");
const { normalizeConfig } = require("./config");
const { sync } = require("./sync");

const optDefault = {
  config: [],
  description: "",
  name: "",
  options: {},
  version: "0.0.0"
};

function getCli(opt) {
  opt = loMerge(optDefault, opt);
  const flags = Object.keys(opt.options);
  const cli = meow(
    `
      Usage
        $ ${opt.name}
    
      ${flags.length ? "Options" : ""}
        ${flags
          .reduce((prev, curr) => {
            const f = opt.options[curr];
            const alias = f.alias ? `, -${f.alias}` : "";
            const defaultValue = f.default
              ? ` (default: ${JSON.stringify(f.default)})`
              : "";
            const description = f.description ? ` ${f.description}` : "";
            const name = `--${curr}`;
            return prev.concat(name + alias + description + defaultValue);
          }, [])
          .join("\n        ")}
    `.trimEnd(),
    {
      flags: opt.options,
      version: opt.version
    }
  );
  return cli.flags;
}

async function getCwds() {
  const std = (await getStdin()).split("\n").filter(Boolean);
  return std.length ? std : [process.cwd()];
}

async function bin(opt) {
  const cli = getCli(opt);
  const cwds = await getCwds();
  for (const cwd of cwds) {
    const config = await normalizeConfig(opt.config, { cli, cwd, opt });
    await sync(config, cwd);
  }
}

module.exports = {
  bin
};
