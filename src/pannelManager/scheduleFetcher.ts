import axios from "axios";
import { Collection, ComponentAssertions, Guild, GuildScheduledEvent, GuildScheduledEventStatus } from "discord.js";

export async function getTheLastEvent(guild: Guild): Promise<GuildScheduledEvent<GuildScheduledEventStatus> | null> {
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
				canceled: event.guild_scheduled_event_exceptions[0]?.is_canceled || false
			};
		});

		let id;

		if (eventsArray[0].canceled && eventsArray[1].canceled) {
			return null;
		} else if (eventsArray[0].canceled) {
			id = eventsArray[1].id;
		} else if (eventsArray[1].canceled) {
			id = eventsArray[0].id;
		} else {
			id = eventsArray[0].scheduledStartTime < eventsArray[1].scheduledStartTime ? eventsArray[0].id : eventsArray[1].id;
		}

		let event = await guild.scheduledEvents.fetch(id) as GuildScheduledEvent<GuildScheduledEventStatus>;
		return event;

	} catch (error) {
		console.error(error);
		return null;
	}





	// const events = await guild.scheduledEvents.fetch();

	// const eventsArray = Array.from(events.values());
	// eventsArray.sort((a, b) => a.scheduledStartTimestamp - b.scheduledStartTimestamp);
	// const mostRecentEvent = eventsArray[0];

	// console.log(eventsArray);

	// return mostRecentEvent;
}