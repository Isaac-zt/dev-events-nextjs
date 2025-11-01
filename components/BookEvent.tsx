'use client';

import { useState } from "react"
import { createBooking } from '../lib/actions/booking.actions';
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: 'string', slug: string; }) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const { success } = await createBooking({ eventId, slug, email });

        if(success) {
          setSubmitted(true);
          posthog.capture('event_booked', { eventId, slug, email });
        } else {
          console.error('Booking creation failed');
          posthog.captureException('Booking creation failed');
        }
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }
    }

  return (
    <div id='book-event'>
      {submitted ? (
        <p className="text-sm">Thank you for Signing Up!</p>
      ): (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email Address</label>
                <input type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Enter your email address"
                required
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            <button type="submit" className="button-submit">
                Submit
            </button>
        </form>
      )}
    </div>
  )
}

export default BookEvent
