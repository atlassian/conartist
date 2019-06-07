const fs = require("fs-extra");
const isArray = require("lodash/isArray");
const merge = require("lodash/merge");
const path = require("path");
const pkgUp = require("pkg-up");
const { handler } = require("./handler");

async function sync(cfg, opt) {
  opt = merge({ cwd: "." }, opt);
  cfg = typeof cfg === "function" ? cfg(opt) : cfg;
  cfg = merge({ files: [], include: [] }, cfg);

  // Includes are like Babel plugins.
  for (let inc of cfg.include) {
    let arg;

    // Like in Babel configs, you can specify an array to pass options to
    // the plugin you are loading.
    if (isArray(inc)) {
      arg = inc[1];
      inc = inc[0];
    }

    if (typeof inc === "string") {
      // If it's a relative path, we attempt to require it relative to the
      // current working directory.
      if (inc[0] === ".") {
        inc = path.resolve(path.dirname(await pkgUp()), inc);
      }
      inc = require(inc);
    }

    if (typeof inc === "function") {
      inc = inc(arg);
    }

    await sync(inc, opt);
  }

  // The innermost plugin is executed first. Outer plugins override those
  // and in the same convention, files at the top level override everything
  // else before it.
  for (let file of cfg.files) {
    file = {
      ...file,
      name: path.normalize(path.join(opt.cwd, file.name))
    };
    if (file.data) {
      await fs.outputFile(file.name, await handler(file));
    } else {
      await fs.remove(file.name);
    }
  }
}

module.exports = {
  sync
};
