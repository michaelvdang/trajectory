import { NextRequest, NextResponse } from "next/server";

export async function POST (
  request: NextRequest,
  ) {
    const { userData, missingSkills } = await request.json();
    console.log("missingSkills: ", missingSkills);
    console.log("userData: ", userData);

    return NextResponse.json({ userData, missingSkills });
    
}