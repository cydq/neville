import { createTextCommand } from "scarf";
import { EmbedBuilder } from "discord.js";
import { Err, Ok } from "tsfy";
import { getPlayer, Player } from "../../db/utils.ts";
import { tables } from "../../db/database.ts";

export default createTextCommand({
  data: (b) => {
    b.setName("ign").setDescription("Set IGN of a user");
    b.addUserOption((b) =>
      b.setName("user").setDescription("The user to update").setRequired(true),
    );
    b.addStringOption((b) =>
      b.setName("ign").setDescription("The IGN of the user").setRequired(true),
    );
  },

  async execute(interaction) {
    const target = interaction.options.getUser("user", true);
    const name = interaction.options.getString("ign", true);

    const player = await getPlayer(target);
    if (player.isNone()) return Err({ message: "This user is not registered!" });

    await tables.player.update([
      {
        id: player.unwrap().id,
        fields: { [Player.valorantTag]: name },
      },
    ]);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xcfff99)
          .setTitle(target.displayName)
          .setThumbnail(target.avatarURL() ?? target.defaultAvatarURL)
          .setDescription(`<@${target.id}>'s IGN is now set to \`${name}\``)
          .setFooter({ text: `User ID: ${target.id}` }),
      ],
      ephemeral: true,
    });

    return Ok();
  },
});
