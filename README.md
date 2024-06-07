# 치지직 투표 봇

이 애플리케이션은 치지직 채팅 플랫폼에서 실시간 투표를 진행하고 결과를 집계하는 Node.js 기반의 봇입니다.

## 기능

- 주어진 시간 동안 채팅 메시지를 통해 투표를 진행합니다.
- 투표가 종료되면 최다 득표 옵션과 득표 수를 출력합니다.
- 최다 득표가 동점일 경우, 모든 동점 옵션을 출력합니다.
- 모든 옵션이 0표인 경우, 모든 옵션을 출력합니다.

## 설치 및 사용법

### 1. 프로젝트 클론 및 의존성 설치

```bash
git clone https://github.com/ffwe/chzzk-vote.git
cd chzzk-vote
npm install
```

### 2. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고, 다음과 같은 형식으로 환경 변수를 설정합니다:

```
NID_AUT=<YOUR_NID_AUT>
NID_SES=<YOUR_NID_SES>
CHANNEL_NAME=<YOUR_CHANNEL_NAME>
```

개발 환경에서 사용할 경우, `.env.dev` 파일을 생성하고 동일한 형식으로 설정합니다.

### 3. 애플리케이션 실행

애플리케이션은 명령어 인자로 옵션 수와 투표 시간을 받아 실행됩니다.

```bash
node app.js --options <옵션_수> --seconds <투표_시간_초>
```

예를 들어, 5개의 옵션을 가지고 60초 동안 투표를 진행하려면 다음과 같이 실행합니다:

```bash
node app.js --options 5 --seconds 60
```

개발 환경에서 실행하려면 `--dev` 플래그를 추가합니다:

```bash
node app.js --dev --options 5 --seconds 60
```

## 참고
- https://github.com/Emin-G/buzzk
