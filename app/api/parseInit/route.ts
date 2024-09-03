import s3 from "@/services/s3/s3";
import uploadFilesS3 from "@/services/s3/uploadFilesS3";
import { GetObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import admin from '@/firebaseAdmin';
import { doc } from "firebase/firestore";
import generateSkillAssessments from "@/services/generateSkillAssessments";

interface SkillAssessment {
  [key: string]: number;
}

const Bucket = process.env.S3_BUCKET;

// download the file from s3 to next server, then send the file to localhost:8000
// but if we want to we can send just the directory and filename to localhost:8000 and download it there (requires aws-sdk python setup)
export async function POST (
  request: NextRequest,
  ) {
  const { userId, fileName } = await request.json();

  // use userId and fileName to establish s3 file path
  const filePath = `${userId}/${fileName}`;
  
  try {
    // // list bucket content
    // const response0 = await s3.send(new ListObjectsCommand({ Bucket }));
    // return NextResponse.json({ Contents: response0?.Contents ?? []});

    // // get file from s3 as a stream, convert to buffer, then to blob, then send to localhost:8000
    const s3Response = await s3.send(new GetObjectCommand({ Bucket, Key: filePath }));
    const stream = s3Response.Body;
    // Convert the stream to a buffer
    const chunks = [];
    for await (const chunk of stream as any) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);
    const blob = new Blob([fileBuffer], { type: 'application/pdf' });

    // Create FormData to hold the file buffer and additional attributes
    const formData = new FormData();
    formData.append('file', blob, fileName); // Attach the file with a filename
    formData.append('directory', userId);  // Attach additional data
    formData.append('fileName', fileName);         
    // // Send the file content to localhost:8000
    const parseResponse = await axios.post('http://localhost:8000/parse', formData, {
      headers: {
        'Content-Type': 'application/pdf',
      },
    });

    // console.log('parseResponse.data: ', parseResponse.data);

    const userData = {...parseResponse.data.userData};
    const topMatches = parseResponse.data.topMatches;

    // store languages and skills in firestore
    // store userData and topMatches in firestore, to be retrieved in matches page
    const userDocRef = admin.firestore().doc('users/' + userId);
    await userDocRef.set({userData, topMatches}, { merge: true });

    // get userData (languages, skills, experience, education, activities, projects, certifications) from parseResponse.data.userData and ask gpt to assess proficiency level to each job skill
    // get set of all job skills required from parseResponse.data.topMatches
    const jobSkills = []
    for (let i = 0; i < topMatches.length; i++) {
      for (let j = 0; j < topMatches[i].skills.length; j++) {
        jobSkills.push(topMatches[i].skills[j]);
      }
    }


    // move to new endpoint and let client send userData and jobSkills to generate assessments when landing on jobId page

    // have gpt assess user skills on each job skill based on userData
    const assessments = await generateSkillAssessments(userData, jobSkills); 

    // // store proficiency level in firestore under assessments collection, each skill is a doc with skill name
    // const userDocRef = admin.firestore().doc(`users/${userId}`);
    const batch = admin.firestore().batch();
    assessments.forEach(assessment => {
      // remove / and : from skill
      // const key = assessment[0].replace(/:/g, '').replace(/\//g, '');
      const data = {assessments: {
        [assessment[0]]: assessment[1]
      }};
      batch.set(userDocRef, data, { merge: true });
    })
    
    // const assessmentsColRef = admin.firestore().collection(`users/${userId}/assessments`);
    // // const batch = admin.firestore().batch();
    // assessments.forEach(assessment => {
    //   // remove / and : from skill
    //   const key = assessment[0].replace(/:/g, '').replace(/\//g, '');
    //   const docRef = assessmentsColRef.doc(key);
    //   const data = {score: assessment[1]};
    
    //   batch.set(docRef, data, { merge: true });
    // });

    await batch.commit();







    // user selects job, get job skills required
    // on client: redirect to job/[jobId] page to display job skills and current skills, send userId to get skills proficiency level and contrast with job skills
    
    return NextResponse.json({ ...parseResponse.data });
  }
  catch (error) {
    console.log('error: ', error);

    return new Response(JSON.stringify(error), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    })
  }
  
}