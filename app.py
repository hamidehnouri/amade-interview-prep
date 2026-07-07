import streamlit as st
from frontend.ui_helpers import load_css
from backend.features import analyze_job_description, generate_questions, coach_answer
from backend.security import check_input
from backend.prompts import COACH_PROMPTS

st.set_page_config(page_title="Āmāde — Interview Prep", page_icon="🏋️")

load_css("styles.css")

# --- Developer settings (separate from the user experience) ---
with st.sidebar:
    st.header("⚙️ Developer settings")
    technique = st.selectbox("Coach prompt technique", list(COACH_PROMPTS.keys()), index=1)
    temperature = st.slider("Temperature", 0.0, 1.0, 0.4, 0.1)

# --- Memory that survives reruns ---
if "analysis" not in st.session_state:
    st.session_state.analysis = None
if "questions" not in st.session_state:
    st.session_state.questions = None

# --- Main user experience ---
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
            questions = generate_questions(analysis["interview_topics"], analysis["seniority"])
            st.session_state.analysis = analysis
            st.session_state.questions = questions

# --- Display results ---
if st.session_state.analysis:
    st.subheader("Key skills")
    st.write(", ".join(st.session_state.analysis["key_skills"]))

    st.subheader("Interview questions")

    # make sure we have a place to store feedback per question
    if "feedback" not in st.session_state:
        st.session_state.feedback = {}

    for i, q in enumerate(st.session_state.questions, start=1):
        st.markdown(f"**{i}. {q}**")

        answer = st.text_area("Your answer", key=f"answer_{i}", height=120)

        if st.button("Get feedback", key=f"btn_{i}"):
            safe, reason = check_input(answer)
            if not safe:
                st.error(reason)
            else:
                with st.spinner("Coaching..."):
                    result = coach_answer(
                        q, answer,
                        technique=technique,
                    )
                    st.session_state.feedback[i] = result

        # show feedback for this question if we have it
        if i in st.session_state.feedback:
            fb = st.session_state.feedback[i]
            for part in ["situation", "task", "action", "result"]:
                st.write(f"**{part.capitalize()}: {fb[part]['score']}/10** — {fb[part]['feedback']}")
            st.info(fb["overall"])

        st.divider()