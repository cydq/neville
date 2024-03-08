import { ContextMenuCommandBuilder, ContextMenuCommandInteraction } from "discord.js";
import { type CommandResult, createModule } from "scarf";
import { Ok } from "tsfy";

export interface ContextMenuCommand {
  readonly builder: ContextMenuCommandBuilder;
  handle(interaction: ContextMenuCommandInteraction): Promise<CommandResult>;
}

export interface ContextMenuCommandOptions {
  data(builder: ContextMenuCommandBuilder): unknown;
  execute(interaction: ContextMenuCommandInteraction): CommandResult | Promise<CommandResult>;
}

export function createContextMenuCommand(options: ContextMenuCommandOptions) {
  const builder = new ContextMenuCommandBuilder();
  options.data(builder);

  return createModule((client) => {
    client.commands.set(builder.name, {
      get builder() {
        return builder;
      },

      handle: async (interaction: ContextMenuCommandInteraction) =>
        await options.execute(interaction),
    });

    return Ok();
  });
}
