# Conartist

Hate managing all your different config files across all your different repositories? Great. Step into my office.

> Conartist is a tool that gives you a way to manage all of your config files from a single source of truth. Not only will it scaffold them out, it can also keep them in sync even if you modify them manually. It also gives you safe defaults for many popular tools out of the box with the `config` it exports.

## Install

```sh
npm install conartist
```

## Usage

Conartist works off of a single source of truth. This is in the form of a `conartist.js` config file. This file exports a formatter for each file it needs to manage. The formats are defined by calling a function and passing it a function that returns the configuration for the specified format.

```js
const { json } = require('conartist');
const path = require('path');

module.exports = {
  '.babelrc': json(() => ({
    presets: ['babel-preset-env']
  })),
  'package.json': json(() => ({
    dependencies: {
      'babel-preset-env': '*'
    }
  }));
};
```

As shown, each function must implement a particular format so conartist knows how to handle it.

When you run the `conartist` command, it will output a file for each config path you specify in the `exports`. For the above configuration, it will output both a `.babelrc` and a `package.json`.

### Formats

Formats are used by calling the format as a function and passing it a function that returns your configuration. For example:

```js
const { js } = require('conartist');

module.exports = {
  'package.json': json(({ data, file }) => {

  })
};
```

The `data` argument contains the existing file data. You can use this to merge the existing state with whatever you're doing in your formatter.

The `file` argument is the filename you've specified. This is useful if you're not defining your formatter inline and the function needs to somehow know the name of the file.

Formats accept a second argument which is an object that can be used to configure the formatter, if it specifies any.

#### `js`

The `js` format allows you to write a configuration using standard JavaScript. The formatter will output a file that points to the JavaScript you've written in your `conartist.js` file, as opposed to trying to stringify it. This means any stuff you use from the outer scope is still available to your config.

#### `json`

The `json` format allows you to return a JavaScript object and it will try and convert it to JSON and write it to the corresponding file. The `data` accessor will give you a JavaScript object (it simply requires the current JSON file) so you can merge it however you see fit with the object you are returning.

#### `string`

The `string` format allows you to return a string and it will write it as-is to the file. The `data` argument gives you a string representing the current state of the file if you need it.

### Presets

Operating on a single `conartist.js` file isn't maximising its potential. The real power comes when you want to reuse existing configs. Taking the example config shown above, we can extend it and reuse it in multiple places.

```js
const { json, merge, value } = require('conartist');
const customConfig = require('./custom-conartist-config');
const pkg = value(customConfig, 'package.json');

module.exports = merge(customConfig, {
  'package.json': json(({ data }) => merge(pkg, data, {
    dependencies: merge(data.dependencies, {
      'another-dependency': '*'
    })
  }))
}, config);
```

Now when you run `conartist`, the configs are merged, but only where you've opted into it. This yields less surprises and unexpected behaviour. You can use something like `lodash.merge` if you want to recursively merge objects. This means that you can version your base config and share it across several-repositories and extend only the parts that you need to.

### Opting-out

You can also opt-out of using a part of a base config by overriding the config value with a `falsy` value:

```js
const baseConfig = {
  '.babelrc': json(() => ({})),
};
const userConfig = Object.assign({
  '.babelrc': null,
  'tsconfig.json': json(() => ({}))
}, baseConfig);
```

This allows you to switch features on or off. Your base config can provide safe defaults for everything, and extensions to it can decide what it wants to take from it quite easily.

### Custom formatters

You can write a custom formatter if you need to.

```js
const { createFormat } = require('conartist');

const myFormat = createFormat(class {
  // This is optional and is merged with any options
  // passed to the format as the second argument:
  //
  // myFormat(configFunction, optionsObject)
  get defaultOptions() {
    return { someValue: true };
  }

  // This is optional, too.
  input({ file }) {

  }

  // You're always going to be specifying this
  // because it is the core of the formatter.
  output({ data, file }) {
    // Options are available as this.options.
    if (this.options.someValue) {

    }
  }
});
```

You optionally define an `input()` function that takes the file being handled. It's responsibility is to take the current file contents and returned the transformed result. For example, in the `json` formatter we `require()` the file and return the result.

If you do not define `input()`, or the file does not exist, calling `input()` from your formatter function will return `null`.

The `output()` function is responsible for taking the `file` it's handling and returning the contents of the file that you want to write to disk. The `data` argument is the result of your formatting function and you're responsible for transforming this to a string that can be saved to a file. For example, the `json` format will do `JSON.stringify(data)`.
