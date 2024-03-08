import {
  type ApplicationCommandOptionChoiceData,
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { type CommandHandleError, createModule } from "scarf";
import { None, Ok, type Option, type Result } from "tsfy";

export type CommandResult = Result<void, CommandHandleError>;
export type AutocompleteResult = Option<ApplicationCommandOptionChoiceData[]>;

export interface Command {
  readonly builder: SlashCommandBuilder;
  handle(interaction: ChatInputCommandInteraction): Promise<CommandResult>;
  autocomplete(interaction: AutocompleteInteraction): Promise<AutocompleteResult>;
}

export interface CommandOptions {
  data(builder: SlashCommandBuilder): unknown;
  execute(interaction: ChatInputCommandInteraction): CommandResult | Promise<CommandResult>;
  autocomplete?(interaction: AutocompleteInteraction): Promise<AutocompleteResult>;
}

export function createTextCommand(options: CommandOptions) {
  const builder = new SlashCommandBuilder();
  options.data(builder);

  return createModule((client) => {
    client.commands.set(builder.name, {
      get builder() {
        return builder;
      },

      handle: async (interaction: ChatInputCommandInteraction) =>
        await options.execute(interaction),

      autocomplete: async (interaction: AutocompleteInteraction) =>
        options.autocomplete ? await options.autocomplete(interaction) : None,
    });

    return Ok();
  });
}
