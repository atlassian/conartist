# Conartist

Hate managing all your different config files across all your different
repositories?

> Conartist is a tool that gives you a way to manage all of your config files
> from a single source of truth. Not only will it scaffold them out, it can also
> keep them in sync, even if you modify them manually.

- ✋ Keeping separate repos in sync.
- 📦 Keeping monorepo packages in sync.
- 🏗 Scaffolding out new projects.
- 📐 Works well with [`workspaces`](https://github.com/treshugart/jobsite).

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

_If you use a `.js` file, you will be able to have finer-grained control over
your configuration. More on this later._

## CLI

```sh
$ conartist --help

  Declarative project scaffolding and synchronisation.

  Usage
    $ conartist

  Options
    --cwd Set the cwd.

```

### Simple example

If you put the following in a `package.json`.

```json
{
  "conartist": {
    "files": {
      ".gitignore": "node_modules",
      ".nvmrc": "10.16.0",
      ".travis.yml": "language: node_js",
      "src/index.js": "module.exports = {};"
    }
  }
}
```

Now run `conartist`:

```sh
$ conartist
A .gitignore
A .nvmrc
A .travis.yml
A src/index.js
```

Resulting in the following file structure:

```
├─ src
│ └─ index.js
├─ .gitignore
├─ .nvmrc
└─ .travis.yml
```

The key from each entry is the file path relative to the `cwd` and the value
becomes the file contents.

## Configuration

The `conartist` configuration is a config `object` or a `function` that returns
a config `object`.

_All options are optional._

A `files` object is the simpler form of configuration when you don't need to
specify any other options.

```js
module.exports = {
  files: {
    "src/index.js": "module.exports = {};"
  }
};
```

A `files` array allows you to specify more options.

```js
module.exports = {
  // The these are merged with each entry in `files` but do not
  // override them.
  fileDefaults: {
    merge: false,
    overwrite: false,
    remove: false
  },
  files: [
    {
      // The name of the file relative to the directory it is run in.
      // In the `files` object, this is the key.
      name: "src/index.js",

      // The contents of the file. In the `files` object this is the
      // value.
      data: "module.exports = {};",

      // Whether or not to attempt merging with any existing file if
      // supported by the data type.
      merge: false,

      // Whether or not to override the existing file.
      overwrite: false,

      // Whether or not the file should be removed. This superseces
      // any other option because the file is deleted.
      remove: false,

      // The data type to handle the file as. Built-in data types are
      // listed below. By default this is inferred from the file
      // extension. If a data type for the file extension cannot be
      // found, the typeof the value is used. If it still can't find
      // a data type, it coerces it to a string. To specify your own
      // data type, use a function.
      type: "js"
    }
  ]
};
```

Includes is just an array of configurations that also allow you to use
module-specifier strings for loading external configurations.

```js
module.exports = {
  // These only act as defaults for `files` in the config in which they
  // are specified and do not affect anything in `includes`.
  fileDefaults: {},
  includes: [
    [
      // This is just a standard config as specified for module.exports.
      {
        files: [
          {
            name: "src/index.js",
            data: "module.exports = {};"
          }
        ]
      }
    ]
  ]
};
```

As noted above, you can also specify includes using module-specifiers.

```js
module.exports = {
  includes: [
    // Loaded via node_modules.
    "some-module-config",

    // Loaded relative to the CWD.
    "./path/to/config",

    // Use this form if your config will be used as an include because
    // paths are resolved relative to where the config is run from.
    require("some-module-config"),
    require("./path/to/config")
  ]
};
```

Making `includes` just standard configurations means that an include can just be
any old configuration and they're resolved recursively down the tree. The outer
configurations are applied _after_ the inner configurations, but they do _not_
override them, allowing them to be composed.

### Built-in data types

These types correspond to the `extname` of the `name` option, or can be
explicitly specified as a `type`.

- `js` takes `data` as a `string` and formats it using `prettier`.
  - `overwrite: false` Existing file is preserved.
  - `overwrite: true` New data overwrites existing file.
- `jsx` alias for `js`.
- `json` takes `data` as JSON and stringifies it.
  - `merge: false, overwrite: false` prefers existing values.
  - `merge: false, overwrite: true` prefers new values.
  - `merge: true, overwrite: false` merges values, preferring existing values.
  - `merge: true, overwrite: true` merge values, preferring new values.
- `md` takes `data` as a string and formats it using `prettier`.
  - `overwrite: false` Existing file is preserved.
  - `overwrite: true` New data overwrites existing file.
- `mdx` alais for `md`.

## API

All exported API points are documented below.

### `async bin(opt)` - automated CLI

The `bin` function automates a lot of the boilerplate in creating a CLI tool.
It's intended to jump-start your ability for you to create a Conartist config
that can be run by simply typing `npx your-command`. This idea was borrowed from
https://www.npmjs.com/package/travis.yml.

A big bonus of doing things this way is that your consumers don't need
`conartist` to be installed and serveral commands can work in harmony even if
they depend on different versions of `conartist`.

The available options are:

- `conartist` the `conartist` configuration as normally specified in a config
  file. Defaults to `[]`.
- `description` the description of your CLI. Defaults to `""`.
- `name` the name of your CLI. Defaults to `""`.
- `options` the CLI options to parse. Unspecified options are still available as
  they were specified by the user. Defaults to `{ cwd }`.
- `version` the version of your CLI. Defaults to `"0.0.0"`.

The following example creates a `npx license-mit` command.

#### `package.json`

```json
{
  "name": "license-mit",
  "description": "Creates and maintains an MIT license in your projects.",
  "author": "Your Name <you@yourdomain.com>",
  "version": "1.0.0",
  "bin": "bin"
}
```

#### `bin.js`

The following `bin.js` uses information from your `package.json` to define
metadata, and then specifies the `conartist` option to specify the `conartist`
configuration. You could have specified `conartist` in your `package.json`, but
we wanted the ability to use template literals, thus opted to specify it as a
JavaScript object instead.

```js
#! /usr/bin/env node

const { bin } = require("conartist");
const pkg = require("./package.json");

bin({
  ...pkg,
  conartist: {
    files: {
      LICENSE: `
        Copyright 2019 ${pkg.author}

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      `
    }
  }
});
```

As seen above, the configuration is specified using an `array`. However, you
could also specify a function that gets the following options passed in:

- `cli` the arguments parsed from the CLI. This allows you to add custom options
  and use them to generate your config.
- `cwd` the current working directory that the config is running in.
- `opt` the options that you originally passed in to `bin(opt)`.

You could rewrite the above like so:

```js
#! /usr/bin/env node

const { bin } = require("conartist");

bin({
  ...require("./package.json"),
  conartist: ({ opt }) => ({
    files: {
      LICENSE: `
        Copyright 2019 ${opt.author}

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      `
    }
  })
});
```

#### Resulting `LICENSE`

```
Copyright 2019 Your Name <you@yourdomain.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

#### Testing

You can now test to see if your command works by running `npx .`.

#### Built-in features

The `bin` function uses [`meow`](https://github.com/sindresorhus/meow) under the
hood, so it automates quite a bit for you.

Help:

```sh
$ npx . --help

  Creates and maintains an MIT license in your projects.

  Usage
    $ license-mit [...cwds]

```

Options:

- `[stdin]` A newline-separated list of directories to run the config in.
- `[...cwds]` Space-separated paths to run the config in.

_Both `[stdin]` and `[...cwds]` are supported by default as a way to either pipe
or supply paths to `conartist`. If both are provided they are merged together
and it is run on all provided paths. If none are provided, then `.` is used._

Version:

```sh
$ npx . --version
1.0.0
```

#### Publishing and running

You can now run [`np`](https://github.com/sindresorhus/np) and your command is
runnable via `npx license-mit` anywhere.

### `async sync(cfg, opt)` - programmatic config application

The `sync` function takes a configuration as `cfg`, normalizes it with `opt` and
applies it to your `cwd`.

The available options are:

- `cwd` a custom current working directory to apply the configuration to.
  Defaults to `"."`.

```js
const { sync } = require("conartist");

sync(
  {
    files: {
      ".travis.yml": "language: node_js"
    }
  },
  {
    cwd: "packages/sub-package"
  }
);
```

Just like with `bin`, if you specify a function as `cfg`, the options you pass
in are passed to it:

```js
const { sync } = require("conartist");

sync(
  ({ language }) => ({
    files: {
      ".travis.yml": "language: node_js"
    }
  }),
  {
    language: "node_js"
  }
);
```

```

```
