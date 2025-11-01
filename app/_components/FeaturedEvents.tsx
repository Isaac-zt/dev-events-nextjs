import EventCard from "@/components/EventCard";
import { IEvent } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";
import { unstable_noStore as noStore } from "next/cache";

const FeaturedEvents = async () => {
  // Ensure per-request rendering, no static caches
  noStore();

  let events: IEvent[] = [];

  try {
    await connectToDatabase();
    const eventsData = await Event.find().sort({ createdAt: -1 }).lean().exec();
    events = JSON.parse(JSON.stringify(eventsData)) as IEvent[];
  } catch (error) {
    console.error('Error fetching events:', error);
    events = [];
  }

  if (!events || events.length === 0) {
    return <p className="text-center text-gray-500">No events available at the moment.</p>;
  }

  return (
    <ul className="events">
      {events.map((event: IEvent) => (
        <li key={event._id?.toString() || event.slug} className="list-none">
          <EventCard
            title={event.title}
            image={event.image}
            slug={event.slug}
            location={event.location}
            date={event.date}
            time={event.time}
          />
        </li>
      ))}
    </ul>
  );
}

export default FeaturedEvents;
