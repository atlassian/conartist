const fs = require("fs-extra");
const loMerge = require("lodash/merge");
const path = require("path");
const { normalizeConfig } = require("./config");
const { handler } = require("./handler");

async function sync(cfg, opt) {
  opt = loMerge({ cwd: "." }, opt);
  cfg = await normalizeConfig(cfg, opt);
  cfg.forEach(async file => {
    file = {
      ...file,
      name: path.normalize(path.join(opt.cwd, file.name))
    };
    if (file.data) {
      await fs.outputFile(file.name, await handler(file));
    } else {
      await fs.remove(file.name);
    }
  });
}

module.exports = {
  sync
};
