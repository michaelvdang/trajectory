import admin from '../firebaseAdmin.js';
import jobList from '../python-parser-service/data/jobs.json' with {type: 'json'};

const db = admin.firestore();

export const initFirestore = async () => {
  const jobsRef = db.collection('jobs');

  try {
    const batch = db.batch();
    for (const job of jobList) {
      const jobRef = jobsRef.doc(job.job_id);
      batch.set(jobRef, job);
    }
    await batch.commit();
    
  } catch (error) {
    console.log('Error getting documents: ', error);
  }
}

await initFirestore()