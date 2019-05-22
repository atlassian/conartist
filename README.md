# Conartist

Hate managing all your different config files across all your different
repositories? Great. Step into my office.

> Conartist is a tool that gives you a way to manage all of your config files
> from a single source of truth. Not only will it scaffold them out, it can also
> keep them in sync even if you modify them manually.

Major use cases:

- Keeping separate repos in sync.
- Keeping monorepo packages in sync.
- Scaffolding out new projects.

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

Any file that ends with `.js` can export a `function` or `object`. If it is a
function, any options you pass to the `conartist` command is passed into the
function as an object.

## Usage

If you put the following in a `package.json`.

```json
{
  "conartist": {
    ".gitignore": ["*.log", "node_modules"],
    ".nvmrc": "10.9.0",
    ".travis.yml": "language: node_js"
  }
}
```

Running `$ conartist` will create the specified files relative to the `cwd`.
This is great for scaffolding out a project or keeping it in sync with what the
configuration has in it.

However, running it again will overwrite the files. If you want to compose files
together, you can specify an object and a `{ compose }` option:

```json
{
  "conartist": {
    ".gitignore": ["*.log", "node_modules"],
    ".nvmrc": "10.9.0",
    ".travis.yml": "language: node_js"
  }
}
```
