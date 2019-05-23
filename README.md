# Conartist

Hate managing all your different config files across all your different
repositories? Great. Step into my office.

> Conartist is a tool that gives you a way to manage all of your config files
> from a single source of truth. Not only will it scaffold them out, it can also
> keep them in sync even if you modify them manually.

Major use cases:

- Keeping separate repos in sync.
- Keeping monorepo packages in sync.
- Scaffolding out new projects.

## Install

```sh
npm i -D conartist
```

Conartist can be configured by any one of the following:

- `conartist` field in the `package.json`
- `.conartistrc`
- `.conartistrc.json`
- `.conartistrc.yaml`
- `.conartistrc.yml`
- `.conartistrc.js`
- `.conartist.config.js`

Any file that ends with `.js` can export a `function` or `object`. If it is a
function, any options you pass to the `conartist` command is passed into the
function as an object.

## Usage

If you put the following in a `package.json`.

```json
{
  "conartist": {
    ".gitignore": ["*.log", "node_modules"],
    ".nvmrc": "10.9.0",
    ".travis.yml": "language: node_js"
  }
}
```

Running `$ conartist` will create the specified files relative to the `cwd`.
This is great for scaffolding out a project or keeping it in sync with what the
configuration has in it.

## Built-in file handlers

The following are the built-in - and exported - file handlers.

- `handeArray` - existing file is merged with config and entries are deduped.
- `handleJs` - if `data` is a `string`, it uses `handleString`. If it's an
  `object` it uses `handleJson`. File is created with `module.exports` set to
  the handled value.
- `handleJson` - existing file is merged with config using `lodash/merge`.
- `handleString` - existing file takes precedence over config value.

These handlers will handle the following file patterns:

```js
const mapGlob = {
  ".nvmrc": handleString,
  ".*rc": handleJson,
  ".*ignore": handleArray,
  "*.js": handleJs,
  "*.json": handleJson
};
```

And attempt to handle the following value types:

```js
const mapType = {
  object: handleJson
};
```

If a handler cannot be found, it defaults to using `handleString`.

## Custom file handlers

Custom file handlers require a `.js` file in order to be applied. There are two
types of handlers you can use:

- Global
- File-specific

### Global file handlers

Global file handlers handle all files in your configuration file. When you set a
global handler, it overwrites the existing handler, so you must call
`getHandler()` and callback to it if you want to retain its functionality around
your new one.

You set a new handler by calling `setHandler(handler)`. You are responsible for
returing the string that will be output to the file and for handling all types
of files that you might set in your configuration.

```js
// conartist.config.js

const { getHandler, setHandler } = require("conartist");

const previousHandler = getHandler();

setHandler(function myCustomHandler(file, data) {
  if (file === ".gitignore") {
    return data.join("\n");
  }
  return previousHandler(file, data);
});

module.exports = {
  ".gitignore": ["*.log", "node_modules"]
};
```

### File-specific handlers

File-specific handlers are applied as a function to the corresponding file
instead of other data types. The global file handler will then call this and
write its return value to the file as a priority over any other handler.

_If you overwrite the default global file handler, file-specific handlers will
not work because their behaviour is provided by the default global file handler.
If you need to override the global file handler and still retain this behaviour,
it's up to you to implement it or call back to the default global file handler._

```js
// conartist.config.js

module.exports = {
  ".gitignore": (file, data) => data.join("\n")
};
```

## Use cases

File-specific handlers are a good way to compose in your own behaviour.

### Preventing merging

You may _not_ want to merge JSON data from the config with what's already there,
by default. To override this, all you need to do is provide a function that
returns JSON:

```js
// conartist.config.js

module.exports = {
  "somefile.json": () => ({
    my: "data"
  })
};
```

In the above example, the config file would always overwrite any existing
`somefile.json`. If you would rather the existing file overwrite the config, you
can do something like:

```js
const { loadJson } = require("conartist");

module.exports = {
  "somefile.json": file =>
    loadJson(file) || {
      my: "data"
    }
};
```

### Custom merging

If you would prefer to implement custom merging, you might do something like:

```js
const { loadJson } = require("conartist");

module.exports = {
  "somefile.json": file => ({
    // Putting your data here means that it can
    // be overridden by existing data.
    my: "data",

    // loadJson returns null if no file is found.
    ...(loadJson(file) || {})
  })
};
```

Another use case is composing files together into another file. This can be
useful if you have custom files that you want to compose together into a file.

The following example will take data read from a `package.json` and generate a
`README.md` from it:

```js
const { loadJson } = require("conartist");
const outdent = require("outdent");

module.exports = {
  "README.md": async file => {
    const pkg = await loadJson("package.json");
    return outdent`
      # ${pkg.name}

      > ${pkg.description}
    `;
  }
};
```

_As shown above, you can also use `async` functions for file handlers!_

## API

All exported API points are documented below.

### Global file handling

APIs for handling all files.

#### `getHandler()`

Returns the current file handler.

#### `setHandler(handler)`

Sets a new file handler, overwriting any current handler. If you require
existing handler functionality, make sure you call `getHandler()` and callback
to it.

### File-specific handling

APIs for handling specific files.

#### `async handleArray(file, arr)`

Handles an array.

#### `async handleJs(file, code)`

Handles JS code depending on the value type and applies it as `module.exports`.

- `typeof` `string` - it is formatted and exported.
- `typeof` `object` - it is stringified, formatted and exported.

#### `async handleJson(file, json)`

Handles JSON. It can be a `string` or anyting that `JSON.parse()` handles.

#### `async handleString(file, str)`

Handles a `string` by ensuring that whatever is passed in is converted to a
`string`.

### Formatting

APIs for formatting data types.

### `formatCode`

Formats JavaScript code using Prettier and the `babel` parser.

### `formatJson`

Formats JSON using `JSON.stringify(json, null, 2)`.

### Processing

#### `async process(config)`

Syncs the configuration with what's on the file system using the file handlers.

### Utils

General utils for loading configs and reading files.

#### `async getConfig`

Returns the current configuration from the configuration file.

#### `filePath(file)`

Returns the full path to the file relative to the current working directory.

#### `async loadFile(file)`

Loads a file using `require` relative to the `cwd`. If it does not exist, it
returns `null`.

#### `async readFile(file)`

Reads a file into a `string` relative to the `cwd`. If it does not exist, it
returns `null`.

#### `async readJson(file)`

Reads a file into JSON relative to the `cwd`. If it does not exist, it returns
`null`.
