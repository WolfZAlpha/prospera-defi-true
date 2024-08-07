import dbConnect from '@/lib/db';
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/User";
import { getDataFromToken } from "@/helpers/getDataFromToken";

export async function GET(request: NextRequest) {
    try {
        console.log('Attempting to connect to database for user info');
        await dbConnect();
        console.log('Connected to database successfully for user info');

        // Extract user ID from the authentication token
        const userId = await getDataFromToken(request);

        if (!userId) {
            return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
        }

        // Find the user in the database based on the user ID
        const user = await User.findOne({_id: userId}).select("-password");
        
        if (!user) {
            console.log(`User not found for ID: ${userId}`);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        console.log(`User info retrieved successfully for ID: ${userId}`);
        return NextResponse.json({
            message: "User found",
            data: user
        });
    } catch (error: any) {
        console.error('Error in /api/users/me:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}