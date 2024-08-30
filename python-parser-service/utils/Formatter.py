import os
from typing import List

from openai import OpenAI
from pydantic import BaseModel

RESUME_SECTIONS = [
    "Contact Information",
    "Objective",
    "Summary",
    "Education",
    "Experience",
    "Skills",
    "Projects",
    "Certifications",
    "Licenses",
    "Awards",
    "Honors",
    "Publications",
    "References",
    "Technical Skills",
    "Computer Skills",
    "Programming Languages",
    "Software Skills",
    "Soft Skills",
    "Language Skills",
    "Professional Skills",
    "Transferable Skills",
    "Work Experience",
    "Professional Experience",
    "Employment History",
    "Internship Experience",
    "Volunteer Experience",
    "Leadership Experience",
    "Research Experience",
    "Teaching Experience",
]


class ResumeFormat(BaseModel):
    languages: List[str]
    skills: List[str]
    experiences: List[str]
    education: List[str]
    activities: List[str]
    projects: List[str]
    certifications: List[str]


class Formatter():
    def __init__(self, model: str = "gpt-4o-2024-08-06"):
        self.client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        self.model = model

    def format(self, text):
        completion = self.client.beta.chat.completions.parse(
            model=self.model,
            messages=[
                {"role": "system",
                 "content": f"Format the resume data into a structured format."
                            f"Look for sections like {', '.join(RESUME_SECTIONS)}."
                            f"If you can't find a section, you can skip it and leave it empty."
                            f"Provide the following fields in the response:"
                            f"1. languages: List of programming languages known."
                            f"2. skills: List of skills, including libraries, frameworks, APIs."
                            f"3. experiences: List of experiences with title, employer, and description."
                            f"4. education: List of education with degree, major, and school."
                            f"5. activities: List of activities/clubs with title and description."
                            f"6. projects: List of projects with title and description."
                            f"7. For certifications, provide the name and the issuing organization."
                 },
                {"role": "user", "content": text},
            ],
            response_format=ResumeFormat,
        )

        # Extract and return the content of the response
        formatted = completion.choices[0].message.parsed
        return formatted
