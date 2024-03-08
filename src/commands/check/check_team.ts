import { createTextCommand } from "scarf";
import { EmbedBuilder, GuildMember, type RoleResolvable } from "discord.js";
import { Err, Ok } from "tsfy";
import { getPlayer, getTeam, Player } from "../../db/utils.ts";

export default createTextCommand({
  data: (b) => {
    b.setName("check").setDescription("Check the status of a team");
    b.addRoleOption((b) => b.setName("team").setDescription("The team to check").setRequired(true));
  },

  async execute(interaction) {
    const target = interaction.options.getRole("team", true);

    const team = await getTeam(target as RoleResolvable);
    if (team.isNone()) return Err({ message: "This team is not registered!" });

    await interaction.deferReply({ ephemeral: true });
    await interaction.guild?.members.fetch();

    const role = await interaction.guild?.roles.fetch(target.id);
    if (!role) return Err({ message: "Could not find role!" });

    const embed = new EmbedBuilder().setColor(0xf7ff99).setTitle(role.name);

    const format = (user: Player, member: GuildMember) => {
      const verified = user[Player.status] === "Verified";

      return `${verified ? "🟢" : "🔴"} <@${member.id}>\n🪪 **Verified:** ${verified ? "Yes" : "No"}\n👤 **IGN:** \`${user[Player.valorantTag] ?? "N/A"}\``;
    };

    const formats: string[] = [];

    for (const member of role.members.values())
      (await getPlayer(member)).map((user) => formats.push(format(user.fields, member)));

    const left = formats.slice(0, formats.length / 2);
    const right = formats.slice(formats.length / 2);

    for (const e of [left, right]) {
      if (e.length < 1) continue;

      embed.addFields({
        name: String.fromCharCode(8203),
        value: e.join("\n\n"),
        inline: true,
      });
    }

    await interaction.editReply({ embeds: [embed] });

    return Ok();
  },
});
