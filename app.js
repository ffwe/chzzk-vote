const dotenv = require('dotenv');
// Check for --dev option
if (process.argv.includes('--dev')) {
    dotenv.config({path: '.env.dev'});
} else {
    dotenv.config({path: '.env'});
}
const { NID_AUT, NID_SES, CHANNEL_NAME } = process.env;

const buzzk = require("buzzk");
buzzk.login(NID_AUT, NID_SES);
const buzzkChat = buzzk.chat;

const prefix = '!투표 ';

async function app() {
  // 커맨드 라인 인자 읽기
  const args = process.argv.slice(2);
  const optionIndex = args.indexOf('--options');
  const timeIndex = args.indexOf('--seconds');
  
  if (optionIndex === -1 || timeIndex === -1) {
      console.error("Usage: node app.js --options <number_of_options> --seconds <vote_time_in_seconds>");
      process.exit(1);
  }
  
  const numberOfOptions = parseInt(args[optionIndex + 1], 10);
  const voteTime = parseInt(args[timeIndex + 1], 10) * 1000; // Convert seconds to milliseconds
  
  let chSearch = await buzzk.channel.search(CHANNEL_NAME); // 채널 검색
  const channel = chSearch[0]; // 검색 결과 첫번째 채널

  const chat = new buzzkChat(channel.channelID);
  await chat.connect(); // 채팅창 연결

  await chat.send(`투표가 시작되었습니다. 투표는 ${voteTime/1000}초 뒤 종료됩니다. (명령어 예시: ${prefix} 1 ~ ${numberOfOptions})`);

  // 투표 저장소 초기화
  let votes = {};

  chat.onMessage(async (data) => { // 채팅이 왔을 때
      for (let o in data) {
          const message = data[o].message;
          const userId = data[o].author.id;

          // 투표 메시지 확인 (예: "!투표 1")
          if (message.startsWith(prefix)) {
              const voteOption = parseInt(message.split(" ")[1], 10); // 투표 옵션 추출

              // 유효한 옵션인지 확인
              if (voteOption >= 1 && voteOption <= numberOfOptions) {
                  // 사용자 ID를 키로 하여 투표 옵션 저장
                  // 이미 투표한 경우, 이전 투표를 최신 투표로 갱신
                  votes[userId] = voteOption;
              }
          }
      }
  });

  // 일정 시간이 지난 후 투표 종료
  setTimeout(async () => {
    console.log("투표 종료");
    // 투표 결과 집계
    const results = {};
    let maxVotes = -Infinity;
    let maxKeys = [];

    for (let userId in votes) {
        const vote = votes[userId];
        if (!results[vote]) {
            results[vote] = 0;
        }
        results[vote]++;

        // 최다 득표 업데이트
        if (results[vote] > maxVotes) {
            maxVotes = results[vote];
            maxKeys = [vote];
        } else if (results[vote] === maxVotes) {
            maxKeys.push(vote);
        }
    }

    // 최다 득표가 없는 경우 (모든 옵션이 0표인 경우)
    if (maxKeys.length === 0) {
        for (let option = 1; option <= numberOfOptions; option++) {
            maxKeys.push(option.toString());
        }
    }

    // 결과 출력
    await chat.send(`최다 득표는 ${maxKeys.join(', ')}번 (${maxVotes > 0 ? maxVotes : 0} 표) 입니다.`);

    for (let option = 1; option <= numberOfOptions; option++) {
        console.log(`${option}번: ${results[option] || 0} 표`);
    }
    chat.disconnect(); // 채팅 연결 해제
    process.exit(1);
  }, voteTime);

}

app();
