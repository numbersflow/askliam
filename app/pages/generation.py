import streamlit as st
from app.compoenets import initial_model_test, data_cleaning, tokenizer_conversion, fine_tuning

def test():
    st.sidebar.title("생성 단계")
    step = st.sidebar.radio("단계를 선택하세요", ["초기 모델 테스트", "데이터 정제", "토크나이저 변환", "파인튜닝"])

    if step == "초기 모델 테스트":
        pass
    elif step == "데이터 정제":
        data_cleaning.display()
    elif step == "토크나이저 변환":
        tokenizer_conversion.display()
    elif step == "파인튜닝":
        fine_tuning.display()