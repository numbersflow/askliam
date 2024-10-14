import streamlit as st
from app.pages.generation import test

st.title("Easy Finetuning")

# 모델 타입 선택
model_type = st.sidebar.selectbox("모델 타입을 선택하세요", ["생성", "회귀", "분류", "클러스터링"])

if model_type == "생성":
    test()
elif model_type == "회귀":
    st.write("회귀 페이지는 아직 준비 중입니다.")
elif model_type == "분류":
    st.write("분류 페이지는 아직 준비 중입니다.")
elif model_type == "클러스터링":
    st.write("클러스터링 페이지는 아직 준비 중입니다.")