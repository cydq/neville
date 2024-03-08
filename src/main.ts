import { join } from "node:path";

import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { useCommands, loadModules } from "scarf";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

useCommands(client);

const result = await loadModules(client, [
  join(import.meta.dir, "commands"),
  join(import.meta.dir, "events"),
]);

if (result.isErr()) {
  console.error(result.unwrapErr());
  process.exit(1);
}

console.log(`Loaded ${result.unwrapOr(0)} modules!`);

const rest = new REST().setToken(import.meta.env.API_TOKEN!);

try {
  console.log(`Started refreshing ${client.commands.size} application (/) commands.`);

  const data = await rest.put(
    Routes.applicationGuildCommands(import.meta.env.API_CLIENT!, import.meta.env.API_GUILD!),
    { body: [...client.commands.values()].map((value) => value.builder.toJSON()) },
  );

  const length = typeof data === "object" && data !== null && "length" in data ? data.length : "";
  console.log(`Successfully reloaded ${length} application (/) commands.`);
} catch (error) {
  console.error(error);
}

await client.login(import.meta.env.API_TOKEN).catch(console.error);
