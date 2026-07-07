from features import coach_answer

question = "Tell me about a time you handled a security incident."
answer = """Our firewall flagged unusual traffic. I checked the logs,
saw a brute-force attempt, blocked the IP, and told my manager."""

for technique in ["zero_shot", "chain_of_thought", "few_shot", "persona", "rubric"]:
    result = coach_answer(question, answer, technique=technique)
    scores = [result[p]["score"] for p in ["situation", "task", "action", "result"]]
    print(f"{technique:18} scores={scores}  overall: {result['overall']}")