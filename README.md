# Conartist

Hate managing all your different config files across all your different repositories? Great. Step into my office.

> Conartist is a tool that gives you a way to manage all of your config files from a single source of truth. Not only will it scaffold them out, it can also keep them in sync even if you modify them manually. It also gives you safe defaults for many popular tools out of the box with the `config` it exports.

## Install

```sh
npm install conartist
```

## Usage

Conartist works off of a single source of truth. This is in the form of a `conartist.js` config file. This file exports a configuration that Conartist uses to keep all of your configuration files in sync.

```js
const { config } = require('conartist');

module.exports = config({
  'package.json': {
    dependencies: {
      'babel-preset-env': '*'
    }
  }
});
```

The above configuration would output a `package.json` file with a single dependency. It will also ensure that if there's an existing `package.json` file that it's synchronised with the provided configuration.

### File type handlers

Specific types of files are handled differently. For example, the `package.json` is handled by a JSON handler.

#### `js`

The `js` handler outputs a file that calls the function you provide for the JS file. This means that you define your JS config as a function that can be called with no arguments.

```js
const { config } = require('conartist');

module.exports = config({
  'rollup.config.js' () {
    module.exports = {};
  }
});
```

#### `json`

The `json` handler takes an object and merges it with other like objects, recursively. If there is a configuration file by the same name in the current working directory, it is merged with the configuration and takes precedence over other configs.

```js
const { config } = require('conartist');
const { babel, base } = require('conartist/config');

module.exports = config(babel, base, {
  'package.json': {}
});
```

#### `string`

The `string` handler to provide a string and it will write it as-is to the file. If the file already exists, it's content is used instead. This ensures that no changes you make are lost.

```js
const { config } = require('conartist');

module.exports = config({
  'LICENSE': '...'
});
```

### Presets

Conartist ships with a few built-in presets.

#### `babel`

[TBD]

#### `base`

[TBD]

#### `flow`

[TBD]

#### `husky`

[TBD]

#### `jest`

[TBD]

#### `rollup`

[TBD]

#### `typescript`

[TBD]

### Custom handlers

Custom handlers are specified by simply modifying the `hanlders` object.

```js
const { handlers } = require('conartist');

handlers['*.yml'] = function handleYml(data, file) {};
```

The `data` argument is the content that was passed as the configuration for the specific `file`. The `file` argument is the configuration key that was passed. If you need to get contents of an existing file you can use `process.cwd()` along with `file` to get it.

You can return a straight value, use `async / await` or return a `Promise` from your handler.
