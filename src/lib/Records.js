import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import Singleton from './Singleton.js';

class Records extends Singleton {
  // #변수명 : private를 의미. 클래스 내부에서만 접근 가능한 변수.
  #records;
  #jsonPath = '';

  constructor() {
    super();

    // process.cwd() : 현재 작업 디렉토리의 절대 경로를 반환. (현재 Node.js 프로세스가 실행되고 있는 디렉토리의 경로)
    this.#jsonPath = path.join(process.cwd(), './resources/Records.json');
    this.#loadRecords();
  }

  // json 파일을 가져오거나 생성하는 메서드.
  #loadRecords() {
    // json 파일이 존재할 경우
    if (fs.existsSync(this.#jsonPath)) {
      const data = fs.readFileSync(this.#jsonPath, 'utf8');
      if (data !== '') {
        this.#records = JSON.parse(data);
      }
    } else {
      this.#records = [];
    }
  }

  // 기록 데이터 저장
  #saveRecords() {
    fs.writeFileSync(
      this.#jsonPath,
      JSON.stringify(this.#records, null, 2),
      'utf8'
    );
  }

  // 기록 추가
  addRecords(nickname, level, exp, stage) {
    // 닉네임 레벨 경험치 스테이지 날짜
    this.#records.push({
      nickname,
      level,
      exp,
      stage,
      date: new Date().toISOString(),
    });
    // 기록 저장
    this.#saveRecords();
  }

  // 기록 목록 출력
  listRecords() {
    // 기록 정렬
    const sortedRecords = [...this.#records].sort((a, b) => {
      // 스테이지 순
      if (b.stage !== a.stage) return b.stage - a.stage;
      // 레벨 순
      if (b.level !== a.level) return b.level - a.level;
      // 경험치 순
      return b.exp - a.exp;
    });

    // 업적 목록 출력
    console.log(chalk.green('업적 목록:'));
    sortedRecords.forEach((record) => {
      console.log(`닉네임: ${record.nickname}`);
      console.log(`스테이지: ${record.stage}`);
      console.log(`레벨: ${record.level} (${record.exp})`);
      console.log(`날짜: ${record.date}`);
      console.log('----------------------');
    });
  }
}

const records = new Records();
export default records;
