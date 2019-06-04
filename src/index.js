module.exports = Object.assign(
  {},
  ...["config", "format", "handler", "run", "sync"].map(m => require(`./${m}`))
);
