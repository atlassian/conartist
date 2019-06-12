const fs = require("fs-extra");
const isArray = require("lodash/isArray");
const isPlainObject = require("lodash/isPlainObject");
const mergeWith = require("lodash/mergeWith");
const os = require("os");
const path = require("path");
const pkgUp = require("pkg-up");
const reduce = require("lodash/reduce");
const { handler } = require("./handler");

const configDefaults = {
  fileDefaults: {
    merge: false,
    overwrite: false,
    remove: false
  },
  files: [],
  include: [],
  includes: []
};

const optionDefaults = {
  cwd: ".",
  dry: false
};

// Lodash merges arrays with objects, but we need it to replace arrays
// with objects instead.
function merger(prev, curr) {
  if (isArray(prev) && isPlainObject(curr)) {
    return curr;
  }
}

async function sync(cfg, opt) {
  opt = mergeWith({}, optionDefaults, opt, merger);
  cfg = typeof cfg === "function" ? cfg(opt) : cfg;
  cfg = mergeWith({}, configDefaults, cfg, merger);

  // Files can be either an array of file objects or an object of
  // name / data pairs that gets converted to a file object.
  if (isPlainObject(cfg.files)) {
    cfg.files = reduce(
      cfg.files,
      (result, data, name) => {
        return result.concat({ data, name });
      },
      []
    );
  }

  // Make include alias includes for backward compat, for now.
  cfg.includes = cfg.includes.concat(cfg.include);

  // If there's no files or includes, it's not really an error but there's
  // nothing to do.
  if (!cfg.files.length && !cfg.includes.length) {
    console.warn(
      'You have not provided any "files" or "includes". For more information see https://github.com/treshugart/conartist#install for ways you can configure conartist.'
    );
    process.exit();
  }

  // Ensure they know they're doing a dry run.
  if (opt.dry) {
    console.log(
      "A dry run is being performed. No files will be output.",
      os.EOL
    );
  }

  // Includes are like Babel plugins.
  for (let inc of cfg.includes) {
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
      ...cfg.fileDefaults,
      ...file,
      name: path.normalize(path.join(opt.cwd, file.name))
    };
    const relativePath = path.relative(process.cwd(), file.name);
    if (file.remove) {
      console.log(`D ${relativePath}`);
      if (!opt.dry) {
        await fs.remove(file.name);
      }
    } else {
      if (await fs.exists(file.name)) {
        const action = file.overwrite ? "O" : file.merge ? "M" : "U";
        console.log(`${action} ${relativePath}`);
      } else {
        console.log(`A ${relativePath}`);
      }
      if (!opt.dry) {
        await fs.outputFile(file.name, await handler(file));
      }
    }
  }
}

module.exports = {
  sync
};
