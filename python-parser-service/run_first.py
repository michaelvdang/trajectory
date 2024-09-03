
import json
import os

from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone


PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "trajectory-app"
NAME_SPACE = "ns1"

load_dotenv()

def load_sample_data():
    load_dotenv()

    openai = OpenAI()
    pinecone = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
    pinecone_index = "trajectory-app"
    namespace = "ns1"
    index = pinecone.Index(pinecone_index)

    model_name = "text-embedding-3-small"


    jobs = json.loads(open("data/jobs.json").read())

    print('jobs: ', jobs)

    for job in jobs:
        # Inserts the complaint into the Pinecone index with the complaint text as the vector
        job_id = job['job_id']
        title = job['title']
        skills = job['skills_needed']

        skills_text = " ".join(skills)

        # Create the embedding for the complaint text
        raw_embedding = openai.embeddings.create(
            input=[skills_text],
            model=model_name
        )
        embedding = raw_embedding.data[0].embedding

        # Insert the complaint into the Pinecone index
        index.upsert(
            vectors=[
                {
                    "id": job_id,
                    "values": embedding,
                    "metadata": {
                        "job_id": job_id,
                        "title": title,
                        "skills": skills
                    }
                },
            ],
            namespace=namespace
        )    

if __name__ == "__main__":
    load_sample_data()