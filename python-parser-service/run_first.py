import json
import os
from dotenv import load_dotenv
from openai import OpenAI
from pinecone import Pinecone

# Load environment variables
load_dotenv()

PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "trajectory-app"
NAME_SPACE = "ns1"

def load_sample_data():
    # Initialize OpenAI and Pinecone
    openai = OpenAI()
    pinecone = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))
    index = pinecone.Index(INDEX_NAME)

    model_name = "text-embedding-3-small"

    # Load jobs data from the JSON file
    with open("data/jobs.json") as file:
        jobs = json.load(file)

    for job in jobs:
        # Extract fields from the JSON object
        job_id = job['job_id']
        title = job['title']
        description = job.get('description', '')

        # Extract skill names from the skills_needed field
        skill_names = [skill['name'] for skill in job['skills_needed']]
        skills_text = " ".join(skill_names)

        # Extract and concatenate requirements and preferences
        requirements = " ".join(job.get('requirements', []))
        preferences = " ".join(job.get('preferences', []))

        # Combine all text fields for embedding creation
        combined_text = f"{title} {description} {skills_text} {requirements} {preferences}"

        # Create the embedding using OpenAI
        raw_embedding = openai.embeddings.create(
            input=[combined_text],
            model=model_name
        )
        embedding = raw_embedding.data[0].embedding

        # Insert the job into the Pinecone index
        index.upsert(
            vectors=[
                {
                    "id": job_id,
                    "values": embedding,
                    "metadata": {
                        "job_id": job_id,
                        "title": title,
                        "description": description,
                        "skills_needed": skill_names,  # List of strings (skill names)
                        "requirements": job.get('requirements', []),
                        "preferences": job.get('preferences', [])
                    }
                },
            ],
            namespace=NAME_SPACE
        )    

if __name__ == "__main__":
    load_sample_data()
