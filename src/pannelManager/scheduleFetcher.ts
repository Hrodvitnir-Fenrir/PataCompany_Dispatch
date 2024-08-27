import axios from "axios";
import { Collection, ComponentAssertions, Guild, GuildScheduledEvent, GuildScheduledEventStatus } from "discord.js";

export interface eventStructure {
	id: string;
	scheduledStartTime: number;
	canceled: boolean;
	name: string;
}

export async function getTheLastEvent(guild: Guild): Promise<eventStructure | null> {
	try {
		const events = await axios.get(
			`https://discord.com/api/guilds/${guild.id}/scheduled-events`,
			{
				headers: {
					Authorization: "Bot " + process.env.DISCORD_TOKEN
				}
			}
		).then(res => res.data);

		const eventsArray = await events.map((event: any) => {
			return {
				id: event.id,
				scheduledStartTime: event.guild_scheduled_event_exceptions[0]?.scheduled_start_time ? Date.parse(event.guild_scheduled_event_exceptions[0].scheduled_start_time) : Date.parse(event.scheduled_start_time),
				canceled: event.guild_scheduled_event_exceptions[0]?.is_canceled || false,
				name: event.name
			};
		});

		console.log(eventsArray);

		eventsArray.sort((a, b) => a.scheduledStartTime - b.scheduledStartTime);

		for (const event of eventsArray) {
			if (!event.canceled) {
				return event;
			}
		}
		return null;
	} catch (error) {
		console.error(error);
		return null;
	}
}