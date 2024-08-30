from dotenv import load_dotenv
from fastapi import FastAPI, Request, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import sys
import uvicorn
from pypdf import PdfReader
import requests 
import json 
from utils.Formatter import Formatter
from utils.TextCleaner import TextCleaner
import os

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/parse")
async def get_image(file: UploadFile = File(...),
    directory: str = Form(...),
    fileName: str = Form(...)
    ):

    # Save the file locally
    if not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)
    file_path = os.path.join(directory, fileName)
    print('file_path: ', file_path)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # return {'message': 'success'}
    # # parse resume
    ## use resume parser to get json
    resume_text = parse_resume(file_path)

    print(resume_text)

    resume_json = {
        'languages': resume_text.languages,
        'skills': resume_text.skills,
        'experiences': resume_text.experiences,
        'education': resume_text.education,
        'activities': resume_text.activities,
        'projects': resume_text.projects,
        'certifications': resume_text.certifications,
    }

    # ## use hard coded json (similar to parsed json)
    # resume_json = json.load(open("resume_json.json"))

    # print('resume_json: ', resume_json)
    ## use only skills to get job results
    # skill_list = ['ReactJS/React Native','Jest','Reanimated','ExpressJS','Tailwind CSS','FastAPI','AWS EC2/S3/CloudFront/Lambda','Firestore','PostgreSQL','Docker','Stripe','Jenkins','git']
    
    # send to nextjs api to get job results    
    response = requests.post('http://localhost:3000/api/search', json={'message': json.dumps(resume_json)})
    data = response.json()
    print('matching job titles: ', [d['id'] for d in data['matches']])

    return {'topMatches': [match['id'] for match in data['matches']]}

def parse_resume(file_path):
    reader = PdfReader(file_path)
    text = ''
    for page in reader.pages:
        text += page.extract_text()

    # Clean the extracted text
    cleaner = TextCleaner()
    cleaned_text = cleaner.clean_text(text)
    # print(cleaned_text)

    formatter = Formatter()
    formatted_text = formatter.format(cleaned_text)

    return formatted_text


# def main():
#     text = parse_resume('HT_Resume.pdf')
#     print(text)


if __name__ == "__main__":
    if "--reload" in sys.argv:
        # Run the Uvicorn server with auto-reload
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    else:
        # Run the Uvicorn server without auto-reload
        uvicorn.run("main:app", host="0.0.0.0", port=8000)
