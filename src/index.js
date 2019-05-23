module.exports = Object.assign(
  {},
  ...["config", "format", "handler", "read", "process"].map(m =>
    require(`./${m}`)
  )
);
