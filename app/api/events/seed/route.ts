import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/database/event.model';

/**
 * POST /api/events/seed
 * Seeds the database with sample events for testing
 */
export async function POST() {
  try {
    await connectToDatabase();

    // Sample events with local images
    const sampleEvents = [
      {
        title: 'Next.js Developer Conference 2024',
        description: 'Join us for the biggest Next.js conference of the year! Learn from industry experts, network with fellow developers, and discover the latest features in Next.js 15.',
        overview: 'A full-day conference featuring talks, workshops, and networking opportunities for Next.js developers.',
        image: '/images/event1.png',
        venue: 'Tech Convention Center',
        location: 'San Francisco, CA',
        date: '2025-12-15',
        time: '09:00',
        mode: 'hybrid',
        audience: 'Web Developers, Full-Stack Engineers, Frontend Specialists',
        agenda: [
          'Registration and Breakfast (9:00 AM)',
          'Opening Keynote (10:00 AM)',
          'Technical Sessions (11:00 AM - 3:00 PM)',
          'Networking Break (3:00 PM)',
          'Panel Discussion (4:00 PM)',
          'Closing Remarks (5:00 PM)',
        ],
        organizer: 'Next.js Community',
        tags: ['nextjs', 'react', 'web-development', 'conference', 'javascript'],
      },
      {
        title: 'React Meetup Lagos',
        description: 'Monthly meetup for React developers in Lagos. Share knowledge, network, and build amazing things together.',
        overview: 'Casual evening meetup with talks, demos, and networking for React enthusiasts.',
        image: '/images/event2.png',
        venue: 'Co-Creation Hub',
        location: 'Lagos, Nigeria',
        date: '2025-11-20',
        time: '18:00',
        mode: 'offline',
        audience: 'React Developers, JavaScript Enthusiasts',
        agenda: [
          'Welcome and Introductions (6:00 PM)',
          'Lightning Talks (6:30 PM)',
          'Networking & Pizza (7:30 PM)',
        ],
        organizer: 'React Lagos Community',
        tags: ['react', 'meetup', 'javascript', 'frontend', 'lagos'],
      },
      {
        title: 'AI Hackathon 2024',
        description: 'Build the next generation of AI applications in 48 hours. Win prizes, learn from mentors, and connect with fellow innovators.',
        overview: '48-hour hackathon focused on building innovative AI-powered applications.',
        image: '/images/event3.png',
        venue: 'Innovation Lab',
        location: 'Online & Onsite',
        date: '2025-11-30',
        time: '10:00',
        mode: 'hybrid',
        audience: 'Developers, Data Scientists, AI Enthusiasts',
        agenda: [
          'Opening Ceremony (10:00 AM)',
          'Hacking Begins (11:00 AM)',
          'Mentor Sessions (Throughout)',
          'Final Presentations (Sunday 3:00 PM)',
          'Awards Ceremony (Sunday 5:00 PM)',
        ],
        organizer: 'TechHub Africa',
        tags: ['hackathon', 'ai', 'machine-learning', 'innovation'],
      },
    ];

    // Insert sample events individually to trigger pre-save hooks
    const createdEvents = [];
    for (const eventData of sampleEvents) {
      const event = await Event.create(eventData);
      createdEvents.push(event);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Successfully seeded ${createdEvents.length} events`,
        events: createdEvents.map(e => ({ title: e.title, slug: e.slug })),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/events/seed] Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to seed events',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/events/seed
 * Clears all events from the database (for testing)
 */
export async function DELETE() {
  try {
    await connectToDatabase();

    const result = await Event.deleteMany({});

    return NextResponse.json(
      {
        success: true,
        message: `Deleted ${result.deletedCount} events`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[DELETE /api/events/seed] Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete events',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
