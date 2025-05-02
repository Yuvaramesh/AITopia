import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const { name, email } = await req.json();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(existingUser, { status: 200 });
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            credits: 50000
        });

        return NextResponse.json(newUser, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
    }
}
