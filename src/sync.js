const fs = require("fs-extra");
const path = require("path");
const { handler } = require("./handler");

async function sync(cfg, cwd) {
  cfg.forEach(async file => {
    file = {
      ...file,
      name: path.normalize(path.join(cwd, file.name))
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
