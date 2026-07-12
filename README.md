# Āmāde — Interview Prep

An AI interview‑practice app. Paste a job description and Āmāde extracts the role's
focus areas, generates tailored **behavioural** questions, lets you answer them
(by typing or voice), and scores each answer against the **STAR** framework with
actionable coaching.

Built with Next.js + TypeScript, talking to LLMs through OpenRouter.

**Live demo:** https://amade-interview-prep-omega.vercel.app/

> Originally prototyped in Streamlit (see the `streamlit` branch); this branch is the
> Next.js rewrite.

---

## Features

- **JD analyser** — extracts key skills, topics, and seniority from a job description.
- **Tailored questions** — behavioural, STAR‑oriented questions generated for the role.
- **Practice** — type or **record** your answer (browser speech‑to‑text with a live
  waveform); a STAR reminder keeps answers structured.
- **Score** — an overall session score plus per‑element STAR feedback, colour‑coded by level.
- **Progress** — practised questions are tracked (per session) with their score.
- **Developer settings** (password‑gated) — choose the model, tune generation
  (reasoning effort / temperature / max tokens), edit the prompting technique,
  toggle safety guards, and run a **prompt‑evaluation bench** that compares techniques
  on a sample answer.
- **Cost estimate** per session from live per‑token pricing.

## Tech stack

- **Next.js (App Router) + React + TypeScript**
- **Tailwind CSS v4** (design tokens in `globals.css`)
- **Zod** for request and model‑output validation
- **OpenRouter** chat‑completions API (GPT‑5 family + others available to your key)
- **Web Speech API** for in‑browser voice input

## Getting started

**Prerequisites:** Node 18.18+ and an OpenRouter API key.

```bash
npm install
echo "OPENROUTER_API_KEY=sk-or-..." > .env.local
npm run dev            # http://localhost:3000
```

`OPENROUTER_API_KEY` is read **server‑side only** (in the API route handlers), so it
never reaches the browser.

## How it works

The UI is a four‑step wizard on `/`:

`Analyse → Questions → Practice → Score`

Each page calls a Next.js **route handler** (the backend) which validates the request,
runs the security guards, calls OpenRouter, validates the model's JSON output, and
returns clean data or a friendly error.

```
src/
  app/
    page.tsx                # the wizard (state machine + stepper)
    settings/page.tsx       # User / Developer settings
    api/
      analyze/route.ts      # JD → analysis + questions
      coach/route.ts        # answer → STAR feedback (+ optional self‑critique)
      evaluate/route.ts     # compare prompting techniques on a sample
  components/
    steps/                  # AnalyseStep, QuestionsStep, PracticeStep, ScoreStep
    ui/                     # Card, Button, Tag, Slider, RadioGroup, Stepper, …
  lib/
    openrouter.ts           # server-side LLM call (reasoning/temperature-aware)
    features.ts             # analyze / generate / coach logic
    prompts.ts              # the 5 coaching prompts + analyse/generate/critique
    guard.ts                # rule-based input guard + output moderation
    schemas.ts              # Zod schemas (requests + model output)
    models.ts               # model catalogue + pricing + reasoning flag
    score.ts / techniques.ts / settings.tsx / wizardStore.ts / devAccess.ts
```

## Settings & developer mode

Open **Settings** (gear, top‑right). The **User** tab exposes the model and basic
generation controls; the **Developer** tab (password `123` — a demo gate, not real
auth) adds:

- **Prompting technique** — Zero‑shot, Chain‑of‑thought (recommended), Few‑shot,
  Persona, Rubric — with an editable copy of each prompt.
- **Safety** — prompt‑injection guard (input) and output moderation, both on by default.
- **Prompt evaluation** — run one technique or **compare all** on a sample Q/A, ranked by score.

## Prompting & safety (course requirements)

- **5 prompting techniques** live in `src/lib/prompts.ts`; the evaluation bench lets you
  measure which performs best.
- **Tunable model settings** (model, reasoning effort, max tokens; temperature for
  non‑reasoning models) — all in Developer settings.
- **Two security guards**: a rule‑based prompt‑injection check on input and a
  content‑moderation check on output.

## Deployment (Vercel)

1. Push the branch to GitHub.
2. Import the repo on **vercel.com** (framework auto‑detected).
3. Add the `OPENROUTER_API_KEY` environment variable.
4. Deploy.

Or from the project folder: `npx vercel` → add the env var → `npx vercel --prod`.

## Notes & limitations

- **Voice input** uses the browser Web Speech API — Chrome/Edge only, and requires https
  (Vercel is https).
- **Temperature** is ignored by GPT‑5 (reasoning) models; it only takes effect on
  non‑reasoning models. Reasoning effort is the relevant knob for GPT‑5.
- Some OpenRouter models require enabling a data policy at
  `openrouter.ai/settings/privacy`.
- Settings, the question bank of results, and wizard progress persist in `sessionStorage`
  (cleared when the tab closes).
- The developer password is a client‑side demo gate, not authentication.
