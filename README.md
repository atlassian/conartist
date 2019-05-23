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
not work._

```js
// conartist.config.js

module.exports = {
  ".gitignore": (file, data) => data.join("\n")
};
```
