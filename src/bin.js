const camelcase = require("camelcase");
const EventEmitter = require("events");
const inquirer = require("inquirer");
const map = require("lodash/map");
const merge = require("lodash/merge");
const os = require("os");
const path = require("path");
const pickBy = require("lodash/pickBy");
const sade = require("sade");
const { sync } = require("./sync");

function objectOrDescription(option, defaults) {
  return {
    ...defaults,
    ...(typeof option === "object" ? option : { description: option })
  };
}

function buildOption(name, option) {
  return [
    `--${name}${option.alias ? `, -${option.alias}` : ""}`,
    option.description,
    option.default
  ];
}

async function cli(opt) {
  return new Promise(resolve => {
    const questions = [];
    const cli = sade(opt.name)
      .describe(opt.description)
      .version(opt.version);

    // Global option registration.
    Object.keys(opt.options).forEach(o => {
      const option = objectOrDescription(opt.options[o]);
      cli.option(...buildOption(o, option));
    });

    // Command registration.
    Object.keys(opt.commands).forEach(c => {
      const command = objectOrDescription(opt.commands[c], {
        options: {}
      });

      cli.command(c, command.description, {
        default: c === "default"
      });

      cli.action(args => {
        // Camelcase all options.
        for (const arg in args) {
          const cc = camelcase(arg);
          if (!(cc in args)) {
            Object.defineProperty(args, cc, {
              enumerable: true,
              get() {
                return this[arg];
              }
            });
          }
        }

        // Ensure we ask questions for global options if not specified.
        Object.keys(opt.options).forEach(o => {
          const option = objectOrDescription(opt.options[o]);
          if (option.question && !(o in args)) {
            if (typeof option.question === "string") {
              option.question = {
                message: option.question
              };
            }
            questions.push({
              default: option.default,
              name: o,
              ...option.question
            });
          }
        });

        // Build command options.
        Object.keys(command.options).forEach(o => {
          const option = objectOrDescription(command.options[o]);
          cli.option(...buildOption(o, option));

          // Ensure we ask questions for command options if not specified.
          if (option.question && !(name in args)) {
            if (typeof option.question === "string") {
              option.question = {
                message: option.question
              };
            }
            questions.push({
              default: option.default,
              name,
              ...option.question
            });
          }
        });

        // An empty array of questions won't prompt, but will still resolve
        // to an empty array of answers.
        inquirer.prompt(questions).then(answers =>
          resolve({
            cli: { ...args, ...answers },
            cmd: c
          })
        );
      });
    });

    cli.parse(process.argv);
  });
}

const optDefault = {
  // CLI meta info.
  name: "",
  description: "",
  version: "0.0.0",

  // CLI commands / options.
  cli,
  options: {
    dry: {
      alias: "d",
      description: "Perform a dry run.",
      type: "boolean"
    }
  },
  commands: {
    default: "Run the default configuration."
  },

  // Conartist sync config.
  conartist: {}
};

async function bin(opt) {
  opt = merge(optDefault, opt);
  const { cli, cmd } = await opt.cli(opt);

  // We require at least one path to run in because it reduces confusion or fat-fingering.
  if (!cli._.length) {
    console.warn(
      "Please specify at least one directory to run conartist in. For more information, see --help."
    );
  }

  for (const cwd of cli._) {
    const events = new EventEmitter();
    events.once("file", () => console.log(path.resolve(cwd)));
    events.on("file", ({ action, file }) => console.log(`  ${action} ${file}`));
    events.on("info", info => console.log(info, os.EOL));
    events.on("warn", console.warn);
    await sync(opt.conartist, {
      cli,
      cmd,
      cwd,
      dry: cli.dry,
      events,
      opt
    });
  }
}

module.exports = {
  bin
};
