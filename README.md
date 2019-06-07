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
    ".gitignore": "*.log\nnode_modules",
    ".nvmrc": "10.9.0",
    ".travis.yml": "language: node_js"
  }
}
```

Running `$ conartist` will create the specified files relative to the `cwd`.
This is great for scaffolding out a project or keeping it in sync with what the
configuration has in it.

## Configuration

The `conartist` configuration can be:

- An `array` of values.
- An `object` of `name` / `data` pairs.
- A `function` that returns an array of values.

Each item in the configuration array must be one of the following:

- `array` where the first item in the array is anything that is valid here, and
  the second is the argument to be passed into the item if it's a function. This
  is similar to how you'd pass options to `babel` or `eslint` plugins.
- `function` that is executed in place with no arguments.
- `string` that it attempts to `require`. You can also do this yourself to
  ensure that relative paths resolve as you intend.
- `object` that is used as-is. This is what each item in the config `array` is
  normalized to.

The `object` shape looks like the following:

```js
type Item = {
  // The contents of the file that will be written to disk. If this is a
  // function, it overrides all other options and it is responsible for
  // returning a string. The item itself is passed in, so it receives the
  // options that were originally specified.
  data: string | (Item => string),

  // Whether or not to merge previous values, if supported. Defaults to
  // `false`.
  merge: boolean,

  // The name of the file that will be written to disk. This is the file you
  // specified in your configuration prefixed with the `cwd` that this
  // configuration is being run in.
  name: string,

  // Whehter or not to overwrite previous values, if supported. Defaults to
  // `false`.
  overwrite: boolean,

  // Speicfies how the data should be transformed. If this is a function, it
  // behaves similarly to `data` but it's required to use `data` and return
  // it as a string.
  //
  // By default, `type` is inferred from the `extname` of the `name` option.
  //
  // If no type can be inferred and one is not specified, the value is
  // coerced to a string.
  type: "js" | "jsx" | "json" | "md" | "mdx" | (Item => string)
};
```

### Built-in data types

These types correspond to the `extname` of the `name` option, or can be
explicitly specified as a `type`.

- `js` takes `data` as a `string` and formats it using `prettier`.
  - `{ overwrite: false }` Existing file is preserved.
  - `{ overwrite: true }` New data overwrites existing file.
- `jsx` alias for `js`.
- `json` takes `data` as JSON and stringifies it.
  - `{ merge: false, overwrite: false }` prefers existing values.
  - `{ merge: false, overwrite: true }` prefers new values.
  - `{ merge: true, overwrite: false }` merges values, preferring existing
    values.
  - `{ merge: true, overwrite: true }` merge values, preferring new values.
- `md` takes `data` as a string and formats it using `prettier`.
  - `{ overwrite: false }` Existing file is preserved.
  - `{ overwrite: true }` New data overwrites existing file.
- `mdx` alais for `md`.

### Config as an object

If the configuration is specified as an `object`, it is normalized to an `array`
where the key becomes the `name` option and the value becomes the `data` option.

For example:

```json
{
  ".nvmrc": "10.16.0"
}
```

Would be normalized to:

```json
[
  {
    "name": ".nvmrc",
    "data": "10.16.0"
  }
]
```

### Config as a function

If you specify the configuration as a function that returns an `array`, it will
receive arguments that you can use to customize the returned `array`.

When running `conartist` from the CLI:

- `cli` is the options passed in via the CLI. The CLI allows arbitrary options
  and they will be passed in as specified by the caller.
- `cwd` is the directory that the configuration is being run in. This defaults
  to `process.cwd()` but can be specified as an array by `stdin` delimmited with
  `\n` or `--cwd` delimmited by `,`. It normalize and run the configuration for
  each cwd that is specified.
- `opt` is any other metadata passed in by the CLI runner. This can be useful
  when creating your own CLI runner with `run()`.

## API

All exported API points are documented below.

### `async run(opt)` - automated CLI

The `run` function automates a lot of the boilerplate in creating a CLI tool.
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

const { run } = require("conartist");
const pkg = require("./package.json");

run({
  ...pkg,
  conartist: [
    {
      name: "LICENSE",
      data: `
        Copyright 2019 ${pkg.author}

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      `
    }
  ]
});
```

As seen above, the configuration is specified using an `array`. However, you
could also specify a function that gets the following options passed in:

- `cli` the arguments parsed from the CLI. This allows you to add custom options
  and use them to generate your config.
- `cwd` the current working directory that the config is running in.
- `opt` the options that you originally passed in to `run(opt)`.

You could rewrite the above like so:

```js
#! /usr/bin/env node

const { run } = require("conartist");

run({
  ...require("./package.json"),
  conartist: ({ opt }) => [
    {
      name: "LICENSE",
      data: `
        Copyright 2019 ${opt.author}

        Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      `
    }
  ]
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

The `run` function uses [`meow`](https://github.com/sindresorhus/meow) under the
hood, so it automates quite a bit for you.

Help:

```sh
$ npx . --help

  Creates and maintains an MIT license in your projects.

  Usage
    $ license-mit

  Options
    --cwd Set the cwd.

```

Options:

- `[stdin]` A newline separated list of directories to run the config in.
- `--cwd` A comma separated list of directories to run the config in.

_Both `[stdin]` and `--cwd` are supported by default as a way to either pipe or
supply paths to `conartist`. If both are provided they are merged together and
it is run on all provided paths. If none are provided, then `.` is used._

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
  [
    {
      name: ".travis.yml",
      data: "language: node_js"
    }
  ],
  {
    cwd: "packages/sub-package"
  }
);
```

Just like with `run`, if you specify a function as `cfg`, the options you pass
in are passed to it:

```js
const { sync } = require("conartist");

sync(
  ({ language }) => [
    {
      name: ".travis.yml",
      data: `language: ${language}`
    }
  ],
  {
    language: "node_js"
  }
);
```
