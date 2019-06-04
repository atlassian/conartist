const commander = require("commander");
const isFunction = require("lodash/isFunction");
const path = require("path");
const { getConfig, normalizeConfig } = require("./config");
const { sync } = require("./sync");

function getCli(opt) {
  const cli = new commander.Command();

  // Normalize options for commander.
  opt = getOptions(opt);

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

function getOptions(opt) {
  opt = opt || {};
  return {
    ...opt,
    options: opt.options || []
  };
}

async function run(opt) {
  const cli = getCli(opt);
  const cwd = process.cwd();
  const config = isFunction(opt.config)
    ? await opt.config({ cli, cwd })
    : opt.config;
  await sync(normalizeConfig(config, cli), cwd);
}

module.exports = {
  run
};
