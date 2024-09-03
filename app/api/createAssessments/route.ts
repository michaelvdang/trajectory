import admin from "@/firebaseAdmin";
import generateSkillAssessments from "@/services/generateSkillAssessments";
import { NextRequest, NextResponse } from "next/server";

type Assessment = [string, number]

export async function POST (
  request: NextRequest,
  ) {
    const { userData, missingSkills } = await request.json();

    const assessments : Assessment[] = await generateSkillAssessments(userData, missingSkills);

    console.log('createAssessments: ', assessments);

    return NextResponse.json({ assessments });
    
}