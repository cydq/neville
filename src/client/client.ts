import { Client, GatewayIntentBits } from "discord.js";
import { useCommands } from "scarf";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

useCommands(client);

export { client };
