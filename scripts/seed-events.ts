import connectToDatabase from '../lib/mongodb';
import Event from '../database/event.model';

async function seedEvents() {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    // Clear existing events (optional)
    // await Event.deleteMany({});
    // console.log('Cleared existing events');

    // Sample event data
    const sampleEvent = {
      title: 'Next.js Developer Conference 2024',
      description: 'Join us for the biggest Next.js conference of the year! Learn from industry experts, network with fellow developers, and discover the latest features in Next.js 15.',
      overview: 'A full-day conference featuring talks, workshops, and networking opportunities for Next.js developers.',
      image: 'https://res.cloudinary.com/do2gtjpan/image/upload/v1234567890/DevEvent/sample-event.jpg',
      venue: 'Tech Convention Center',
      location: 'San Francisco, CA',
      date: '2024-12-15',
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
    };

    const event = await Event.create(sampleEvent);
    console.log('Sample event created:', event.slug);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedEvents();
