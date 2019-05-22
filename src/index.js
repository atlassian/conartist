module.exports = Object.assign(
  {},
  ...["config", "format", "handler", "read", "sync"].map(m => require(`./${m}`))
);
