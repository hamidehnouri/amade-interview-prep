import os
import json
import requests
from dotenv import load_dotenv


load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")

API_URL = "https://openrouter.ai/api/v1/chat/completions"
DEFAULT_MODEL = "openai/gpt-5-mini"


def _headers():
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }


def _build_payload(system_prompt, user_prompt, model, temperature,
                   max_tokens, reasoning_effort):
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }
    # GPT-5 reasoning models ignore temperature, so only send one or the other.
    if reasoning_effort:
        payload["reasoning"] = {"effort": reasoning_effort}
    else:
        payload["temperature"] = temperature
    if max_tokens:
        payload["max_tokens"] = int(max_tokens)
    return payload


def _stream(payload):
    """Consume OpenRouter's SSE stream and return the full concatenated text."""
    payload = {**payload, "stream": True}
    content = ""
    with requests.post(API_URL, headers=_headers(), json=payload, stream=True) as r:
        for raw in r.iter_lines():
            if not raw:
                continue
            line = raw.decode("utf-8")
            if not line.startswith("data:"):
                continue
            data = line[len("data:"):].strip()
            if data == "[DONE]":
                break
            try:
                obj = json.loads(data)
            except json.JSONDecodeError:
                continue
            if "error" in obj:
                raise RuntimeError(f"OpenRouter error: {obj['error']}")
            delta = obj.get("choices", [{}])[0].get("delta", {})
            piece = delta.get("content")
            if piece:
                content += piece
    if not content:
        raise RuntimeError("OpenRouter returned no content (streaming).")
    return content


def ask_llm(
    system_prompt,
    user_prompt,
    model=DEFAULT_MODEL,
    temperature=0.7,
    max_tokens=None,
    reasoning_effort=None,
    stream=False,
):
    """Send a system + user prompt to OpenRouter and return the text reply.

    All generation controls come from the Settings page so the developer
    settings genuinely change the request.
    """
    payload = _build_payload(
        system_prompt, user_prompt, model, temperature, max_tokens, reasoning_effort
    )

    if stream:
        return _stream(payload)

    response = requests.post(API_URL, headers=_headers(), json=payload)
    data = response.json()
    if "choices" not in data:
        raise RuntimeError(f"OpenRouter error: {data.get('error', data)}")
    return data["choices"][0]["message"]["content"]
