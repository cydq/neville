import { createContextMenuCommand } from "scarf";
import {
  ApplicationCommandType,
  EmbedBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { tables } from "../../db/database.ts";
import { Err, Ok } from "tsfy";
import { getPlayer, Player } from "../../db/utils.ts";

export default createContextMenuCommand({
  data: (b) => {
    b.setName("Verify").setType(ApplicationCommandType.User);
  },

  async execute(interaction) {
    const target = (interaction as UserContextMenuCommandInteraction).targetUser;

    const player = await getPlayer(target);
    if (player.isNone()) return Err({ message: `No player found for <@${target.id}>!` });

    const status = player.unwrap().fields[Player.status];
    if (status === "Verified") return Err({ message: `<@${target.id}> is already verified!` });

    await tables.player.update([
      {
        id: player.unwrap().id,
        fields: { Status: "Verified" },
      },
    ]);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xcfff99)
          .setTitle(target.displayName)
          .setThumbnail(target.avatarURL() ?? target.defaultAvatarURL)
          .setDescription(`<@${target.id}> is now verified!`)
          .setFooter({ text: `User ID: ${target.id}` }),
      ],
      ephemeral: true,
    });

    return Ok();
  },
});
