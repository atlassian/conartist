const meow = require("meow");
const map = require("lodash/map");
const merge = require("lodash/merge");
const pickBy = require("lodash/pickBy");
const os = require("os");
const { sync } = require("./sync");

const optDefault = {
  conartist: {},
  description: "",
  name: "",
  options: {
    dry: {
      alias: "d",
      description: "Perform a dry run.",
      type: "boolean"
    }
  },
  version: "0.0.0"
};

function getCli(opt) {
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
  return cli.input.length ? cli.input : ["."];
}

async function bin(opt) {
  opt = merge(optDefault, opt);
  const cli = getCli(opt);
  const cwds = await getCwds(cli, opt);
  for (const cwd of cwds) {
    await sync(opt.conartist, {
      cli: cli.flags,
      cwd,
      dry: cli.flags.dry,
      opt
    });
  }
}

module.exports = {
  bin
};
