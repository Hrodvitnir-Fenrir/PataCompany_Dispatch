import { Guild, GuildScheduledEvent, GuildScheduledEventStatus } from "discord.js";

export async function getTheLastEvent(guild: Guild): Promise<GuildScheduledEvent<GuildScheduledEventStatus>> {
	const events = await guild.scheduledEvents.fetch();

	const eventsArray = Array.from(events.values());
	eventsArray.sort((a, b) => a.scheduledStartTimestamp - b.scheduledStartTimestamp);
	const mostRecentEvent = eventsArray[0];

	return mostRecentEvent;
}