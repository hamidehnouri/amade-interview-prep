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


if __name__ == "__main__":
    sample_jd = """We are hiring a Junior Network Security Engineer.
    You will monitor firewalls, respond to incidents, and work with SIEM tools.
    Requirements: TCP/IP, Linux, basic Python, and eagerness to learn."""

    result = analyze_job_description(sample_jd)
    print(result)
    print("Skills:", result["key_skills"])