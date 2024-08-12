import { ActivityType, Client, Events, Guild } from "discord.js";
import { config } from "dotenv";
import * as path from "path";
config({ path: path.resolve(__dirname, "..", ".env") });

export const client = new Client({ intents: ["Guilds"] });

client.once("ready", async () => {
	console.log(`Bot ${client.user.tag} is online.`);

	const guild = await client.guilds.fetch("897141056087404584");
	const events = await guild.scheduledEvents.fetch();

	console.log(events);
});

// Apparement les events ne sont pas encore supportés par discord.js

// client.once("guildScheduledEventUpdate", async (guild) => {
// 	console.log(guild);
// });

// client.once("guildScheduledEventDelete", async (guild) => {
// 	console.log(guild);
// });

// client.once("guildScheduledEventCreate", async (guild) => {
// 	console.log(guild);
// });

client.login(process.env.DISCORD_TOKEN);