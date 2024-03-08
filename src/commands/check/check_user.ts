import {
  EmbedBuilder,
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
} from "discord.js";
import { Err, Ok } from "tsfy";
import { getPlayer, Player } from "../../db/utils.ts";
import { createContextMenuCommand } from "scarf";

export default createContextMenuCommand({
  data: (b) => {
    b.setName("Check").setType(ApplicationCommandType.User);
  },

  async execute(interaction) {
    const target = (interaction as UserContextMenuCommandInteraction).targetUser;
    const player = await getPlayer(target);

    if (player.isNone()) return Err({ message: "This user is not registered!" });
    const { [Player.status]: status, [Player.valorantTag]: name } = player.unwrap().fields;

    const verified = status === "Verified";

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(verified ? 0xcfff99 : 0xff99b1)
          .setTitle(target.displayName)
          .setThumbnail(target.avatarURL() ?? target.defaultAvatarURL)
          .setDescription(
            `🔗 **Mention:** <@${target.id}>\n🪪 **Verified:** ${verified ? "Yes" : "No"}\n👤 **IGN:** \`${name ?? "N/A"}\``,
          )
          .setFooter({ text: `User ID: ${target.id}` }),
      ],
      ephemeral: true,
    });

    return Ok();
  },
});
