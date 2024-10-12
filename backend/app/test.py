import httpx
import asyncio
import json

SERVER_URL = "http://localhost:8000/api/v1/generate"  # FastAPI 서버의 엔드포인트 URL

async def send_message_to_server(user_input):
    data = {
        "prompt": user_input,
        "temperature": 0.7,
        "n_predict": 100,
        "stream": True
    }

    async with httpx.AsyncClient() as client:
        async with client.stream('POST', SERVER_URL, json=data) as response:
            if response.status_code == 200:
                async for chunk in response.aiter_text():
                    try:
                        # 청크를 JSON으로 로드
                        json_data = json.loads(chunk)
                        # JSON 데이터에서 필요한 정보 출력dd
                        print(type(json_data), json_data, end='')
                    except json.JSONDecodeError:
                        # JSON으로 변환할 수 없는 경우, 원본 문자열을 그대로 출력
                        print(chunk, end='')
            else:
                # 스트리밍 응답이 아닌 경우, 전체 응답을 읽어야 합니다.
                error_content = await response.aread()
                print(f"Error: {response.status_code}, {error_content.decode('utf-8')}")

async def main():
    while True:
        user_input = input("User: ")
        if user_input.lower() == "exit":
            break
        print("Assistant: ", end='')
        await send_message_to_server(user_input)
        print()  # 줄바꿈

if __name__ == "__main__":
    asyncio.run(main())