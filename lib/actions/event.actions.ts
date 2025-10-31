'use server';

import Event from '@/database/event.model';
import connectToDatabase from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const event = await Event.findOne({ slug });

        if (!event) {
            console.error(`Event with slug "${slug}" not found`);
            return [];
        }

        // First, try to find events with matching tags
        const similarByTags = await Event.find({
            _id: { $ne: event._id },
            tags: { $in: event.tags }
        })
        .limit(3)
        .lean();

        // If we found similar events by tags, return them
        if (similarByTags.length > 0) {
            return similarByTags;
        }

        // Fallback: return other recent events if no tag matches
        return await Event.find({ _id: { $ne: event._id } })
            .sort({ createdAt: -1 })
            .limit(3)
            .lean();

    } catch (error) {
        console.error('Error fetching similar events:', error);
        return [];
    }
}
