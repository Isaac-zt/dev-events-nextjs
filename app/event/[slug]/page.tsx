import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { cacheLife } from "next/cache";
import { Suspense } from "react";
import EventDetailsContent from "./EventDetailsContent";

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

const Page = ({ params }: { params: Promise<{ slug: string }>}) => {
  return (
    <Suspense fallback={<p className="text-center text-gray-500">Loading event...</p>}>
      {/* Pass params through so request-specific data resolves within Suspense */}
      <EventDetailsContent params={params} />
    </Suspense>
  );
}

export default Page
