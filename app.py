import streamlit as st
from features import analyze_job_description, generate_questions
from security import check_input
from prompts import COACH_PROMPTS

st.set_page_config(page_title="Āmāde — Interview Prep", page_icon="🎯")

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

# --- Display results (runs on every rerun, using stored data) ---
if st.session_state.analysis:
    st.subheader("Key skills")
    st.write(", ".join(st.session_state.analysis["key_skills"]))

    st.subheader("Interview questions")
    for i, q in enumerate(st.session_state.questions, start=1):
        st.write(f"{i}. {q}")