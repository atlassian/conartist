const EventEmitter = require("events");
const fs = require("fs-extra");
const isArray = require("lodash/isArray");
const isPlainObject = require("lodash/isPlainObject");
const mergeWith = require("lodash/mergeWith");
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
  cwd: null,
  dry: false,
  events: new EventEmitter()
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

  if (!opt.cwd) {
    throw new Error("You must specify a cwd option.");
  }

  if (typeof cfg === "function") {
    return await sync(await cfg(opt), opt);
  }

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

  // If no files or includes are specified, we warn. You can still specify
  // empty arrays, which explicitly means don't run on anything.
  if (!("files" in cfg) && !("includes" in cfg)) {
    opt.events.emit(
      "warn",
      'You have not provided any "files" or "includes". For more information see https://github.com/treshugart/conartist#install for ways you can configure conartist.'
    );
    return;
  }

  // Ensure they know they're doing a dry run.
  if (opt.dry) {
    opt.events.emit(
      "info",
      "A dry run is being performed. No files will be output."
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
    let action;
    const relativePath = path.relative(process.cwd(), file.name);
    if (file.remove) {
      action = "D";
      if (!opt.dry) {
        await fs.remove(file.name);
      }
    } else {
      if (await fs.exists(file.name)) {
        action = file.overwrite ? "O" : file.merge ? "M" : "U";
      } else {
        action = "A";
      }
      if (!opt.dry) {
        await fs.outputFile(file.name, await handler(file));
      }
    }
    opt.events.emit("file", { action, file: relativePath });
  }
}

module.exports = {
  sync
};
