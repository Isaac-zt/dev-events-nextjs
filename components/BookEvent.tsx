'use client';

import { useState } from "react"

const BookEvent = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate email
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setTimeout(() => {
            setSubmitted(true);
        }, 1000)
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
