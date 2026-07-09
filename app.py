import streamlit as st
from frontend.ui_helpers import load_css
from backend.features import analyze_job_description, generate_questions, coach_answer
from backend.security import check_input
from backend.prompts import COACH_PROMPTS

st.set_page_config(page_title="Āmāde — Interview Prep", page_icon="🏋️", layout="wide")

load_css("styles.css")

# ── App state ────────────────────────────────────────────────────────────────
ss = st.session_state
ss.setdefault("route", "practice")           # "practice" is the home view
ss.setdefault("technique", list(COACH_PROMPTS.keys())[1])
ss.setdefault("temperature", 0.4)
ss.setdefault("analysis", None)
ss.setdefault("questions", None)
ss.setdefault("feedback", {})


def go(route: str):
    ss.route = route


# ── Sidebar — Āmāde shell ─────────────────────────────────────────────────────
# NAV is list-driven: add ("key", "Label", ":material/icon:") tuples here to
# grow the sidebar. Each entry becomes a styled nav tab automatically.
NAV = [
    ("settings", "Settings", ":material/settings:"),
    # ("jd",   "JD analyser",    ":material/target:"),
    # ("bank", "Question bank",  ":material/library_books:"),
    # ("mock", "Mock interview", ":material/mic:"),
]

with st.sidebar:
    for key, label, icon in NAV:
        st.button(
            label,
            key=f"nav_{key}",
            icon=icon,
            type="primary" if ss.route == key else "secondary",
            width="stretch",
            on_click=go,
            args=(key,),
        )


# ── Pages ─────────────────────────────────────────────────────────────────────
def render_settings():
    st.title("Settings")
    st.caption(
        "Tune how the AI interviewer generates questions and scores answers. "
        "These settings apply to every new session."
    )
    keys = list(COACH_PROMPTS.keys())
    ss.technique = st.selectbox(
        "Coach prompt technique", keys, index=keys.index(ss.technique)
    )
    ss.temperature = st.slider("Temperature", 0.0, 1.0, ss.temperature, 0.1)
    st.divider()
    st.button("← Back to practice", on_click=go, args=("practice",))


def render_practice():
    st.title("Āmāde — Interview Prep")
    st.write("Paste a job description to get tailored interview questions.")

    jd = st.text_area("Job description", height=200)

    if st.button("Analyze & generate questions"):
        safe, reason = check_input(jd)
        if not safe:
            st.error(reason)
        else:
            with st.spinner("Analyzing..."):
                analysis = analyze_job_description(jd)
                questions = generate_questions(
                    analysis["interview_topics"], analysis["seniority"]
                )
                ss.analysis = analysis
                ss.questions = questions

    if ss.analysis:
        st.subheader("Key skills")
        st.write(", ".join(ss.analysis["key_skills"]))

        st.subheader("Interview questions")
        for i, q in enumerate(ss.questions, start=1):
            st.markdown(f"**{i}. {q}**")
            answer = st.text_area("Your answer", key=f"answer_{i}", height=120)

            if st.button("Get feedback", key=f"btn_{i}"):
                safe, reason = check_input(answer)
                if not safe:
                    st.error(reason)
                else:
                    with st.spinner("Coaching..."):
                        ss.feedback[i] = coach_answer(
                            q, answer, technique=ss.technique
                        )

            if i in ss.feedback:
                fb = ss.feedback[i]
                for part in ["situation", "task", "action", "result"]:
                    st.write(
                        f"**{part.capitalize()}: {fb[part]['score']}/10** — "
                        f"{fb[part]['feedback']}"
                    )
                st.info(fb["overall"])

            st.divider()


# ── Router ────────────────────────────────────────────────────────────────────
if ss.route == "settings":
    render_settings()
else:
    render_practice()
