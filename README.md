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

## Usage

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

## API

All exported API points are documented below.

### `run(opt)` - automated CLI

The `run` function automates a lot of the boilerplate in creating a CLI tool.
It's intended to jump-start your ability for you to create a Conartist config
that can be run by simply typing `npx your-command`. This idea was borrowed from
https://www.npmjs.com/package/travis.yml.

A big bonus of doing things this way is that your consumers don't need
`conartist` to be installed and serveral commands can work in harmony even if
they depend on different versions of `conartist`.

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

### `sync(opt, cwd)` - programmatic config application

TBD
