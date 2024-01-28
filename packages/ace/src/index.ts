import { Kernel, ListLoader, HelpCommand, BaseCommand, FsLoader } from "@adonisjs/ace";

export { args, flags, cliHelpers, BaseCommand } from "@adonisjs/ace";

export function createKernel() {
  const kernel = Kernel.create();

  kernel.addLoader(new ListLoader([HelpCommand]));

  kernel.defineFlag("help", {
    type: "boolean",
    alias: "h",
    description: "Display help for the given command. When no command is given display help for the list command",
  });

  kernel.defineFlag("ansi", {
    type: "boolean",
    showNegatedVariantInHelp: true,
    description: "Enable/disable colorful output",
  });

  kernel.on("ansi", (_, $kernel, options) => {
    if (options.flags.ansi === false) {
      $kernel.ui.switchMode("silent");
    }

    if (options.flags.ansi === true) {
      $kernel.ui.switchMode("normal");
    }
  });

  kernel.on("help", async (command, $kernel, options) => {
    options.args.unshift(command.commandName);
    await new HelpCommand($kernel, options, kernel.ui, kernel.prompt).exec();
    return true;
  });

  kernel.info.set("binary", "node ace");

  return {
    kernel,
    handle: async (args?: string[]) => {
      await kernel.handle(args ?? process.argv.splice(2));
    },
    loadCommands(commands: (typeof BaseCommand)[]) {
      kernel.addLoader(new ListLoader(commands));
    },
    loadCommandsFromFs(commandsPath: string) {
      kernel.addLoader(new FsLoader(commandsPath));
    },
  };
}
