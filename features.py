import json 
from llm import ask_llm 

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

COACH_PROMPT = """You are a supportive but honest interview coach.
The user gives a question and their answer.
Evaluate using STAR (Situation, Task, Action, Result).
Think through each STAR element step by step before scoring.
Respond with ONLY a valid JSON object in this shape:
{
  "situation": {"feedback": "...", "score": 0},
  "task": {"feedback": "...", "score": 0},
  "action": {"feedback": "...", "score": 0},
  "result": {"feedback": "...", "score": 0},
  "overall": "one-sentence summary"
}
Each score is an integer 0 to 10."""

def coach_answer(question, answer, system_prompt=COACH_PROMPT):
    user_prompt = f"Question: {question}\n\nMy answer: {answer}"
    raw_reply = ask_llm(system_prompt=system_prompt,
                        user_prompt=user_prompt, temperature=0.4)
    cleaned = raw_reply.strip().replace("```json", "").replace("```", "").strip()
    return json.loads(cleaned)



if __name__ == "__main__":
    question = "Tell me about a time you handled a security incident."
    answer = """Once our firewall flagged unusual traffic. I checked the logs,
    saw a brute-force attempt, blocked the IP, and reported it to my manager.
    The attack stopped and we added rate-limiting afterwards."""

    feedback = coach_answer(question, answer)

    for part in ["situation", "task", "action", "result"]:
        print(f"{part.upper()}: {feedback[part]['score']}/10 — {feedback[part]['feedback']}")
    print("OVERALL:", feedback["overall"])