const meow = require("meow");
const getStdin = require("get-stdin");
const loPickBy = require("lodash/pickBy");
const loMap = require("lodash/map");
const loMerge = require("lodash/merge");
const { normalizeConfig } = require("./config");
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
  opt = loMerge(optDefault, opt);
  const flags = loPickBy(opt.options, Boolean);
  const flagsExist = Object.keys(flags).length;
  const cli = meow(
    `
      Usage
        $ ${opt.name}
    
      ${flagsExist ? "Options" : ""}
        ${loMap(flags, (flag, name) => {
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
  return cli.flags;
}

async function getCwds(cli) {
  const std = (await getStdin()).split("\n").filter(Boolean);
  const cwd = cli.cwd ? cli.cwd.split(",") : [];
  const all = std.concat(cwd);
  return all.length ? all : ["."];
}

async function bin(opt) {
  const cli = getCli(opt);
  const cwds = await getCwds(cli);
  for (const cwd of cwds) {
    const config = await normalizeConfig(opt.conartist, { cli, cwd, opt });
    await sync(config, cwd);
  }
}

module.exports = {
  bin
};
