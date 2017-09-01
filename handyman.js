const outdent = require("outdent");
const path = require("path");
const { any, js, json } = require(".");
const { merge } = require("lodash");

module.exports = {
  ".editorconfig": any(
    () => outdent`
    # EditorConfig helps developers define and maintain consistent
    # coding styles between different editors and IDEs
    # editorconfig.org

    root = true

    [*]
    # Change these settings to your own preference
    indent_style = space
    indent_size = 2

    # We recommend you to keep these unchanged
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true
  `
  ),
  ".flowconfig": any(
    () => outdent`
    [ignore]
    .*/\..*
    .*/docs/.*
    .*/es/.*
    .*/es-latest/.*
    .*/lib/.*
    .*/node_modules/.*
    .*/test/.*
    .*/umd/.*

    [include]
    ./src/

    [libs]

    [options]
    unsafe.enable_getters_and_setters=true
  `
  ),
  ".gitignore": any(
    () => outdent`
    /coverage
    /demo/dist
    /es
    /esnext
    /lib
    /node
    /node_modules
    /public
    /ts-output
    /umd
    npm-debug.log*
  `
  ),
  ".nvmrc": any(() => "7.9.0"),
  ".travis.yml": any(() => "language: node_js"),
  "package.json": json(() => {
    const pkg = require(path.join(process.cwd(), "package.json"));
    return merge(
      {
        dependencies: {
          "@skatejs/bore": "4.0.0",
          "@skatejs/ssr": "0.12.2",
          "@skatejs/val": "0.3.1",
          "babel-cli": "6.24.1",
          "babel-eslint": "7.2.3",
          "babel-plugin-modules-map": "1.0.0",
          "babel-plugin-modules-web-compat": "1.1.1",
          "babel-preset-env": "1.6.0",
          "babel-preset-es2015-rollup": "3.0.0",
          "babel-preset-latest": "6.24.1",
          "babel-preset-react": "6.24.1",
          "babel-preset-stage-0": "6.24.1",
          commitizen: "2.9.6",
          "cz-conventional-changelog": "2.0.0",
          "eslint-plugin-flowtype": "2.34.0",
          "get-typed": "1.0.0-beta.1",
          "highlight.js": "9.12.0",
          husky: "0.13.3",
          jest: "20.0.4",
          lodash: "4.17.4",
          "lint-staged": "4.0.2",
          nodemon: "1.11.0",
          outdent: "*",
          preact: "*",
          rollup: "0.47.4",
          "rollup-plugin-babel": "3.0.2",
          "rollup-plugin-uglify": "2.0.1",
          "semantic-release": "6.3.2",
          typescript: "2.3.3",
          "typescript-formatter": "5.2.0",
          "validate-commit-msg": "2.12.1",
          watchman: "0.1.8",
          yargs: "8.0.1"
        },
        jest: {
          modulePathIgnorePatterns: ["./node_modules"],
          setupFiles: ["./test/unit/setup"],
          setupTestFrameworkScriptFile: "./test/unit/setup-each",
          testEnvironment: "@skatejs/ssr/jest"
        },
        "lint-staged": {
          "*.(js|json)": ["prettier --write", "git add"]
        },
        scripts: {
          postinstall: "handyman"
        }
      },
      pkg
    );
  }),
  "rollup.config.js": js(() => {
    const babel = require("rollup-plugin-babel");
    const uglify = require("rollup-plugin-uglify");
    const yargs = require("yargs");
    const args = yargs.argv;
    return {
      dest: `umd/index${args.min ? ".min" : ""}.js`,
      entry: "src/index.js",
      external: ["preact"],
      format: "umd",
      globals: { preact: "preact" },
      moduleName: "skate",
      plugins: [babel(require("./config/babel.umd"))].concat(
        args.min ? uglify() : []
      ),
      sourceMap: true
    };
  }),
  "tsconfig.json": json(() => ({
    compilerOptions: {
      module: "es2015",
      target: "es2017",
      lib: ["dom", "es2017"],
      baseUrl: "./",
      strict: true,
      sourceMap: true,
      moduleResolution: "node",
      declaration: true,
      jsx: "react",
      jsxFactory: "h",
      pretty: true,
      outDir: "dist"
    },
    include: ["src/index.ts"],
    exclude: ["node_modules"]
  }))
};
