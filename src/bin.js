#!/usr/bin/env node

const meow = require("meow");
const path = require("path");
const {
  getConfig,
  normalizeConfig,
  filterWorkspaces,
  getWorkspaces,
  loadFile,
  process
} = require(".");

const cwd = global.process.cwd();
const cli = meow(
  `
    Usage
      conartist
  `.trimEnd(),
  {
    flags: {
      config: {
        alias: "c",
        type: "string"
      }
    },
    flags: {
      workspaces: {
        alias: "w",
        type: "string"
      }
    }
  }
);

(async () => {
  const { c, w } = cli.flags;
  const config = c ? require(path.join(cwd, c)) : await getConfig();
  const workspaces = w ? filterWorkspaces(await getWorkspaces(), w) : ["."];
  await Promise.all(
    workspaces.map(async dir => {
      const cwd = path.resolve(dir);
      const cfg = normalizeConfig(config, { ...cli.flags, cwd });
      return await process(cfg, cwd);
    })
  );
})();
