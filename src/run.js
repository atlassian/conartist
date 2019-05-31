const commander = require("commander");
const isFunction = require("lodash/isFunction");
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
  const workspaces = cli.w
    ? filterWorkspaces(await getWorkspaces(), cli.w)
    : ["."];
  const config = isFunction(opt.config)
    ? await opt.config({ cli, cwd, workspaces })
    : opt.config;

  await Promise.all(
    workspaces.map(async wsDir => {
      const wsCwd = path.resolve(wsDir);
      const wsCfg = normalizeConfig(config, { ...cli, cwd: wsCwd });
      return await sync(wsCfg, wsCwd);
    })
  );
}

module.exports = {
  run
};
