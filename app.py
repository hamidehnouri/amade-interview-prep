import streamlit as st

from frontend.ui_helpers import load_css
from frontend import settings
from backend.features import analyze_job_description, generate_questions, coach_answer
from backend.security import check_input

st.set_page_config(page_title="Āmāde — Interview Prep", page_icon="🏋️", layout="wide")

load_css("styles.css")

# ── App state ────────────────────────────────────────────────────────────────
ss = st.session_state
ss.setdefault("route", st.query_params.get("tab", "practice"))  # survives refresh via URL
ss.setdefault("analysis", None)
ss.setdefault("questions", None)
ss.setdefault("feedback", {})
settings.init_state()  # model / technique / generation defaults live in settings.py


def go(route: str):
    ss.route = route
    st.query_params["tab"] = route   # keep the URL in sync so refresh restores it


# ── Sidebar — Āmāde shell ─────────────────────────────────────────────────────
# NAV holds the main nav tabs — add ("key", "Label", ":material/icon:") tuples
# to grow it. SETTINGS_TAB is pinned below a divider, mirroring the design.
NAV = [
    ("jd",   "JD analyser",    ":material/target:"),
    ("bank", "Question bank",  ":material/library_books:"),
    ("mock", "Mock interview", ":material/mic:"),
]
SETTINGS_TAB = ("settings", "Settings", ":material/settings:")


def nav_button(key, label, icon):
    st.button(
        label,
        key=f"nav_{key}",
        icon=icon,
        type="primary" if ss.route == key else "secondary",
        width="stretch",
        on_click=go,
        args=(key,),
    )


with st.sidebar:
    for key, label, icon in NAV:
        nav_button(key, label, icon)
    st.markdown('<div class="nav-sep"></div>', unsafe_allow_html=True)
    nav_button(*SETTINGS_TAB)


# ── Practice page ─────────────────────────────────────────────────────────────
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
                gen = settings.gen_settings()
                analysis = analyze_job_description(jd, **gen)
                questions = generate_questions(
                    analysis["interview_topics"], analysis["seniority"], **gen
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
                            q, answer,
                            technique=ss.technique,
                            self_critique=ss.self_critique,
                            **settings.gen_settings(),
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
    settings.render(go)
else:
    render_practice()
