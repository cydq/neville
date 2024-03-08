import {
  type AutocompleteInteraction,
  type ChatInputCommandInteraction,
  type Client,
  Collection,
  CommandInteraction,
  type ContextMenuCommandInteraction,
  EmbedBuilder,
  Events,
  type InteractionEditReplyOptions,
  type InteractionReplyOptions,
} from "discord.js";

import type { Command, CommandResult } from "scarf";
import { Err, Option } from "tsfy";
import type { ContextMenuCommand } from "./contextMenu.ts";

declare module "discord.js" {
  interface Client {
    commands: Collection<string, Command | ContextMenuCommand>;
  }
}

export function useCommands(client: Client) {
  client.commands = new Collection();

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = Option.from(interaction.client.commands.get(interaction.commandName)).expect(
      `No command matching ${interaction.commandName} was found.`,
    );

    let result: CommandResult;

    try {
      const chatInputInteraction: ChatInputCommandInteraction = interaction;
      result = await (command as Command).handle(chatInputInteraction);
    } catch (error) {
      result = Err({ message: "An unexpected error has occurred!" });
      console.error(error);
    }

    await checkError(result, interaction);
  });

  async function checkError(result: CommandResult, interaction: CommandInteraction) {
    if (result.isErr()) {
      const err = result.unwrapErr();
      if (err.quiet) return;

      const message = {
        embeds: [
          new EmbedBuilder().setTitle("❌ Error").setDescription(err.message).setColor(0xff0000),
        ],
        ephemeral: true,
      } satisfies InteractionEditReplyOptions & InteractionReplyOptions;

      if (interaction.deferred) await interaction.editReply(message);
      else if (interaction.replied) await interaction.followUp(message);
      else await interaction.reply(message);
    }
  }

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isContextMenuCommand()) return;

    const command = Option.from(interaction.client.commands.get(interaction.commandName)).expect(
      `No command matching ${interaction.commandName} was found.`,
    );

    let result: CommandResult;

    try {
      const contextMenuInteraction: ContextMenuCommandInteraction = interaction;
      result = await (command as ContextMenuCommand).handle(contextMenuInteraction);
    } catch (error) {
      result = Err({ message: "An unexpected error has occurred!" });
      console.error(error);
    }

    await checkError(result, interaction);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isAutocomplete()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      const autocompleteInteraction: AutocompleteInteraction = interaction;
      const result = await (command as Command).autocomplete(autocompleteInteraction);
      result.map((res) => interaction.respond(res));
    } catch (error) {
      await interaction.respond([]);
    }
  });
}
