import os
import requests
from dotenv import load_dotenv
import json 

load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")

def ask_llm(system_prompt, user_prompt, temperature=0.7):
    """Send a system + user prompt to OpenRouter and return the text reply."""
    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "openai/gpt-5-mini",
            "temperature": temperature,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        },
    )
    data = response.json()
    return data["choices"][0]["message"]["content"]

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


if __name__ == "__main__":
    sample_jd = """We are hiring a Junior Network Security Engineer.
    You will monitor firewalls, respond to incidents, and work with SIEM tools.
    Requirements: TCP/IP, Linux, basic Python, and eagerness to learn."""

    analysis = analyze_job_description(sample_jd)
    questions = generate_questions(analysis["interview_topics"], analysis["seniority"])

    for i, q in enumerate(questions, start=1):
        print(f"{i}. {q}")