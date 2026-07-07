import json 
from backend.llm import ask_llm 
from backend.prompts import COACH_PROMPTS

def analyze_job_description(job_description):
    system_prompt = """You are an expert technical recruiter.
Analyze the job description the user provides.
Respond with ONLY a valid JSON object, no extra text, in this shape:
{
  "key_skills": ["skill1", "skill2"],
  "interview_topics": ["topic1", "topic2"],
  "seniority": "junior | mid | senior"
}"""

    raw_reply = ask_llm(
        system_prompt=system_prompt,
        user_prompt=job_description,
        temperature=0.3,
    )
    cleaned = raw_reply.strip().replace("```json", "").replace("```", "").strip()
    return json.loads(cleaned)

def generate_questions(topics, seniority, num_questions=5):
    """Take topics + seniority and return a list of interview questions."""
    system_prompt = f"""You are an experienced technical interviewer.
Generate exactly {num_questions} interview questions for a {seniority}-level candidate.
Base them on these topics: {topics}.
Respond with ONLY a valid JSON array of strings, no extra text, like:
["question 1", "question 2", "question 3"]"""

    raw_reply = ask_llm(
        system_prompt=system_prompt,
        user_prompt="Generate the interview questions now.",
        temperature=0.7,
    )

    cleaned = raw_reply.strip().replace("```json", "").replace("```", "").strip()
    return json.loads(cleaned)

def coach_answer(question, answer, technique="chain_of_thought"):
    """Evaluate an answer. `technique` picks which prompt from COACH_PROMPTS."""
    system_prompt = COACH_PROMPTS[technique]
    user_prompt = f"Question: {question}\n\nMy answer: {answer}"

    raw_reply = ask_llm(system_prompt=system_prompt, user_prompt=user_prompt, temperature=0.4)
    cleaned = raw_reply.strip().replace("```json", "").replace("```", "").strip()
    return json.loads(cleaned)

