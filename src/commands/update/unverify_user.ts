import { createContextMenuCommand } from "scarf";
import {
  ApplicationCommandType,
  EmbedBuilder,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { getPlayer, Player } from "../../db/utils.ts";
import { tables } from "../../db/database.ts";
import { Err, Ok } from "tsfy";

export default createContextMenuCommand({
  data: (b) => {
    b.setName("Unverify").setType(ApplicationCommandType.User);
  },

  async execute(interaction) {
    const target = (interaction as UserContextMenuCommandInteraction).targetUser;

    const player = await getPlayer(target);
    if (player.isNone()) return Err({ message: `No player found for <@${target.id}>!` });

    const status = player.unwrap().fields[Player.status];
    if (status !== "Verified") return Err({ message: `<@${target.id}> is not verified!` });

    await tables.player.update([
      {
        id: player.unwrap().id,
        fields: { Status: "Unverified" },
      },
    ]);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xff99b1)
          .setTitle(target.displayName)
          .setThumbnail(target.avatarURL() ?? target.defaultAvatarURL)
          .setDescription(`<@${target.id}> is now unverified!`)
          .setFooter({ text: `User ID: ${target.id}` }),
      ],
      ephemeral: true,
    });

    return Ok();
  },
});
