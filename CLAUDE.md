# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is a Turing College AI Engineering course project (Sprint 1). The assignment spec lives in `115.md` — read it before making design decisions. There is no application code yet; the task is to build an **Interview Practice app** from scratch.

Work happens on the `development` branch; `main` is the PR target.

## The assignment (from 115.md)

Build a single-page Interview Preparation web app that calls the OpenRouter API. Hard requirements:

1. Front-end built with **Streamlit or Gradio** (Python track) or **Next.js** (JS track).
2. Calls OpenRouter (`https://openrouter.ai/api/v1`) using one of the allowed chat models:
   - `openai/gpt-5-mini` (recommended default)
   - `openai/gpt-5-nano` (cheaper)
   - `openai/gpt-5` (higher capability)
   - Embeddings (only if needed): `qwen/qwen3-embedding-8b` (default), `openai/text-embedding-3-small`, `openai/text-embedding-3-large`
   - Image generation (optional task): `google/gemini-2.5-flash-image` via `/chat/completions` with `modalities=["image", "text"]`
3. **At least 5 system prompts** using different prompting techniques (few-shot, Chain-of-Thought, zero-shot, etc.) — these should be kept and comparable, not overwritten.
4. **At least one tunable model setting** (temperature, top-p, frequency penalty, etc.).
5. **At least one security guard** against misuse (e.g. input validation, prompt-injection defence).

For maximum evaluation points: implement at least 2 "medium" and 1 "hard" optional tasks from `115.md` (e.g. user-tunable settings sliders, structured JSON outputs, prompt cost calculation, full chatbot instead of one-shot calls, LangChain, vector DB, LLM-as-a-judge).

## Constraints and conventions

- The OpenRouter API key must come from the environment / a gitignored config — never hardcoded or committed.
- Only the models listed above are on the Sprint 1 allow-list; don't substitute others unless implementing the "choose from a list of LLMs" optional task.
- The project is graded on the learner being able to explain prompting techniques, LLM settings, and message roles (user/system/assistant) — keep prompts and settings visible and well-organised in the code rather than buried, and separate developer settings (model/system-prompt selection) from the end-user experience.
- `115.md` is the course-provided spec; its table of contents is auto-generated (`conman toc sync`) — don't hand-edit that section, and don't modify the file unless asked.

## Commands

No build/test tooling exists yet. Once the app is scaffolded (e.g. `streamlit run app.py` for the Python track), update this section with the actual run, lint, and test commands.
