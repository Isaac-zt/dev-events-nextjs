import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import  connectToDatabase  from '@/lib/mongodb';
import Event from '@/database/event.model';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'do2gtjpan',
  api_key: process.env.CLOUDINARY_API_KEY || '115764828766778',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'gqkR0Qfchw0EihdQGtYiDq13OeU',
});

export async function POST(req: NextRequest) {  
    try {
        await connectToDatabase();

        const formData = await req.formData();

        let event;

        try {
            event = Object.fromEntries(formData.entries()); 
        } catch {
            return NextResponse.json({ message: 'Invalid JSON data format'}, { status: 400})    
        }

        const file = formData.get('image') as File;

        if(!file) {
            return NextResponse.json({ message: 'Image file is required'}, { status: 400})
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
           cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent'}, (error, result) => {
            if(error) return reject(error);
            resolve(result);
           }).end(buffer);     
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createEvent = await Event.create(event);

        return NextResponse.json({ message: 'Event Created Successfully', event: createEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ message: 'Event Creation failed', error: e instanceof Error ? e.message : 'Unknown' }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectToDatabase();

        const events = await Event.find().sort({ createdAt: -1 });

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Failed to fetch events', error: e }, { status: 500 });
    }
}