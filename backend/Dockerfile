FROM python:3.11-slim-bullseye@sha256:34fb194372f3390c5986dd0a94f21de5f1615d0e1684c977e083fab06b2018be

# 환경 변수 설정
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUTF8=1 \
    PIP_NO_CACHE_DIR=on \
    PIP_DISABLE_PIP_VERSION_CHECK=on

# 필요한 파일들을 복사
COPY requirements.txt pyproject.toml poetry.lock /usr/src/

# 작업 디렉토리 설정
WORKDIR /usr/src

# libmagic1 설치
RUN apt-get update && apt-get install -y libmagic1

# Python 패키지 설치
RUN pip install --no-cache-dir -r requirements.txt
RUN poetry config virtualenvs.create false && \
    if [ -f pyproject.toml ]; then poetry install --no-root; fi

# 앱 코드 복사
COPY . /usr/src/app
WORKDIR /usr/src/app/

# 포트 설정
EXPOSE 9070

# 실행 명령
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9070", "--workers", "1"]
