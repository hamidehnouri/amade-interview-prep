"""Settings page — model & generation controls, isolated from app.py.

app.py only needs: init_state(), gen_settings(), and render(on_back).
"""
import streamlit as st

from backend.prompts import COACH_PROMPTS

# OpenRouter models offered in the course task, with per-1M-token pricing (USD).
MODELS = {
    "openai/gpt-5-mini": {"label": "GPT-5 mini · balanced", "inp": 0.25, "out": 2.00},
    "openai/gpt-5-nano": {"label": "GPT-5 nano · cheapest", "inp": 0.05, "out": 0.40},
    "openai/gpt-5":      {"label": "GPT-5 · highest quality", "inp": 1.25, "out": 10.00},
}
REASONING_LEVELS = ["minimal", "low", "medium", "high"]

# Defaults for every setting this page owns.
DEFAULTS = {
    "technique": list(COACH_PROMPTS.keys())[1],
    "temperature": 0.4,
    "model": "openai/gpt-5-mini",
    "max_tokens": 1024,
    "reasoning": "medium",
    "stream": True,
    "self_critique": True,
}


def init_state():
    """Seed session_state with this page's defaults (call once at startup)."""
    for key, value in DEFAULTS.items():
        st.session_state.setdefault(key, value)


def est_cost(model, max_tokens):
    """Rough $/session: ~1,200 input tokens + max_tokens output, over ~8 turns."""
    m = MODELS[model]
    return (1200 * m["inp"] + max_tokens * m["out"]) / 1e6 * 8


def gen_settings():
    """Current generation settings — passed into every backend call."""
    ss = st.session_state
    return dict(
        model=ss.model,
        temperature=ss.temperature,
        max_tokens=ss.max_tokens,
        reasoning_effort=ss.reasoning,
        stream=ss.stream,
    )


def _kicker(label):
    st.markdown(
        f'<div class="rh-kicker"><span class="rh-kick">{label}</span>'
        f'<span class="rh-dev">\U0001F512 DEV ONLY</span></div>',
        unsafe_allow_html=True,
    )


def render(on_back):
    """Render the Settings page. `on_back(route)` navigates away."""
    ss = st.session_state

    st.title("Settings")
    st.caption(
        "Tune how the AI interviewer generates questions and scores answers. "
        "These settings apply to every new session."
    )

    # ── Model card ────────────────────────────────────────────────
    with st.container(border=True):
        _kicker("MODEL")
        left, right = st.columns([3, 2])
        with left:
            model_keys = list(MODELS.keys())
            ss.model = st.selectbox(
                "Interview engine", model_keys,
                index=model_keys.index(ss.model),
                format_func=lambda k: MODELS[k]["label"],
            )
            keys = list(COACH_PROMPTS.keys())
            ss.technique = st.selectbox(
                "Prompting technique", keys, index=keys.index(ss.technique)
            )
        with right:
            m = MODELS[ss.model]
            st.markdown(
                '<div class="rh-price">'
                f'<div><span>Input</span><b>${m["inp"]:.2f} / 1M</b></div>'
                f'<div><span>Output</span><b>${m["out"]:.2f} / 1M</b></div>'
                '</div>',
                unsafe_allow_html=True,
            )
        st.divider()
        c_label, c_val = st.columns([3, 1])
        with c_label:
            st.markdown(
                "**Estimated cost per session**<br>"
                f"<span class='rh-sub'>~8 questions · {ss.max_tokens:,} "
                "max output tokens each</span>",
                unsafe_allow_html=True,
            )
        with c_val:
            st.markdown(
                f"<div class='rh-cost'>${est_cost(ss.model, ss.max_tokens):.2f}</div>",
                unsafe_allow_html=True,
            )

    # ── Generation card ───────────────────────────────────────────
    with st.container(border=True):
        _kicker("GENERATION")
        gl, gr = st.columns(2)
        with gl:
            st.slider(
                "Temperature", 0.0, 1.0, ss.temperature, 0.1,
                disabled=True, help="Ignored when reasoning is on.",
            )
            st.caption("Ignored when reasoning is on.")
            ss.max_tokens = st.slider(
                "Max output tokens", 256, 4096, ss.max_tokens, 128,
                help="Longer = more detailed feedback.",
            )
        with gr:
            ss.reasoning = st.select_slider(
                "Reasoning effort", options=REASONING_LEVELS, value=ss.reasoning,
                format_func=str.capitalize,
                help="Higher = more step-by-step thinking, slower & pricier.",
            )
            ss.stream = st.toggle(
                "Stream responses", value=ss.stream,
                help="Fetch the reply as a stream rather than one blocking call.",
            )
            ss.self_critique = st.toggle(
                "Self-critique pass", value=ss.self_critique,
                help="Model reviews its own scoring before returning.",
            )

    st.divider()
    st.button("← Back to practice", on_click=on_back, args=("practice",))
