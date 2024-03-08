// import { createTextCommand } from "scarf";
// import { EmbedBuilder, Role } from "discord.js";
// import { prisma } from "../../db/database.ts";
// import { Ok } from "tsfy";
// import { unreachable } from "tsfy/types";

// export default createTextCommand({
//   data: (b) =>
//     b
//       .setName("teams")
//       .setDescription("Manage teams")
//       .setDefaultMemberPermissions(0)
//       .addSubcommand((b) => b.setName("list").setDescription("List all registered teams"))
//       .addSubcommand((b) =>
//         b
//           .setName("add")
//           .setDescription("Register a team")
//           .addRoleOption((b) =>
//             b.setName("team").setDescription("The team to add").setRequired(true),
//           ),
//       )
//       .addSubcommand((b) =>
//         b
//           .setName("remove")
//           .setDescription("Unregister a team")
//           .addRoleOption((b) =>
//             b.setName("team").setDescription("The team to remove").setRequired(true),
//           ),
//       ),
//
//   async execute(interaction) {
//
//     // await interaction.deferReply({ ephemeral: true });
//     //
//     // const subcommand = interaction.options.getSubcommand();
//     //
//     // if (subcommand === "list") {
//     //   const teams = await prisma.team.findMany();
//     //
//     //   await interaction.editReply({
//     //     embeds: [
//     //       new EmbedBuilder()
//     //         .setColor(0xeb99ff)
//     //         .setTitle("All teams")
//     //         .setDescription(
//     //           teams.length > 0 ? teams.map((team) => `- <@&${team.id}>`).join("\n") : "No teams",
//     //         ),
//     //     ],
//     //   });
//     //
//     //   return Ok();
//     // }
//     //
//     // // @ts-expect-error get role should work
//     // const team: Role = interaction.options.getRole("team", true);
//     //
//     // if (subcommand === "add") {
//     //   await prisma.team.create({
//     //     data: {
//     //       snowflake: team.id,
//     //       name: team.name,
//     //       tag: team.name,
//     //     },
//     //   });
//     //
//     //   await interaction.editReply({
//     //     embeds: [
//     //       new EmbedBuilder()
//     //         .setColor(0xeb99ff)
//     //         .setTitle("Add team")
//     //         .setDescription(`Added team <@&${team.id}>`),
//     //     ],
//     //   });
//     //
//     //   return Ok();
//     // }
//     //
//     // if (subcommand === "remove") {
//     //   await prisma.team.delete({ where: { snowflake: team.id } });
//     //
//     //   await interaction.editReply({
//     //     embeds: [
//     //       new EmbedBuilder()
//     //         .setColor(0xeb99ff)
//     //         .setTitle("Remove team")
//     //         .setDescription(`Removed team <@&${team.id}>`),
//     //     ],
//     //   });
//     //
//     //   return Ok();
//     // }
//     //
//     // unreachable();
//   },
// });
