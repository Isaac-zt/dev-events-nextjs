import Image from "next/image";
import Link from "next/link";

interface Props {
  title?: string;
  image?: string;
  slug?: string;
  location?: string;
  date?: string;
  time?: string;
}

const EventCard = ({ title = '', image = '', slug = '', location = '', date = '', time = '' }: Props) => {
  // Fallback for empty or missing image URLs
  const imageSrc = image && image.trim() !== '' ? image : '/images/event1.png';
  const imageAlt = title || 'Event image';

  return (
    <Link href={`/event/${slug}`} id="event-card">
        <Image 
          src={imageSrc} 
          alt={imageAlt} 
          width={410} 
          height={300} 
          className="poster"
          priority={false}
        />
        
          <div className="flex flex-row gap-2">
            <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
            <p>{location}</p>

            <div className="datetime">
              <div>
                <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
                <p>{date}</p>
              </div>
               <div>
                <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
                <p>{time}</p>
              </div>
            </div>
          </div>

        <p className="title">{title}</p>
    </Link>

  );
}

export default EventCard
