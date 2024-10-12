# Node.js 이미지를 기반으로 합니다
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json (있는 경우) 복사
COPY package*.json ./

# 모든 의존성 설치 (개발 의존성 포함)
RUN npm ci

# 소스 코드 복사
COPY . .

# 9060번 포트 노출
EXPOSE 3000

ENV PORT=3000
ENV HOST=0.0.0.0

# 개발 서버 실행
CMD ["npm", "run", "start"]