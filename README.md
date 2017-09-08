# Conartist

Hate managing all your different config files across all your different repositories? Great. Step into my office.

*Conartist is a tool that gives you a way to manage all of your config files from a single source of truth. Not only will it scaffold them out, it can also keep them in sync even if you modify them manually. It also gives you safe defaults for many popular tools out of the box with the `config` it exports.*

## Install

```sh
npm install [to be decided]
```

## Usage

conartist works off of a single source of truth. This is in the form of a `conartist.js` config file. This file exports functions for each file it will manage. For example:

```js
const { json } = require('conartist');
const { merge } = require('lodash');
const path = require('path');

module.exports = {
  '.babelrc': json((file, input) => merge({
    presets: ['babel-preset-env']
  }, input())),
  'package.json': json((file, input) => merge({
    dependencies: {
      'babel-preset-env': '*'
    }
  }, input()));
};
```

As shown, each function must implement a particular format so conartist knows how to handle it.

When you run the `conartist` command, it will output a file for each config path you specify in the `exports`. For the above configuration, it will output both a `.babelrc` and a `package.json`.

Notice that both JSON files are using the `input()` function. This function returns any existing configuration for the specified format so that you can merge it with your defaults. This is a particularly powerful point because you can not only scaffold out a project, but also keep it in sync with any modifications you make.

### Presets

Operating on a single `conartist.js` file isn't maximising its potential. The real power comes when you want to reuse existing configs.

Taking the example config shown above, we can extend it and reuse it in multiple places.

```js
const { merge } = require('lodash');
const config = require('./conartist.js');

module.exports = merge({
  'package.json': json((file, input) => merge({
    dependencies: {
      'another-dependency': '*'
    }
  }, config['package.json'].merge(file), input()))
}, config);
```

Now when you run `conartist`, the configs are merged. This means that you can version your base config and share it across several-repositories and extend only the parts that you need to.

### Opting-out

You can also opt-out of using a part of a base config by overriding the config value with a `falsy` value:

```js
const baseConfig = {
  '.babelrc': json(() => ({})),
};
const userConfig = merge({
  '.babelrc': null,
  'tsconfig.json': json(() => ({}))
}, baseConfig);
```

This allows you to switch features on or off. Your base config can provide safe defaults for everything, and extensions to it can decide what it wants to take from it quite easily.
