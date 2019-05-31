module.exports = Object.assign(
  {},
  ...["config", "format", "handler", "process", "workspaces"].map(m =>
    require(`./${m}`)
  )
);
