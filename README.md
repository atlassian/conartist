# Conartist

> Scaffold out and keep all your files in sync over time. Code-shifts for your
> file system.

Conartist is a tool that allows you to scaffold out and maintain your project
configurations over time.

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

  Description
    Declarative project scaffolding and synchronisation.

  Usage
    $ conartist <command> [options]

  Available Commands
    default    Run the default configuration.

  For more info, run any command with the `--help` flag
    $ conartist default --help

  Options
    -v, --version    Displays current version
    -d, --dry        Perform a dry run.
    -h, --help       Displays this message

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

Now run `conartist` on the current working directory:

```sh
$ conartist .
/path/to/cwd
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

- `name` the name of your CLI. Defaults to `""`.
- `description` the description of your CLI. Defaults to `""`.
- `version` the version of your CLI. Defaults to `"0.0.0"`.
- `conartist` the `conartist` configuration as normally specified in a config
  file. Defaults to `{}`.
- `options` custom CLI options. Each key is the option name and each value can
  either be a `string` and will be the description, or it allows an object that
  may contain:
  - `alias` the option alias (i.e. `-a`).
  - `default` the default value.
  - `description` the option description.
  - `question` an
    [`inquirer` question object](https://github.com/SBoudrias/Inquirer.js/#question).
- `commands` custom CLI sub-commands. Each key is the command name and each
  value can either be a `string` and will be the description, or it allows:
  - `description` the command description.
  - `options` an object of options as described above for global options.

The following example creates a `npx license-mit` command.

#### `package.json`

```json
{
  "name": "license-mit",
  "description": "Creates and maintains an MIT license in your projects.",
  "author": "Your Name <you@yourdomain.com>",
  "version": "1.0.0",
  "bin": "."
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

#### Resulting `LICENSE`

```
Copyright 2019 Your Name <you@yourdomain.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

#### Testing

You can now test to see if your command works by running `npx .`:

```sh
$ npx . .
/path/to/cwd
  A LICENSE
```

#### Customize using CLI arguments

In the above example, the configuration is specified using an `object`. However,
you could also specify a function returning an `object` that gets the following
options passed in:

- `cli` the arguments parsed from the CLI. This allows you to add custom options
  and use them to generate your config.
- `cmd` the sub-command that was run. Defaults to `"default"`.
- `cwd` the current working directory that the config is running in.
- `opt` the options that you originally passed in to `bin(opt)`.

If you wanted to accept a custom `author`, you could set it up as an option and
default it to what's in the `package.json`.

```js
#! /usr/bin/env node

const { bin } = require("conartist");
const pkg = require("./package.json");

bin({
  ...pkg,
  options: {
    author: {
      alias: "a",
      default: pkg.author,
      description: "The package author."
    }
  },
  conartist: ({ cli }) => ({
    files: {
      LICENSE: `
        Copyright 2019 ${cli.author}

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      `
    }
  })
});
```

Now you can run:

```sh
$ npx . . -a "Custom Author"
/path/to/cwd
  A LICENSE
```

#### Accepting input via prompts

You could take this a step further and prompt the user for input if an option
isn't provided. It won't prompt the user for input if a `default` is provided,
so you must remove the default from the `option`. If you want to provide a
default for the question, then just add it as the `default` for the question, as
seen below.

```js
#! /usr/bin/env node

const { bin } = require("conartist");
const pkg = require("./package.json");

bin({
  ...pkg,
  options: {
    author: {
      alias: "a",
      description: "The package author.",
      question: {
        default: pkg.author,
        message: "What author should we use?"
      }
    }
  },
  conartist: ({ cli }) => ({
    files: {
      LICENSE: `
        Copyright 2019 ${cli.author}

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      `
    }
  })
});
```

Now when you run the command without the `--author` option, it will prompt you
to fill it in.

```sh
$ npx . .
? What author should we use? Your Name <you@yourdomain.com>
/path/to/cwd
  O LICENSE
```

#### Built-in features

The `bin` function automates quite a bit for you.

Running in specific directories:

```sh
$ npx . path/to/new path/to/existing
A path/to/new/LICENSE
U path/to/existing/LICENSE
```

Help:

```sh
$ npx . --help

  Description
    Creates and maintains an MIT license in your projects.

  Usage
    $ mit-license <command> [options]

  Available Commands
    default    Run the default configuration.

  For more info, run any command with the `--help` flag
    $ mit-license default --help

  Options
    -v, --version    Displays current version
    -h, --help       Displays this message

```

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
- `dry` perform a dry run (does not modify any files, just outputs what would
  happen to them).

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
