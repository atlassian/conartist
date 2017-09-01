# Handyman

Hate managing all your different config files across all your different repositories? Great. Step into my office.

*Handyman is a tool that gives you functional way to manage all of your config files from a single source. It also gives you safe defaults for many popular tools out of the box.*

## Install

```sh
npm install [to be decided]
```

## Usage

Handyman works off of a single source of truth. This is in the form of a `handyman.js` config file. This file exports functions for each file it will manage. For example:

```js
const { json } = require('handyman');
const { merge } = require('lodash');
const path = require('path');

module.exports = {
  '.babelrc': json(() => ({
    presets: ['babel-preset-env']
  })),
  'package.json': json(() => merge({
    dependencies: {
      'babel-preset-env': '*'
    }
  }, require(path.join(process.cwd(), './package.json'))));
};
```

As shown, each function must implement a particular format so Handyman knows how to handle it.

When you run the `handyman` command, it will output a file for each config path you specify in the `exports`. For the above configuration, it will output both a `.babelrc` and a `package.json`.

Notice the `package.json` file is loading the current one and merging the configs. This is a particularly powerful point to this because it won't blow it away, but ensure that it, at least, has certain fields that you specify.

### Presets

Operating on a single `handyman.js` file isn't maximising its potential. The real power comes when you want to reuse existing configs.

Taking the example config shown above, we can extend it and reuse it in multiple places.

```js
const { merge } = require('lodash');
const config = require('./handyman.js');

module.exports = merge({
  'package.json': json(() => merge({
    dependencies: {
      'another-dependency': '*'
    }
  }, config['package.json']()))
}, config);
```

Now when you run `handyman`, the configs are merged. This means that you can version your base config and share it across several-repositories and extend only the parts that you need to.

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
