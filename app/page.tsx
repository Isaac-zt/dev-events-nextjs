import ExploreBtn from "@/components/ExploreBtn";
import { Suspense } from "react";
import FeaturedEvents from "./_components/FeaturedEvents";

const page = () => {
  return (
    <section>
     <h1 className="text-center">The Event for Every Dev <br /> You Dont Want to Miss!</h1>
     <p className="text-center mt-5">Hackathons, Meetups and Conferences, All in one place</p>

     <ExploreBtn />

     <div className="mt-20 space-y-7">
       <h3>Featured Events</h3>

       <Suspense fallback={<p className="text-center text-gray-500">Loading events...</p>}>
         <FeaturedEvents />
       </Suspense>
     </div>
    </section>
  );
}

export default page
