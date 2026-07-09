import json
from backend.llm import ask_llm, DEFAULT_MODEL
from backend.prompts import COACH_PROMPTS


def _clean(raw_reply):
    return raw_reply.strip().replace("```json", "").replace("```", "").strip()


def analyze_job_description(
    job_description,
    model=DEFAULT_MODEL,
    temperature=0.3,
    max_tokens=None,
    reasoning_effort=None,
    stream=False,
):
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
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
        reasoning_effort=reasoning_effort,
        stream=stream,
    )
    return json.loads(_clean(raw_reply))


def generate_questions(
    topics,
    seniority,
    num_questions=5,
    model=DEFAULT_MODEL,
    temperature=0.7,
    max_tokens=None,
    reasoning_effort=None,
    stream=False,
):
    """Take topics + seniority and return a list of interview questions."""
    system_prompt = f"""You are an experienced technical interviewer.
Generate exactly {num_questions} interview questions for a {seniority}-level candidate.
Base them on these topics: {topics}.
Respond with ONLY a valid JSON array of strings, no extra text, like:
["question 1", "question 2", "question 3"]"""

    raw_reply = ask_llm(
        system_prompt=system_prompt,
        user_prompt="Generate the interview questions now.",
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
        reasoning_effort=reasoning_effort,
        stream=stream,
    )
    return json.loads(_clean(raw_reply))


CRITIQUE_PROMPT = """You are a strict reviewer of interview feedback.
You are given an interview question, a candidate's answer, and a draft STAR
evaluation (JSON). Check the draft for inaccurate scores, vague feedback, or
missed issues, and return an IMPROVED evaluation.
Respond with ONLY a valid JSON object in the SAME shape as the draft."""


def coach_answer(
    question,
    answer,
    technique="chain_of_thought",
    model=DEFAULT_MODEL,
    temperature=0.4,
    max_tokens=None,
    reasoning_effort=None,
    stream=False,
    self_critique=False,
):
    """Evaluate an answer. `technique` picks which prompt from COACH_PROMPTS.

    When `self_critique` is on, a second pass reviews and refines the scoring.
    """
    system_prompt = COACH_PROMPTS[technique]
    user_prompt = f"Question: {question}\n\nMy answer: {answer}"

    raw_reply = ask_llm(
        system_prompt=system_prompt,
        user_prompt=user_prompt,
        model=model,
        temperature=temperature,
        max_tokens=max_tokens,
        reasoning_effort=reasoning_effort,
        stream=stream,
    )
    result = json.loads(_clean(raw_reply))

    if self_critique:
        review = ask_llm(
            system_prompt=CRITIQUE_PROMPT,
            user_prompt=(
                f"Question: {question}\n\nAnswer: {answer}\n\n"
                f"Draft evaluation:\n{json.dumps(result)}"
            ),
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            reasoning_effort=reasoning_effort,
            stream=stream,
        )
        result = json.loads(_clean(review))

    return result
