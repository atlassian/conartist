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
  }, { merge: true })),
  'package.json': json(() => ({
    dependencies: {
      'babel-preset-env': '*'
    }
  }));
};
```

As shown, each function must implement a particular format so conartist knows how to handle it.

When you run the `conartist` command, it will output a file for each config path you specify in the `exports`. For the above configuration, it will output both a `.babelrc` and a `package.json`.

Notice that both JSON files are using the `input()` function. This function returns any existing configuration for the specified format so that you can merge it with your defaults. This is a particularly powerful point because you can not only scaffold out a project, but also keep it in sync with any modifications you make.

### Formats

Formats are used by calling the format as a function and passing it a function that returns your configuration. For example:

```js
const { js } = require('conartist');

module.exports = {
  'package.json': js((file, input) => {

  })
};
```

The `file` argument is the filename you've specified. This is useful if you're not defining your formatter inline and the fucntion needs to somehow know the name of the file.

The `input` argument is a function that will return the existing configuration. You can use this to merge the existing state with whatever you're doing in your formatter.

Formats accept a second argument which is an object that can be used to configure the formatter.

#### `js`

The `js` format allows you to write a configuration using standard JavaScript. The formatter will output a file that points to the JavaScript you've written in your `conartist.js` file, as opposed to trying to stringify it. This means any stuff you use from the outer scope is still available to your config.

*Calling `input()` to get the file from dist doesn't make sense here because it points to itself, so it just returns `null` if you try it.*

#### `json`

The `json` format allows you to return a JavaScript object and it will try and conver it to JSON and write it to the corresponding file. The `input` function will give you a JavaScript object (it simply requires the current JSON file) so you can merge it however you see fit with the object you are returning.

*The `json` formatter merges the existing configuration with the new configuration by default. To turn this off, specify `{ merge: false }`.*

#### `string`

The `string` format allows you to return a string and it will write it as-is to the file. The `input` function returns you a string, so if you're going to merge the configs it is up to you to intelligently manage this.

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

### Custom formatters

You can write a custom formatter if you need to.

```js
const { createFormat } = require('conartist');

const myFormat = createFormat(class {
  get defaultOptions() {
    return { someValue: true };
  }
  input(file) {

  }
  output(file, merge) {
    if (this.options.someValue) {

    }
  }
});
```

You optionally define an `input()` function that takes the file being handled. It's responsibility is to take the current file contents and returned the transformed result. For example, in the `json` formatter we `require()` the file and return the result.

If you do not define `input()`, or the file does not exist, calling `input()` from your formatter function will return `null`.

The `output()` function is responsible for taking the `file` it's handling and returning the contents of the file that you want to write to disk. The `merge()` function will return the result of your fomatting function and you're responsible for transforming this to a string that can be saved to a file. For example, the `json` format will `JSON.stringify()` the result of this.
