module.exports = Object.assign(
  {},
  ...["config", "format", "handler", "run", "sync", "workspaces"].map(m =>
    require(`./${m}`)
  )
);
