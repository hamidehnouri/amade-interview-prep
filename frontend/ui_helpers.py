import streamlit as st

def load_css(path):
    """Read a CSS file and inject it into the page."""
    with open(path) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)