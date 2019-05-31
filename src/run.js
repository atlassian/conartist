const commander = require("commander");
const path = require("path");
const { getConfig, normalizeConfig } = require("./config");
const { filterWorkspaces, getWorkspaces } = require("./workspaces");
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
    options: [
      ...(opt.options || []),
      {
        description: "The configuration file to load for this run.",
        name: "-c, --config <file>"
      },
      {
        description:
          "A pattern matching the workspaces the config should be run in.",
        name: "-w, --workspaces <glob>"
      }
    ]
  };
}

async function run(opt) {
  const cli = getCli(opt);
  const cwd = process.cwd();
  const config = cli.c ? require(path.join(cwd, cli.c)) : await getConfig();
  const workspaces = cli.w
    ? filterWorkspaces(await getWorkspaces(), cli.w)
    : ["."];

  await Promise.all(
    workspaces.map(async dir => {
      const cwd = path.resolve(dir);
      const cfg = normalizeConfig(config, { ...cli, cwd });
      return await sync(cfg, cwd);
    })
  );
}

module.exports = {
  run
};
