import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 현재 모듈의 디렉토리 경로를 얻기 위한 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 업적 데이터가 저장될 파일 경로
const recordsFile = path.join(__dirname, 'record.json');

// 업적 데이터를 로드하는 함수
function loadAchievements() {
  // 파일이 존재할 경우
  if (fs.existsSync(recordsFile)) {
    const data = fs.readFileSync(recordsFile, 'utf8');
    return JSON.parse(data);
  }

  return [];
}

// 업적 데이터를 저장하는 함수
function saveRecords(achievements) {
  fs.writeFileSync(recordsFile, JSON.stringify(achievements, null, 2), 'utf8');
}

// 업적 추가 함수
function addRecords(nickname, level, exp, stage) {
  const achievements = loadAchievements();
  achievements.push({ nickname, level, exp, stage, date: new Date().toISOString() });
  saveRecords(achievements);
}

// 업적 목록을 출력하는 함수
function listAchievements() {
  const achievements = loadAchievements();

   // 업적을 스테이지가 높고, 스테이지가 같은 경우 레벨이 높은 순으로 정렬
   achievements.sort((a, b) => {
    if (b.stage !== a.stage)
      return b.stage - a.stage; // 스테이지가 높은 순
    
    if (b.level !== a.level)
      return b.level - a.level; // 스테이지가 같으면 레벨이 높은 순

    return b.exp - a.exp; // 스테이지, 레벨 동일할 경우 경험치 순
  });

  console.log(chalk.green('업적 목록:'));
  achievements.forEach((achievement) => {
    console.log(`닉네임: ${achievement.nickname}`);
    console.log(`스테이지: ${achievement.stage}`);
    console.log(`레벨: ${achievement.level} (${achievement.exp})`);
    console.log(`날짜: ${achievement.date}`);
    console.log('----------------------');
  });
}

export { addRecords, listAchievements };