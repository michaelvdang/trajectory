import { NextRequest, NextResponse } from 'next/server';
import admin from '@/firebaseAdmin';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
        }

        const userDocRef = admin.firestore().doc('users/' + userId);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
            const data = userDoc.data();
            console.log("data: ", data);

            if (!data) {
                console.log("User data not found");
                return NextResponse.json({ error: "User data not found" });
            }

            const userData = {
                targetJob: data.targetJob,
                ...data.userData,
            };

            return NextResponse.json(userData);
        } else {
            console.log("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error fetching user data: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



export async function PATCH(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 });
        }

        const userDocRef = admin.firestore().doc('users/' + userId);
        const userDoc = await userDocRef.get();

        if (!userDoc.exists) {
            console.log("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userData = await req.json();
        console.log(userData);
        // Check if targetJob is being updated
        if (userData['target job'] !== undefined) {
            await userDocRef.update({ targetJob: userData['target job']});
        } else {
            // Update the nested fields inside the userData map
            const updates: { [key: string]: any } = {};
            for (const [key, value] of Object.entries(userData)) {
                if (key !== 'targetJob') {
                    updates[`userData.${key}`] = value;
                }
            }

            if (Object.keys(updates).length > 0) {
                await userDocRef.update(updates);
            }

        }
        return NextResponse.json({ message: "User data updated successfully" });


    } catch (error) {
        console.error("Error updating user data: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}