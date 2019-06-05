const commander = require("commander");
const getStdin = require("get-stdin");
const loMerge = require("lodash/merge");
const { normalizeConfig } = require("./config");
const { sync } = require("./sync");

const optDefault = {
  config: [],
  description: "",
  options: [],
  version: "0.0.0"
};

async function getCli(opt) {
  const cli = new commander.Command();

  // Normalize options for commander.
  opt = loMerge(optDefault, opt);

  // It doesn't seem commander allows you to add a main command description.
  if (opt.description) {
    console.log(opt.description, "\n");
  }

  // CLI version.
  if (opt.version) {
    cli.version(opt.version);
  }

  // Setup options.
  opt.options.forEach(o => cli.option(o.name, o.description, o.default));
  cli.parse(process.argv);

  return cli;
}

async function getCwds() {
  const std = (await getStdin()).split("\n").filter(Boolean);
  return std.length ? std : [process.cwd()];
}

async function run(opt) {
  const cli = await getCli(opt);
  const cwds = await getCwds();
  for (const cwd of cwds) {
    const config = await normalizeConfig(opt.config, { cli, cwd, opt });
    await sync(config, cwd);
  }
}

module.exports = {
  run
};
