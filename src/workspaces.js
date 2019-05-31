const cosmiconfig = require("cosmiconfig");
const globby = require("globby");
const minimatch = require("minimatch");

async function getWorkspaces(pattern) {
  const search = await cosmiconfig("workspaces").search();
  const wsGlobs = search ? search.config : [pattern];
  return await globby(wsGlobs, {
    expandDirectories: false,
    onlyDirectories: true
  });
}

function filterWorkspaces(wsPaths, pattern) {
  return pattern ? minimatch.match(wsPaths, pattern) : wsPaths;
}

module.exports = {
  filterWorkspaces,
  getWorkspaces
};
