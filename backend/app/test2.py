import requests
import json

def test_server_metrics_api(url="http://localhost:8081/metrics"):
    try:
        # API에 GET 요청 보내기
        response = requests.get(url)    
        
        # 응답 상태 코드 확인
        if response.status_code == 200:
            print("API 요청 성공!")
            
            # JSON 응답 파싱
            data = response.json()
            
            # 결과 출력
            print("\n서버 메트릭 정보:")
            print(f"CPU 사용률: {data['cpu_usage']:.2f}%")
            print(f"메모리 사용률: {data['memory_usage']:.2f}%")
            
            if data['gpu_name']:
                print(f"GPU 이름: {data['gpu_name']}")
                print(f"GPU 사용률: {data['gpu_usage']:.2f}%")
                print(f"VRAM 사용률: {data['vram_usage']:.2f}%")
            else:
                print("GPU 정보 없음")
            
            # 전체 응답 데이터를 예쁘게 출력
            print("\n전체 응답 데이터:")
            print(json.dumps(data, indent=2))
        else:
            print(f"API 요청 실패. 상태 코드: {response.status_code}")
            print(f"에러 메시지: {response.text}")
    
    except requests.exceptions.RequestException as e:
        print(f"요청 중 오류 발생: {e}")

if __name__ == "__main__":
    test_server_metrics_api()