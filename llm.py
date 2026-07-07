import os
import requests
from dotenv import load_dotenv


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

