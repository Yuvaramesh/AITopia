import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import DiscussionRoom from '../../../models/DiscussionRoom';

// GET
// If the query contains an "id" parameter, returns a single discussion room.
// If it contains a "uid" parameter (and no id), returns all discussion rooms for that user.
export async function GET(req) {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    console.log("GET query parameters:", searchParams.toString());
    const id = searchParams.get('id');
    const uid = searchParams.get('uid');

    try {
        if (id) {
            const room = await DiscussionRoom.findById(id);
            if (!room) {
                return NextResponse.json({ message: 'Discussion room not found' }, { status: 404 });
            }
            return NextResponse.json(room, { status: 200 });
        } else if (uid) {
            const rooms = await DiscussionRoom.find({ uid }).sort({ createdAt: -1 });
            return NextResponse.json(rooms, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Missing id or uid query parameter' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error fetching discussion room(s):', error);
        return NextResponse.json(
            { message: 'Error fetching discussion room(s)', error: error.message },
            { status: 500 }
        );
    }
}

// POST
// Creates a new discussion room.
export async function POST(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { coachingOptions, topic, expertName, uid, language } = body;

        const newRoom = await DiscussionRoom.create({
            coachingOptions,
            topic,
            expertName: expertName || 'kore',
            uid,
            language
        });

        return NextResponse.json(newRoom, { status: 200 });
    } catch (error) {
        console.error('Error creating discussion room:', error);
        return NextResponse.json(
            { message: 'Error creating discussion room', error: error.message },
            { status: 500 }
        );
    }
}

// PATCH
// Updates an existing discussion room’s conversation and/or summary.
// The request body must include the room id along with at least one update field.
export async function PATCH(req) {
    await dbConnect();

    try {
        const body = await req.json();
        const { id, conversation, summery } = body;

        if (!id) {
            return NextResponse.json({ message: 'Missing room id' }, { status: 400 });
        }

        const updateFields = {};
        if (conversation !== undefined) updateFields.conversation = conversation;
        if (summery !== undefined) updateFields.summery = summery;

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ message: 'No update fields provided' }, { status: 400 });
        }

        const updatedRoom = await DiscussionRoom.findByIdAndUpdate(id, updateFields, { new: true });
        if (!updatedRoom) {
            return NextResponse.json({ message: 'Discussion room not found' }, { status: 404 });
        }
        return NextResponse.json(updatedRoom, { status: 200 });
    } catch (error) {
        console.error('Error updating discussion room:', error);
        return NextResponse.json(
            { message: 'Error updating discussion room', error: error.message },
            { status: 500 }
        );
    }
}