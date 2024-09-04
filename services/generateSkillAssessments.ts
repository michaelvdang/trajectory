import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

type SkillAssessment = [string, number]

async function generateSkillAssessments(userData, jobSkills)
: Promise<SkillAssessment[]>  
{

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
          read the userData and jobSkills, 
          for each job skill, give an assessment score to each job skill
          the level should be between 1 and 5 inclusive, 
          give a default of 1 if the skill is not listed in the userData,
          give a default of 3 if the skill is listed but you don't have an assessment, 
          in this format: [{jobSkill}, {assessmentScore}]
          return a list of length equal to job skills with the format: [[{jobSkill}, {assessmentScore}], ...]
          reply only in JSON but do not use json markers
        `,
      },
      { role: "user", content: JSON.stringify({ userData, jobSkills }) },
    ],
  });
  const content = completion.choices[0].message.content;
  console.log("content", content);
  const assessments = JSON.parse(content);
  console.log("content", content);

  return assessments;
}

export default generateSkillAssessments

