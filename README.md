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

The `string` handler allows you to provide a string and it will write it as-is to the file. If the file already exists, it's content is used instead. This ensures that no changes you make are lost.

```js
const { config } = require('conartist');

module.exports = config({
  'LICENSE': '...'
});
```

#### Custom handler

A custom handler is just a function that takes two arguments and returns a string.

```js
function customHandler (configValue, fileName) {
  // Return the new file contents as a string.
}
```

You can then use the custom handler by overriding the default handler locator so that you can map the handler to a file.

```js
const { getHandlerLocator, setHandlerLocator } = require('conartist');

const currentHandlerLocator = getHandlerLocator();

setHandlerLocator(function(fileName, configValue) {
  const handler = currentHandlerLocator(fileName, configValue);

  if (handler) {
    return handler;
  }

  if (fileName === 'custom-file-type') {
    return customHandler;
  }
});
```

For more information on handler locators, see the section below.

#### Default handler locator

The default handler works something like the following:

```js
const { setHandlerLocator, js, json, string } = require('conartist');

setHandlerLocator(function (fileName, configValue) {
  const type = typeof configValue;
  if (type === 'function') return js;
  if (type === 'object') return json;
  if (type === 'string') return string;

  const extname = path.extname(fileName);
  if (extname === '.js') return js;
  if (extname === '.json') return json;

  const basename = path.basename(fileName);
  if (basename === '.babelrc') return json;
  if (basename === '.eslintrc') return json;
});
```

#### Custom handler locator

You can define a custom handler by calling `setHandlerLocator`:

```js
const { getHandlerLocator, setHandlerLocator } = require('conartist');

// If you want to reuse the existing handler locator.
const currentHandlerLocator = getHandlerLocator();

setHandlerLocator(function (fileName, configValue) {
  // Do your resolution here.
});
```

### Presets

Conartist ships with a few built-in presets. You can import these using `require('conartist/config')`.

#### `babel`

```js
const { config } = require('conartist');
const { babel } = require('conartist/preset');

module.exports = config(babel());
```

#### `base`

```js
const { config } = require('conartist');
const { base } = require('conartist/preset');

module.exports = config(base({
  // Your name to use in the LICENSE file.
  // Defaults to the current username.
  name: 'Trey Shugart',

  // The node version that should be used in the .nvmrc file.
  // Defaults to the current Node version.
  node: '8.4.0'
}));
```

#### `flow`

```js
const { config } = require('conartist');
const { flow } = require('conartist/preset');

module.exports = config(flow());
```

#### `husky`

```js
const { config } = require('conartist');
const { husky } = require('conartist/preset');

module.exports = config(husky());
```

#### `jest`

```js
const { config } = require('conartist');
const { jest } = require('conartist/preset');

module.exports = config(jest());
```

#### `rollup`

```js
const { config } = require('conartist');
const { rollup } = require('conartist/preset');

module.exports = config(rollup());
```

#### `typescript`

```js
const { config } = require('conartist');
const { typescript } = require('conartist/preset');

module.exports = config(typescript());
```
