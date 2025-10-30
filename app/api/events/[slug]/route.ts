import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/database/event.model';
import { isValidObjectId } from 'mongoose';


// Type for route params in Next.js App Router
type RouteParams = {
  params: Promise<{
    slug: string;
  }>;
};

/**
 * GET /api/events/[slug]
 * Fetches a single event by its slug
 * 
 * @param request - Next.js request object
 * @param params - Route parameters containing the slug
 * @returns JSON response with event data or error message
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // Await params to access slug (Next.js 15+ requirement)
    const { slug } = await params;

    // Validate slug parameter exists
    if (!slug) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Slug parameter is required' 
        },
        { status: 400 }
      );
    }

    // Validate slug format (alphanumeric with hyphens, 1-200 characters)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug) || slug.length > 200) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens.' 
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Query event by slug with lean() for better performance
    const event = await Event.findOne({ slug }).lean().exec();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        { 
          success: false,
          message: `Event with slug "${slug}" not found` 
        },
        { status: 404 }
      );
    }

    // Return successful response with event data
    return NextResponse.json(
      { 
        success: true,
        message: 'Event fetched successfully',
        event 
      },
      { status: 200 }
    );

  } catch (error) {
    // Log error for debugging (in production, use proper logging service)
    console.error('[GET /api/events/[slug]] Error:', error);

    // Handle mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Validation error',
          error: error.message 
        },
        { status: 400 }
      );
    }

    // Handle mongoose cast errors (invalid ObjectId format)
    if (error instanceof Error && error.name === 'CastError') {
      return NextResponse.json(
        { 
          success: false,
          message: 'Invalid data format' 
        },
        { status: 400 }
      );
    }

    // Generic error response for unexpected errors
    return NextResponse.json(
      { 
        success: false,
        message: 'An unexpected error occurred while fetching the event',
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
