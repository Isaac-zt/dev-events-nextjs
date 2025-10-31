import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";

const EventDetailItem = ({ icon, alt, label} : { icon: string; alt: string; label: string; }) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const EventAgenda = ({ agendaItems } : { agendaItems: string[] }) => (
  <div className="agenda">
     <h2>Agenda</h2>
     <ul>
      {agendaItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
     </ul> 
  </div>
);

const EventTags = ({ tags } : {tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
     {tags.map((tag) => (
      <div className="pill" key={tag}>
        {tag}  
      </div>
     ))} 
  </div>
)

const EventDetails = async ({ params }: { params: Promise<{ slug: string }>}) => {
  const { slug } = await params;
  
  let event = null;
  
  try {
    await connectToDatabase();
    const eventData = await Event.findOne({ slug }).lean().exec();
    event = eventData ? JSON.parse(JSON.stringify(eventData)) : null;
  } catch (error) {
    console.error('Error fetching event:', error);
  }

  if(!event) return notFound();

  const bookings = 10;

  const { description, image, overview, date, time, location, mode, agenda, audience, tags, organizer } = event;

  const similarEventsData = await getSimilarEventsBySlug(slug);
  const similarEvents: IEvent[] = JSON.parse(JSON.stringify(similarEventsData));

  return (
    <section id="event">
     <div className="header">
        <h1>Event Description</h1>
        <p>{description}</p>
     </div>

     <div className="details">
       {/* left side- event content */}
        <div className="content">
          <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />

          <section className="flex-col-gap-2"> 
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />  
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />  
            <EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />  
            <EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />  
            <EventDetailItem icon="/icons/audience.svg" alt="audience" label={audience} />  
          </section>


          <EventAgenda agendaItems={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>
       {/* booking form- right side */}
       <aside className="booking">
        <div className="signup-card">
          <h2>Book Your Spot</h2>
          {bookings > 0 ? (
            <p className="text-sm">
              Join {bookings} people who have already booked their spot
            </p>
          ): (
            <p className="text-sm">Be the first to book your spot!</p>
          )}

          <BookEvent />
        </div>
       </aside>
     </div>

     <div className="flex w-full flex-col gap-4 pt-20">
       <h2>Similar Events</h2>
       {similarEvents.length > 0 ? (
         <ul className="events">
           {similarEvents.map((similarEvent: IEvent) => (
             <li key={similarEvent._id?.toString() || similarEvent.slug}>
               <EventCard 
                 title={similarEvent.title}
                 image={similarEvent.image}
                 slug={similarEvent.slug}
                 location={similarEvent.location}
                 date={similarEvent.date}
                 time={similarEvent.time}
               />
             </li>
           ))}
         </ul>
       ) : (
         <p className="text-center text-gray-500">No similar events found.</p>
       )}
     </div>
    </section>
  )
}

export default EventDetails
