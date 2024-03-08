import { createModule } from "scarf";
import { Events } from "discord.js";
import { Ok } from "tsfy";

export default createModule((client) => {
  client.once(Events.ClientReady, (client) => {
    console.log(`Ready as ${client.user.tag}!`);
  });

  return Ok();
});
