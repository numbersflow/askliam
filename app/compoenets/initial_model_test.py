import streamlit as st
import requests
import json

# 상태 변수 초기화
if 'model_name' not in st.session_state:
    st.session_state.model_name = ''
if 'api_token' not in st.session_state:
    st.session_state.api_token = ''
if 'show_api_token_input' not in st.session_state:
    st.session_state.show_api_token_input = False
if 'loading' not in st.session_state:
    st.session_state.loading = False
if 'download_status' not in st.session_state:
    st.session_state.download_status = ''
if 'model_info' not in st.session_state:
    st.session_state.model_info = ''
if 'tokenizer_info' not in st.session_state:
    st.session_state.tokenizer_info = ''
if 'messages' not in st.session_state:
    st.session_state.messages = []
if 'waiting_for_response' not in st.session_state:
    st.session_state.waiting_for_response = False
if 'system_message' not in st.session_state:
    st.session_state.system_message = ''
if 'show_system_message_input' not in st.session_state:
    st.session_state.show_system_message_input = False

# 모델 다운로드 핸들러
def handle_model_download():
    if not st.session_state.model_name:
        st.error('모델 이름을 입력해주세요.')
        return
    st.session_state.loading = True
    st.session_state.download_status = 'downloading'
    
    # 모델 다운로드 요청
    response = requests.post('http://localhost:8000/api/v1/download', json={
        'model_name': st.session_state.model_name,
        'api_token': st.session_state.api_token or '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'
    })
    
    if response.status_code == 200:
        st.session_state.download_status = 'completed'
        model_info_response = requests.post('http://localhost:8000/api/v1/model_info')
        st.session_state.model_info = json.dumps(model_info_response.json().get('model_info', {}), indent=2)
        st.session_state.tokenizer_info = json.dumps(model_info_response.json().get('tokenizer_info', {}), indent=2)
    else:
        st.error('모델 다운로드 중 오류가 발생했습니다.')
    st.session_state.loading = False

# 메시지 전송 핸들러
def handle_send_message():
    if not st.session_state.input_message.strip():
        return
    st.session_state.messages.append({'text': st.session_state.input_message, 'is_user': True})
    st.session_state.input_message = ''
    st.session_state.waiting_for_response = True
    
    response = requests.post('http://localhost:8000/api/v1/chat', json={
        'input_text': st.session_state.input_message,
        'system_message': st.session_state.system_message,
        # 기타 파라미터 추가
    })
    
    if response.status_code == 200:
        response_text = response.json().get('response_text', '')
        st.session_state.messages.append({'text': response_text, 'is_user': False})
    else:
        st.error('채팅 중 오류가 발생했습니다.')
    st.session_state.waiting_for_response = False

# UI 구성
st.title("초기 모델 테스트")

# 모델 다운로드 섹션
st.text_input("모델 이름 입력", key='model_name')
if st.button("토큰 추가"):
    st.session_state.show_api_token_input = not st.session_state.show_api_token_input
if st.session_state.show_api_token_input:
    st.text_input("API 토큰 입력", key='api_token')
if st.button("모델 받기", on_click=handle_model_download):
    st.session_state.loading = True

# 채팅 섹션
st.subheader("채팅 화면")
if st.button("시스템 메시지 설정"):
    st.session_state.show_system_message_input = not st.session_state.show_system_message_input
if st.session_state.show_system_message_input:
    st.text_input("시스템 메시지를 2000자 이내로 입력하세요", key='system_message', max_chars=2000)

# 채팅 메시지 표시
for msg in st.session_state.messages:
    if msg['is_user']:
        st.markdown(f"<div style='text-align: right; background-color: #1890ff; color: white; padding: 8px; border-radius: 18px; margin-bottom: 8px;'>{msg['text']}</div>", unsafe_allow_html=True)
    else:
        st.markdown(f"<div style='text-align: left; background-color: #f0f0f0; color: black; padding: 8px; border-radius: 18px; margin-bottom: 8px;'>{msg['text']}</div>", unsafe_allow_html=True)

if st.session_state.waiting_for_response:
    st.markdown("<div style='text-align: center;'>준비 중...</div>", unsafe_allow_html=True)

st.text_input("메시지 입력", key='input_message', on_change=handle_send_message)

# 모델 정보 및 토큰 정보 섹션
st.subheader("모델 정보")
st.json(st.session_state.model_info)
st.subheader("토큰 정보")
st.json(st.session_state.tokenizer_info)