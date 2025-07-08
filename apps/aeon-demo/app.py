import streamlit as st
from GenesisAeonAdvancedAi.aeon_processor import symbolic_manifestation

st.title("Aeon Demo")
values = st.text_input("Values (comma separated)", "0.1,0.5,0.9")
nums = []
for part in values.split(','):
    part = part.strip()
    if part:
        try:
            nums.append(float(part))
        except ValueError:
            st.error(f"Invalid number: {part}")
            nums = []
            break
if st.button("Process") and nums:
    result = symbolic_manifestation(nums)
    st.json(result)
