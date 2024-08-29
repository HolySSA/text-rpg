/*import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 모듈의 디렉토리 경로를 얻기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 업적이 저장될 파일 경로
const recordsFile = path.join(__dirname, 'record.json');

// 업적 데이터를 로드
function loadRecords() {
  // 파일이 존재할 경우
  if (fs.existsSync(recordsFile)) {
    const data = fs.readFileSync(recordsFile, 'utf8');
    return JSON.parse(data);
  }

  return [];
}

// 업적 데이터를 저장
function saveRecords(records) {
  fs.writeFileSync(recordsFile, JSON.stringify(records, null, 2), 'utf8');
}

// 업적 추가
function addRecords(nickname, level, exp, stage) {
  const records = loadRecords();
  // 닉네임 레벨 경험치 스테이지 날짜
  records.push({ nickname, level, exp, stage, date: new Date().toISOString() });
  saveRecords(records);
}

// 업적 목록을 출력
function listRecords() {
  const records = loadRecords();

   // 업적 정렬 로직
   records.sort((a, b) => {
    // 스테이지 순
    if (b.stage !== a.stage)
      return b.stage - a.stage;
    
    // 레벨 순
    if (b.level !== a.level)
      return b.level - a.level;

    // 경험치 순
    return b.exp - a.exp;
  });

  // 업적 목록 출력
  console.log(chalk.green('업적 목록:'));
  records.forEach((achievement) => {
    console.log(`닉네임: ${achievement.nickname}`);
    console.log(`스테이지: ${achievement.stage}`);
    console.log(`레벨: ${achievement.level} (${achievement.exp})`);
    console.log(`날짜: ${achievement.date}`);
    console.log('----------------------');
  });
}

export { addRecords, listRecords };*/