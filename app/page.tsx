import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/database/event.model";

// Force dynamic rendering to prevent build-time data fetching
export const dynamic = 'force-dynamic';

const page = async () => {
  let events: IEvent[] = [];
  
  try {
    // Direct database query for server components
    await connectToDatabase();
    const eventsData = await Event.find().sort({ createdAt: -1 }).lean().exec();
    // Serialize the data to remove Mongoose metadata
    events = JSON.parse(JSON.stringify(eventsData)) as IEvent[];
  } catch (error) {
    console.error('Error fetching events:', error);
    // Return empty array on error to prevent page crash
    events = [];
  }
  
  return (
    <section>
     <h1 className="text-center">The Event for Every Dev <br /> You Dont Want to Miss!</h1>
     <p className="text-center mt-5">Hackathons, Meetups and Conferences, All in one place</p>

     <ExploreBtn />

     <div className="mt-20 space-y-7">
       <h3>Featured Events</h3>

       <ul className="events">
        {events && events.length > 0 ? (
          events.map((event: IEvent) => (
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
          ))
        ) : (
          <p className="text-center text-gray-500">No events available at the moment.</p>
        )}
       </ul>
     </div>
    </section>
  );
}

export default page
